//* Dashboard / Homepage
import React, { useState } from 'react';
// need in order to direct user to another page (Create a New Poll page or Voting page)
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar.jsx';

function Dashboard() {
  // Using usestate to store the user’s response
  const [codeName, setCodeName] = useState(''); // codeName stores code typed (stores id)

  // function that redirects user to Create a New Poll page or Voting page
  const navigate = useNavigate();

  // getting data from login
  const location = useLocation();
  const data = location.state;
  // deconstructed data
  const { username } = data;

  console.log('username:', data.username);

  // TODO Create New Poll Button
  const newPollHandleButtonClick = async () => {
    // redirect user to createPoll.jsx
    navigate('/create-poll', { state: { username: `${username}` } });
  };

  // TODO Create Vote Now Button
  const voteNowHandleButtonClick = async () => {
    // redirect user to VotingPage.jsx
    try {
      const response = await fetch(
        `http://localhost:3000/user/results${codeName}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log(response);
      if (response.ok) {
        navigate('/voting-page', {
          state: { username: `${username}`, code: `${codeName}` },
        });
      } else {
        alert('Please input a valid poll code');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // TODO Create View Past Polls Button
  const viewPastPollsHandleButtonClick = async () => {
    // redirect user to past polls page
    navigate('/pastpolls', { state: { username: `${username}` } });
  };

  // everything in here gets rendered to the browser
  return (
    <>
      <NavBar />
      <div>
        <h1> DASHBOARD</h1>
        <h2>Hello, {username}</h2>
        {/* onClick handler calls newPollHandleButtonClick */}
        <button onClick={newPollHandleButtonClick}>Create a New Poll</button>
        <p> Vote on a Poll</p>
        <div>
          {/* The text box for user code name input */}
          <input
            type='text'
            value={codeName}
            onChange={(e) => setCodeName(e.target.value)}
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
    </>
  );
}
// export Dashboard component so that it can be used in other files
export default Dashboard;
