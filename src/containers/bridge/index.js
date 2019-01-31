import React, { Component } from 'react';
import 'antd/dist/antd.css'
import NavigationHeader from '../layout/Header';
import { Layout, Steps, Button, Row, Col, Card } from 'antd';
import ContractForm from './components/ContractForm';
import TxSummary from './components/TxSummary';
import ProgressElement from './components/ProgressElement';
import Error from './components/Error';
import getNetwork from '../../scripts/network';
import executeDeposit from '../../scripts/contract';
import provider from '../../scripts/provider';
import {
  instantiateTicketVendorContract,
  instantiateForeignBridgeContract,
  instantiateHomeBridgeContract
} from '../../scripts/goerliContract';

const ethers = require('ethers');
const { Content } = Layout;
const Step = Steps.Step;

class BridgePage extends Component {
  state= {
    amount: 0,
    network: null,
    dataProcessed: false,
    web3: null,
    error: null,
    provider: null,
    pubKey: null,
    eventRecipient: null,
    eventValue: null,
    eventToChain: null,
    eventEvent: null,
    goerliRecipient: null,
    goerliValue: null,
    goerliResponse: null,
    desopsitTxHash: null,
  };


  async getEvePerEthPrice(providerObj) {
    const ticketVendor = await instantiateTicketVendorContract(providerObj);
    const price =  await ticketVendor.functions.getCurrentPrice();
    return ethers.utils.formatEther(price.eveWeiPerEther);
  }

  async componentDidMount() {
    const selectedNetwork = await getNetwork();
    const { providerObj, pubKey } = await provider();
    const price = await this.getEvePerEthPrice(providerObj);
    this.setState({ network: selectedNetwork, provider: providerObj, pubKey, price }, () => {
      if (selectedNetwork === 'main') {
        alert('Are you sure you want to burn real ether for EVE? Please change your MetaMask settings!')
      }
    });
  }

  reset = () => {
    this.setState({
      amount: 0,
      dataProcessed: false,
      error: null,
      eventRecipient: null,
      eventValue: null,
      eventToChain: null,
      eventEvent: null,
      goerliRecipient: null,
      goerliValue: null,
      goerliResponse: null,
      desopsitTxHash: null,
    })
  }

  processRequest = async ({amount, targetAccount}) => {
    const { provider, pubKey, network } = this.state;
    if (network !== 'main') {
      this.setState({ amount, dataProcessed: true }, () => {});
      const homeBridge = await instantiateHomeBridgeContract();
      const foreignBridge = await instantiateForeignBridgeContract(provider);

      foreignBridge.on("UserRequestForAffirmation", (_recipient, _value, event) => {
        console.dir(_recipient, _value, event);
        const eAddress = _recipient.toLowerCase();
        const cAddress = pubKey.toLowerCase();
        const targetAddress = targetAccount.toLowerCase();
        if (eAddress === cAddress || eAddress === targetAddress) {
          this.setState({
            eventRecipient: _recipient,
            eventValue: _value,
            eventEvent: event,
          });
        }
      });

      const { txHash, contract } = await executeDeposit(provider, amount, network, pubKey, targetAccount);
      this.setState({ desopsitTxHash: txHash });

	    homeBridge.on("AffirmationCompleted", (_recipient, _value, _hash, event) => {
        const gAddress = _recipient.toLowerCase();
        const cAddress = pubKey.toLowerCase();
        const targetAddress = targetAccount.toLowerCase();
        if (gAddress === cAddress || gAddress === targetAddress) {
          const {
            address, blockHash, blockNumber, data, transactionHash,
           } = event;
          const responseObject = {
            address,
            blockHash,
            blockNumber,
            data,
            transactionHash,
            _recipient,
          };
          this.setState({
            goerliRecipient: _recipient,
            goerliValue: _value,
            goerliResponse: responseObject,
          });
        }
      });
    } else {
      alert('Are you sure you want to send real eth for GOETH??? Please change your MetaMask settings');
    }
  }

  getEventData = () => {
    const { network, eventRecipient, eventValue, eventToChain, eventEvent, goerliRecipient, goerliValue, goerliFromChain, goerliResponse } = this.state;
    return { eventRecipient, eventValue, eventToChain, eventEvent, goerliRecipient, goerliValue, goerliFromChain, network, goerliResponse };
  };

  resetData = () => {
    this.setState({
      dataProcessed: false,
      eventRecipient: null,
      eventValue: null,
      eventToChain: null,
      eventEvent: null,
      goerliRecipient: null,
      goerliValue: null,
      goerliFromChain: null,
      amount: 0,
     });
  };

  render() {
    const { dataProcessed, error, network } = this.state;
    const depositEventTriggered = this.state.eventRecipient !== null;
    const withdrawEventTriggered = this.state.goerliRecipient !== null;
    const eventsDisplayed = depositEventTriggered && withdrawEventTriggered;
    const evePerEther = 100;
    return (
      <Layout style={layoutStyle}>
      <NavigationHeader />
      <Layout>
        <Layout style={{ padding: '0 24px 24px', height: '100%' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: '100%' }}>
            {
              dataProcessed
              ? null
              : <Steps direction="vertical" size="small" current={1} style={{padding: '5%'}}>
                  <Step title="Step 1" description="Select MetaMask Kovan Test Network." />
                  <Step title="Step 2" description="Enter ether amount." />
                  <Step title="Step 3" description="Click send to bridge and wait for events to display to verify." />
                </Steps>
            }
            {
              error !== null
              ? <div className="errorContainer">
                  <Error errorMessage={error} />
                </div>
              : null
            }
            {
              !dataProcessed
              ? <div><div className="formDivContainer">
                  <Row>
                    <Col>
                      <Card className="cardContainer">
                        <div className="componentContainer">
                          <div>
                            <p> Current EVE per Ether price:
                              { this.state.price }
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
                <div className="formDivContainer">
                  <ContractForm activeNetwork={network} reset={this.resetData} extractData={this.processRequest} eventsComplete={eventsDisplayed}/>
                </div></div>
              : null
            }
            <div style={{margin:'0 auto', paddingTop: '2.5%' }}>
              <ProgressElement ticketReleased={dataProcessed} depositRecieved={depositEventTriggered} eveTransferred={withdrawEventTriggered} />
            </div>
            <div>
              {
                dataProcessed && eventsDisplayed
                ?
                  <Button
                  onClick={() => this.reset()}
                  type="danger">Clear Data
                </Button>
                : null
              }
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
    );
  }
}

const layoutStyle = {
  flex: 1,
  height: '100vh'
};

export default BridgePage;
