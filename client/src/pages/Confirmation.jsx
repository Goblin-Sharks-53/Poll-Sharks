//* Confirmation page after user clicked Create Poll

import React, { useState } from 'react';

// allows for user to be redirect to another page (back to Dashboard)
import { useNavigate, useLocation } from 'react-router-dom';

function Confirmation() {
  const [userName, setUserName] = useState('username');
  const navigate = useNavigate();

  // TODO Create where users click Vote Now
  // function sends the user's response to the server when they click the button (Create Poll)
  // create a new poll record in mongoose w/ fetch post req
  const voteNowHandleButtonClick = async () => {
    try {
      const response = await fetch('/', {
        // how client sends req to server
        // fetch(arg1: server url, arg2: object (req options))
        // fetch sends req to the server at the route (route) = arg1 | req to create a new poll
        // arg2: specifying that its a get req
        method: 'GET',
      });

      // TODO user is to User Input page
      // if request is successful, redirect user to Confirmation.jsx
      if (response.ok) {
        navigate('/UserInput.jsx');
      } else {
        // otherwise log error
        console.error('Failed to get the requested poll');
      }
    } catch (error) {
      // if something goes wrong in try block, error is logged
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Congrats, {userName}</h1>
      <p>Your poll code is ready to be shared! </p>
      <p> code</p>
      <p>Vote on your code: </p>
      <p> code space</p>
      {/* onClick handler calls voteNowHandleButtonClick */}
      {/* send data to db when a button is clicked */}
      <button onClick={voteNowHandleButtonClick}>Vote Now!</button>
      <button onClick={() => navigate('/')}>Dashboard</button>
    </div>
  );
}

// export VotingPage component so that it can be used in other files
export default Confirmation;
