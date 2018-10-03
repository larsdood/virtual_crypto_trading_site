import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AuthenticationModal from '../components/AuthenticationModal';
import { Menu, Button, Responsive, Dropdown, Icon } from 'semantic-ui-react';
import { logIn, logOut, register } from '../state/actions';
import { totalValueSelector } from '../state/selectors';
import { formatUSD } from '../Util';

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'home',
    }
  }

  handleOpenModal = modalName => this.setState({[modalName]: true})
  handleCloseModal = modalName => this.setState({[modalName]: false})

  changeActive = (e, { name }) => {
    this.setState({
      activeItem: name
    });
  }

  usernameInputHandler = (e, { value }) => {
    this.setState({ usernameInput: value})
  }

  renderLoginLogoutRegister = () => {
    if (this.props.isLoggedIn) {
      return (
        <Fragment>
          <Menu.Item name={'username'} content={this.props.username} />
          <Menu.Item name={'balance'} content={this.props.totalValue && formatUSD(this.props.totalValue)} />
          <Menu.Item
            name='logout'
            onClick={this.props.logOut}
            />
      </Fragment>
      )
    }
    return (
      <Fragment>
        <AuthenticationModal
          trigger={<Menu.Item name='login' onClick={() => this.handleOpenModal('loginModal')}/>}
          open={this.state.loginModal}
          mode='Login'
          onClose={() => this.handleCloseModal('loginModal')}
          onConfirm={(username, password) => this.props.logIn(username, password)}
          confirmColor='teal'
          confirmIcon='chevron circle right'
          />

        <AuthenticationModal
          trigger=
            {<Menu.Item>
              <Button color='teal' onClick={() => this.handleOpenModal('registerModal')}>Register</Button>
            </Menu.Item>}
          open={this.state.registerModal}
          mode='Register'
          onClose={() => this.handleCloseModal('registerModal')}
          onConfirm={(username, password) => this.props.register(username, password)}
          confirmColor='teal'
          confirmIcon='user plus'/>
      </Fragment>
    )
  }

  renderMobileLoginLogoutSection = () => {
    return <div>hello</div>
  }

  render() {
    let { activeItem } = this.state;
    return (
      <Fragment>
          <Menu tabular pointing secondary>
            <Responsive as={Menu.Menu} minWidth='768'>
                <Menu.Item as={Link} to='/' name='home' active={activeItem === 'home'} onClick={this.changeActive} />
                <Menu.Item
                  as={this.props.isLoggedIn && true ? Link : Menu.Item}
                  to='/portfolio'
                  name='portfolio'
                  disabled={!this.props.isLoggedIn}
                  active={activeItem === 'portfolio'}
                  onClick={this.changeActive}
                />
            </Responsive>
            <Responsive maxWidth='767'>
            <Dropdown item simple icon='th large' >
              <Dropdown.Menu>
                  <Dropdown.Item as={Link} to='/' text='Home' active={activeItem === 'home'} onClick={this.changeActive}/>
                  <Dropdown.Item 
                  as={this.props.isLoggedIn && true ? Link : Menu.Item}
                  to='/portfolio'
                  name='portfolio'
                  disabled={!this.props.isLoggedIn}
                  active={activeItem === 'portfolio'}
                  onClick={this.changeActive}
                  text = 'Portfolio'
                  />
              </Dropdown.Menu>
              </Dropdown>
          </Responsive>
            <Menu.Menu position='right'>
              {this.renderLoginLogoutRegister()}
            </Menu.Menu>
          </Menu>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  totalValue: totalValueSelector(state),
  username: state.username,
})

const mapDispatchToProps = dispatch => ({
  register: (user, pass) => dispatch(register.request(user, pass)),
  logIn: (user, pass) => dispatch(logIn.request(user, pass)),
  logOut: () => dispatch(logOut.request()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
