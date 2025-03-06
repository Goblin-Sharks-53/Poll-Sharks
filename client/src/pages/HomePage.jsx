import { Link, useNavigate, useLocation } from 'react-router-dom';
import './HomePage.css';  
import { useState, useRef } from 'react';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [username, setUsername] = useState('');

  //from voting page
  const [polls, setPolls] = useState([]);
  const [votes, setVotes] = useState([]);
  const [votesRemaining, setVotesRemaining] = useState(6);
  const [pollName, setPollName] = useState("");
  const [pollTopics, setPollTopics] = useState([]);
  

//new popup will reassign to true when clicked
const [showVotingPopup, setShowVotingPopup] = useState(false)

  const code = '8F5046'
  const navigate = useNavigate();
  const location = useLocation();
  const usernameRef = useRef();
  const passwordRef = useRef();

  const loginRequest = async () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    console.log(username, password);
    

    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('You are logged in');
        setIsLoggedIn(true);  
        setUsername(username); 
        navigate('/dashboard', { state: { username } });
      } else {
        const error = await response.json();
        console.error('Login failed', error);
        alert('Login failed: ' + (error.message || 'Invalid login information.'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const registerButtonClick = () => {
    navigate('/register');
  };

//*popup handlers closing and opening

const openVotingPopup = () => {
  setShowVotingPopup(true);
  fetchVotingData();
}

const closeVotingPopup = () => {
  setShowVotingPopup(false);
}

//*logic taken from voting page

const fetchVotingData = async () => {
  const url = `http://localhost:3000/user/voting-page${code}`
  try{
    //fetch from database cosmo 
    const response = await fetch(url);
    const data = await response.json();
    setPolls([data]);
    setPollName([data.pollName]);
    setPollTopics(data.pollTopics);
    const pollTopicsLength = data.pollTopics;
    const tempArr = [];
    for (let i = 0; i < pollTopicsLength.length; i++) {
      tempArr.push(0);
    }
    setVotes(tempArr);
  }
  catch (error){
    console.error('Error fetching poll',error)
  }
}
const addVote = (topicIndex) => {
  // console.log(topicIndex)
  if (votesRemaining > 0 && votes[topicIndex] < 3) {
    // console.log('Voted Added')
    let updatedVotes = votes.slice();
    updatedVotes[topicIndex] = Number(updatedVotes[topicIndex]) + 1;
    setVotes(updatedVotes);
    // console.log('The value of updatedVotes is',updatedVotes)
    const updatedVotesRemaining = Number(votesRemaining) - 1;
    setVotesRemaining(updatedVotesRemaining);
    // console.log('The value of the remaining votes is', updatedVotesRemaining)
  } else {
    console.error("Add Vote failed");
    alert(
      "Couldn't add vote" +
        "Check votes remaining is 0, or if votes for a topic exceeds 3"
    );
  }
};

const deleteVote = (topicIndex) => {
  // console.log(topicIndex)
  if (votesRemaining < 6 && votes[topicIndex] > 0) {
    // console.log('Voted Deleted')
    let updatedVotes = votes.slice();
    updatedVotes[topicIndex] = Number(updatedVotes[topicIndex]) - 1;
    setVotes(updatedVotes);
    // console.log('The value of updatedVotes is',updatedVotes)
    const updatedVotesRemaining = Number(votesRemaining) + 1;
    setVotesRemaining(updatedVotesRemaining);
    // console.log('The value of the remaining votes is', updatedVotesRemaining)
  } else {
    console.error("Delete vote failed");
    alert(
      "Couldn't delete vote" +
        "Check votes remaining is 6, or if votes for a topic is 0"
    );
  }
};



// original logic from homepage
const submitHandleButtonClick = async () => {
  try {
    const updatedPollTopics = pollTopics.map((poll, index) => {
      return (poll.votes = votes[index]);
    });
    console.log("The value of poll.votes is", updatedPollTopics);
    const response = await fetch("http://localhost:3000/user/updated-votes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // pollName : `${pollName}`,
        // pollTopics: pollTopics,
        votes: votes,
        code: code,
      }),
    });
    // console.log('The value of response.body is', response);
    if (response.ok) {
      navigate("/results", {
        state: { username: `${username}`, code: `${code}` },
      });
    } else {
      const error = await response.json();
      console.error("Failed to update votes", error);
      alert(
        "Updated votes failed" +
          (error.message || "Failed to update vote information.")
      );
    }
  } catch (error) {
    console.error(error);
  }
};

// added new buttons for guest vote
  return (
    <div className="home-page">
     
      <section className="content">
        
        <h1>Welcome to the Cosmo-Poll-itan!</h1>
        <p>Here you can vote on polls, view results, and more. Please log in to create or manage your polls, or vote as a guest.</p>

        {!isLoggedIn ? (
          <>
              <h2>Login to Continue</h2>
            <div id='loginContainter'>
              <div className='inputs'>
                <label className='label'>Username</label>
                <input type='text' ref={usernameRef} />
              </div>
            </div>
            <div className="inputs">
              <label className="label">Password</label>
              <input type="password" ref={passwordRef} />
            </div>
            <div className="card">
              <button onClick={loginRequest}>Login</button>
              <button onClick={registerButtonClick}>Register</button>
            </div>
          </>
        ) : (
          <p>You are logged in as {username}. Start voting or managing polls!</p>
        )}

        <div className="cta-buttons">

        <button className="cta-btn" onClick={openVotingPopup}>Guest Vote</button>
          
        </div>
      </section>
      {showVotingPopup && (
        <div className="voting-popup">
          <div className="popup-content">
            <h2>{pollName}</h2>
            <p>Votes Remaining: {votesRemaining}</p>
            {pollTopics.map((topic, index) => (
              <div key={index} className="poll-topic">
                <span>{topic.pollTopic}: {votes[index]} votes</span>
                <div className="buttons">
                  <button onClick={() => addVote(index)}>🌭</button>
                  <button onClick={() => deleteVote(index)}>🗑️</button>
                </div>
              </div>
            ))}
            <div className="popup-buttons">
              <button onClick={submitHandleButtonClick}>Submit Votes</button>
              <button style = {{backgroundColor: 'red',color: 'black'}} onClick={closeVotingPopup}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
