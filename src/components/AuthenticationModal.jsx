import React, { Component } from 'react';
import { Button, Modal, Header, Icon, Input } from 'semantic-ui-react';


class AuthenticationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameInput: '',
      passwordInput: '',
    };
  }
  handleChange = (e, { name, value }) => {
    this.setState({ [name] : value });
  }
  handleKeyPress = (e) => {
    if (e.which === 13 || e.keyCode === 13) {
      this.handleSubmit();
    }
  }
  handleSubmit = () => {
    this.props.onConfirm(this.state.usernameInput, this.state.passwordInput); 
    this.props.onClose()
  }

  render() {
    return (
      <Modal
        trigger={this.props.trigger}
        open={this.props.open}
        closeIcon
        onClose={this.props.onClose}>
        <Header content={this.props.mode} />
          <Modal.Content>
            <Input onKeyPress={this.handleKeyPress} value={this.state.usernameInput} name='usernameInput' size='large' label='username' placeholder='...' onChange={this.handleChange} />
            <br />
            <br />
            <Input onKeyPress={this.handleKeyPress} type='password' value={this.state.passwordInput} name='passwordInput' size='large' label='password' placeholder='...' onChange={this.handleChange} />
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={this.props.onClose}>
              <Icon name='remove' /> Cancel
            </Button>
            <Button 
              type='submit'
              color={this.props.confirmColor}
              onClick={this.handleSubmit}
              disabled={!this.state.usernameInput || !this.state.passwordInput}>
              {this.props.mode} <Icon name={this.props.confirmIcon} />
            </Button>
          </Modal.Actions>
        </Modal>
    )
  }
}

export default AuthenticationModal;
