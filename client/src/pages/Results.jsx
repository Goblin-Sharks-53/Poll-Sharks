import React, { use, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar.jsx';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //   const [polls, setPolls] = useState([]);
  // only passing in one poll
  const [poll, setPoll] = useState();
  const [pollName, setPollName] = useState('');
  const [pollTopics, setPollTopics] = useState([]);
  //   const [votes, setVotes] = useState([]);
  const data = location.state || {};
  const { username, code } = data;

  const url = `http://localhost:3000/user/results${code}`;
  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('the response contains an error');
        }
        return response.json();
      })

      .then((data) => {
        // console.log('data 💙:', data.pollName);
        setPoll(data);
        setPollName(data.pollName);
        // sorting our poll topics (high to low)
        // arr is the poll topics fetched from the backend, using an arr so that we don't edit our original one but instead make a copy
        const sortedTopics = [...data.pollTopics].sort(
          (a, b) => b.votes - a.votes
        );
        // we are setting our poll topic state to the sorted topics ()
        setPollTopics(sortedTopics);
      })
      .catch((error) => {
        console.error('error fetching data', error);
      });
  }, [url]);

  // we must return a loding div until data comes back from our fetch req
  if (poll === undefined) {
    return <div>Loading</div>;
  }

  return (
    <>
    <NavBar />
    <div>
      <h1>Results</h1>
      <div>
        <div>
          <h2>{pollName}</h2>
          {/* ul will wrap our unordered list */}
          <ul>
            {/* as mapping happens, it'll loop through, and check the index for where the topic ranks  */}
            {pollTopics.map((topic, topicIndex) => {
              let rank;
              if (topicIndex === 0) {
                rank = '1st Place';
              } else if (topicIndex === 1) {
                rank = '2nd Place';
              } else if (topicIndex === 2) {
                rank = '3rd Place';
              } else {
                rank = `${topicIndex + 1}th Place`;
              }
              {
                /* inside our list, each poll topic will be rendered as a list item */
              }
              return (
                <li key={topicIndex}>
                  {rank}: {topic.pollTopic} - {topic.votes} votes
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <button
        onClick={() =>
          navigate('/dashboard', { state: { username: `${username}` } })
        }
      >
        Dashboard
      </button>
      <button
        onClick={() =>
          navigate('/resultsGraph', {
            state: { username: `${username}`, code: `${code}` },
          })
        }
      >
        View Results Graph!
      </button>
    </div>
    </>
  );
};

export default Results;
