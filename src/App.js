import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import "./App.css";
import Routes from "./Routes";
import logo from "./img/logo.png"

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();

    this.userHasAuthenticated(false);

    this.props.history.push("/login");
  }


  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    const Navbar = (props) =>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark" id="nav">
        <a class="navbar-brand" href="/">
          <img src={logo} width="30" height="30" class="d-inline-block align-top" alt="logo"/>
           <span id="title">Social Books</span>
        </a>
        <div className="ml-auto">
          {props.authenticated ? (
            <button className="btn btn-primary" onClick={this.handleLogout}>Logout</button>
          ) : (
            <div>
              <a href="/login" className="btn btn-primary" role="button" aria-pressed="true">Log in</a>
              <a href="/signup" className="btn btn-primary" role="button" aria-pressed="true">Sign up</a>
            </div>
          )}
        </div>

      </nav>

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar authenticated={this.state.isAuthenticated}/>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
