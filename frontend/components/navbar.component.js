import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { signOutNearWallet } from '../near-api';

export function NavBar() {
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
              <ReactBootstrap.Nav.Link href="#action1">My Wallet</ReactBootstrap.Nav.Link>
              <ReactBootstrap.Nav.Link href="#action2">Rewards</ReactBootstrap.Nav.Link>
              <ReactBootstrap.Nav.Link href="#action3">Recognition</ReactBootstrap.Nav.Link>
              <ReactBootstrap.Nav.Link href="#action4">How To</ReactBootstrap.Nav.Link>
            </ReactBootstrap.Nav>
            
            <ReactBootstrap.DropdownButton id="dropdown-basic-button" title={walletConnection.getAccountId()} style={{ float: 'right' }}>
              {/* <ReactBootstrap.Dropdown.Item>{stuff()}</ReactBootstrap.Dropdown.Item> */}
              <ReactBootstrap.Dropdown.Item onClick={signOutNearWallet}>Sign Out</ReactBootstrap.Dropdown.Item>
            </ReactBootstrap.DropdownButton>
            </ReactBootstrap.Navbar.Collapse>
        </ReactBootstrap.Container>
      </ReactBootstrap.Navbar>
    </main>
  );
}