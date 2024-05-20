import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { signInWithNearWallet } from '../near-api';

export function NearConnect() {
  return (
    <main>
      <ReactBootstrap.Navbar>
      <ReactBootstrap.Container fluid>
        <ReactBootstrap.Navbar.Brand href="#" className='nav-logo'></ReactBootstrap.Navbar.Brand>
        <ReactBootstrap.Navbar.Toggle aria-controls="navbarScroll" />
        <ReactBootstrap.Navbar.Collapse id="navbarScroll">
          <ReactBootstrap.Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
          </ReactBootstrap.Nav>
          <ReactBootstrap.Button onClick={signInWithNearWallet} style={{ float: 'right' }}>Sign in with NEAR Wallet</ReactBootstrap.Button>
          </ReactBootstrap.Navbar.Collapse>
      </ReactBootstrap.Container>
      </ReactBootstrap.Navbar>

      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <h1>Welcome to Synthesis Coin!</h1>
    </main>
  );
}