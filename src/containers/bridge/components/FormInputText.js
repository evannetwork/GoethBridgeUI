import React, { Component } from 'react';
import 'antd/dist/antd.css'
import { Input } from 'antd';

class FormInputText extends Component {

  state={
    value: 0,
    type: null,
  };

  handleChange = (e) => {
    let responseObject = {};
    const value = e.target.value;
    if(this.props.type === 'targetAccount') {
      responseObject.data = value;
      responseObject.error = null;
      responseObject.type = this.props.type;
    } else {
      const isNumber = this.props.type === 'amount';
      const isNumberInvalid = isNaN(value);
      if (isNumber && !isNumberInvalid) {
        responseObject.data = value;
        responseObject.error = null;
        responseObject.type = this.props.type;
      } else if (isNumber && isNumberInvalid) {
        responseObject.data = value;
        responseObject.error = 'Invalid Number for ethereum amount';
        responseObject.type = this.props.type;
      }
    }
    this.props.returnValue(responseObject);
  }

  render() {
    const { placeholderText } = this.props;
    return (
      <div>
        <Input disabled={this.props.isDisabled} placeholder={placeholderText} onChange={this.handleChange}/>
      </div>
    );
  }
}

export default FormInputText;