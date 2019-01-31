import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './ProgressElement.css';
import { Row, Col, Card, Steps } from 'antd';

const Step = Steps.Step;

class ProgressElement extends Component {
  render() {
    const { ticketReleased, depositRecieved, eveTransferred } =  this.props;
    let step = 0;
    const partProgress = depositRecieved && !eveTransferred;
    const finished = depositRecieved && eveTransferred;
    if (partProgress) {
      step = 1;
    }
    if(finished) {
      step = 2;
    }

    return (
      <div>
        <Row>
          {
            !ticketReleased ? null
            : <Col>
                <Card className="cardContainer">
                <div style={stepContainer}>
                  <br />
                  <Steps progressDot current={step}>
                    <Step title="Ticket Released" description="Your ticket with fixed ETH/EVE price is released" />
                    <Step title="Deposit Recieved" description="Deposit event has been recieved." />
                    <Step title="EVE transferred" description="Your EVE have been transferred to the target account." />
                  </Steps>
                  <br />
                </div>
              </Card>
            </Col>
          }
      </Row>
     </div>
    );
  }
}

const stepContainer = {
  width: "80%",
  paddingTop: '5%',
  paddingBottom: '5%',
  margin: '0 auto',
};

const text = {
  fontSize: '1.3em',
  fontWeight: '500',
  color: '#AFA392',
  textAlign: 'center',
  paddingTop: '5%',
};

export default ProgressElement;