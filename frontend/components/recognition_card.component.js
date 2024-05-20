import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import * as Membership from '../near-api/membership-api'
import * as Recognition from '../near-api/recognition-api'

import 'react-bootstrap-typeahead/css/Typeahead.css';
import '../sample_styles.css';
import * as ReactBootstrap from 'react-bootstrap';

export function RecognitionCard() {
  const [members, setMembers] = React.useState();
  const [accountTokens, setAccountTokens] = React.useState();
  const [receiverId, setReceiverId] = React.useState();
  const [message, setMessage] = React.useState();
  const [recognitionAmount, setRecogntionAmount] = React.useState();
  const [recognitions, setRecogntions] = React.useState();

  var membersObj = [];
  var dropdownItems = [];
  var recognitionItems = [];

  try {
    if (members === undefined) {
      Membership.allMembers().then(val => setMembers(val));
    } else {
      for (let i = 0; i < members.length; i++) {
        membersObj.push({ label: members[i][0] })
      }
    }

    if (accountTokens === undefined) {
      Recognition.accountTokens().then(val => setAccountTokens(val));
    } else {
      for (let i = 0; i < accountTokens; i++) {
        dropdownItems.push(<ReactBootstrap.Dropdown.Item onClick={() => {
          setRecogntionAmount(i + 1)
        }}>{i + 1}</ReactBootstrap.Dropdown.Item>)
      };
    }

    if (recognitions === undefined) {
      Recognition.accountRecognitions().then(val => setRecogntions(val));
    } else {
      console.log(recognitions);
      for (let i = 0; i < recognitions.length; i++) {
        recognitionItems.push(
          <tr>
            <td>{i + 1}</td>
            <td>{recognitions[i].receiver_id}</td>
            <td>{recognitions[i].total_amount}</td>
            <td>{recognitions[i].message}</td>
          </tr>
        )
      }
    }
  } catch (e) {
    console.log(e);
  }

  return (
    <>
      <ReactBootstrap.Card.Body>
        <ReactBootstrap.Card.Text as="h5">Recognition Tokens: {accountTokens}</ReactBootstrap.Card.Text>
      </ReactBootstrap.Card.Body>
      <br></br>
      <ReactBootstrap.Card>
        <ReactBootstrap.Card.Header as="h5">Give Recognition</ReactBootstrap.Card.Header>
        <ReactBootstrap.Card.Body>

          <Typeahead
            id="onclear-example"
            options={membersObj}
            placeholder="Who do you want to recognise?"
            onChange={(e => setReceiverId(e.at(0).label))}
          >
          </Typeahead>

          <ReactBootstrap.Form.Group className="mt-3 mb-3" controlId="exampleForm.ControlTextarea1">
            <ReactBootstrap.Form.Control
              as="textarea"
              placeholder="(Optional) Write a message..."
              rows={3}
              onChange={e => setMessage(e.target.value)}
            />
          </ReactBootstrap.Form.Group>

          <div style={{ display: "flex" }}>
            <ReactBootstrap.Dropdown as={ReactBootstrap.ButtonGroup}>
              <ReactBootstrap.Button variant="success">{recognitionAmount === undefined ? "Tokens" : recognitionAmount}</ReactBootstrap.Button>

              <ReactBootstrap.Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

              <ReactBootstrap.Dropdown.Menu>
                {dropdownItems}
              </ReactBootstrap.Dropdown.Menu>
            </ReactBootstrap.Dropdown>

            <ReactBootstrap.Button style={{ margin: '0 0 0 10px' }} variant="primary" onClick={() => {
              console.log(receiverId);
              console.log(recognitionAmount)
              console.log(message);

              Recognition.recognise(receiverId, recognitionAmount, message)
            }}>Send</ReactBootstrap.Button>
          </div>
        </ReactBootstrap.Card.Body>
      </ReactBootstrap.Card>
      <br></br>
      <ReactBootstrap.Card>
        <ReactBootstrap.Card.Body>
          <ReactBootstrap.Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {recognitionItems}
            </tbody>
          </ReactBootstrap.Table>
        </ReactBootstrap.Card.Body>
      </ReactBootstrap.Card>
    </>
  );
}

