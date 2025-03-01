//* Dashboard / Homepage
import React, { useState } from 'react';
// need in order to direct user to another page (Create a New Poll page or Voting page)
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  // Using usestate to store the user’s response
  const [codeName, setCodeName] = useState(''); // codeName stores code typed (stores id)
  const [userName, setUserName] = useState('Name');

  // function that redirects user to Create a New Poll page or Voting page
  const navigate = useNavigate();

  // TODO Create New Poll Button
  //
  const newPollHandleButtonClick = async () => {
    // TODO user is to be redirected to create Poll
    // redirect user to createPoll.jsx
    navigate('/create-poll');
  };

  // TODO Create Vote Now Button
  //
  const voteNowHandleButtonClick = async () => {
    // TODO user is to be redirected to Voting Page
    // redirect user to createPoll.jsx
    navigate('/vote-now');
  };

  // TODO Create View Past Polls Button
  //
  const viewPastPollsHandleButtonClick = async () => {
    // TODO user is to be redirected to Past Data
    // navigate('/PastPolls.jsx');
  };

  // everything in here gets rendered to the browser
  return (
    <div>
      <h1> DASHBOARD</h1>
      <h2>Hello, {userName}</h2>
      {/* onClick handler calls newPollHandleButtonClick */}
      {/* sends data to db when a button is clicked */}
      <button onClick={newPollHandleButtonClick}>Create a New Poll</button>
      <p> Vote on a Poll</p>
      <div>
        {/* The text box for user code name input */}
        <input
          type='text'
          value={codeName}
          // onChange handler calls setGuestName to update the state whenever the user types
          onChange={(e) => setCodeName(e.target.value)} // Update state as they type
          placeholder='Enter Code'
          className='text-input'
        />

        {/* onClick handler calls voteNowHandleButtonClick */}
        <button onClick={voteNowHandleButtonClick}>Vote Now!</button>
      </div>
      <div>
        {/* onClick handler calls viewPastPollsHandleButtonClick */}
        <button onClick={viewPastPollsHandleButtonClick}>
          View Past Polls
        </button>
      </div>
    </div>
  );
}
// export Dashboard component so that it can be used in other files
export default Dashboard;
