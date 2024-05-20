import React, { Component } from 'react'
import * as ReactBootstrap from 'react-bootstrap';
import { PublicClientApplication } from '@azure/msal-browser'
import { microsoftLogin } from '../config.js'
import * as Membership from '../near-api/membership-api'

import '../assets/global.css';

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      error: null,
      user: {},
    }

    // Initialize the MSAL application object
    this.publicClientApplication = new PublicClientApplication({
      auth: {
        clientId: microsoftLogin.appId,
        redirectUri: microsoftLogin.redirectUri,
        authority: microsoftLogin.authority
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true
      }
    })
  }

  async register() {
    try {
      await this.publicClientApplication.loginPopup({
        scopes: microsoftLogin.scopes,
        prompt: 'select_account'
      });

      Membership.registerMember();
      this.setState({ isAuthenticated: true })
    } catch (e) {
      this.setState({
        isAuthenticated: false,
        error: e,
        user: {}
      })
    }
  }

  render() {
    return (
      <div className='register' style={{ maxWidth: '600px' }}>
        <header className='register-header'>
          {this.state.isAuthenticated ?
            <p>Successfully Registered</p> :
            <div className='not-registered'>
              <p>Your account is not registered</p>
              <ReactBootstrap.Button className='btn-register' onClick={() => this.register()}>Register Now</ReactBootstrap.Button>
            </div>
          }
        </header>
      </div>
    )
  }
}

export default Register;