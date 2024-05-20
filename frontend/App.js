import React from 'react';

import './assets/global.css';

import * as Membership from './near-api/membership-api'
import { NavBar } from './components/navbar.component';
import { NearConnect } from './components/nearconnect.component';
import { Register } from './components/register.component';
import { RecognitionCard } from './components/recognition_card.component';

export default function App() {
  const [signedInUser, setSignedInUser] = React.useState();
  const [memberExists, setMemberExists] = React.useState();
  const [memberRegistered, setMemberRegistered] = React.useState();

  // If not signed-in with wallet, show prompt - sign-in flow will reload the page later
  if (!window.walletConnection.isSignedIn()) {
    return NearConnect();
  } else {
    // Get blockchain state once on component load
    React.useEffect(() => {
      Membership.getSignedInUser().then(val => setSignedInUser(val));
      Membership.memberExists().then(val => setMemberExists(val));
      Membership.isRegistered().then(val => setMemberRegistered(val));
    }, []);
  }

  return (
    <>
      <NavBar />
      <main className={'please-wait'}>
        <h1>Hello, {signedInUser}!</h1>
        {memberRegistered ? <RecognitionCard /> : <Register />}
      </main>
    </>
  )
}
