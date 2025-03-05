import { useState } from 'react';
import '../App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar.jsx';

const PastPolls = () => {
  const navigate = useNavigate();

  // bringing data from: dashboard?
  const location = useLocation();
  const data = location.state;
  // deconstructed data
  const { username } = data;
  console.log(data)

  const [polls, setPolls] = useState([]);

  const getPastPolls = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/pastpolls${username}`);
      const data = await response.json();
      console.log(data);
      setPolls(data);
    } catch (error) {
      console.error('Error fetching past polls:', error);
    }
  };

  return (
    <>
    <NavBar />
    <div>
      <h1>Past Polls:</h1>
      <button onClick={() => getPastPolls()}>Past Polls</button>
      {polls.map((poll, index) => (
        <div key={index}>
          <h2>{poll.pollName}</h2>
          <ul>
            {poll.pollTopics.map((topic, topicIndex) => (
              <li key={topicIndex}>
                {topic.pollTopic}: {topic.votes} votes
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button
        onClick={() =>
          navigate('/dashboard', { state: { username: `${username}` } })
        }
      >
        Dashboard
      </button>
      <button
        onClick={() =>
          navigate('/pastPollsGraph', { state: { username: `${username}` } })
        }
      >
       Past Polls Graphs
      </button>
    </div>
    </>
  );
};

export default PastPolls;
