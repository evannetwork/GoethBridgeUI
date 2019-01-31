import React, { Component } from 'react';
import 'antd/dist/antd.css'
import './Header.css';
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header } = Layout;
const MenuItemGroup = Menu.ItemGroup;

class NavigationHeader extends Component {
  render() {
    return (
      <Header className="header">
        <div>
          <div className="logo" />
            <Menu theme="dark" mode="horizontal" className="menuStyle">
                <Menu.Item key="2" className='orgName'>evan.network Bridge</Menu.Item>
            </Menu>
        </div>
      </Header>
    );
  }
}

export default NavigationHeader;
