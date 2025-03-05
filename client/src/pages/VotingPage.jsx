//* Voting page after user clicked 'Vote Now'
import "./style.css";
import React, { use, useEffect, useState } from "react";
// allows for user to be redirect to another page (back to Dashboard)
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from './NavBar.jsx';

function VotingPage() {
  const [polls, setPolls] = useState([]);
  const [votes, setVotes] = useState([]);
  const [votesRemaining, setVotesRemaining] = useState(6);
  const [pollName, setPollName] = useState("");
  const [pollTopics, setPollTopics] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const { username, code } = data;
  // console.log(code);
  const url = `http://localhost:3000/user/voting-page${code}`;
  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("the response contains an error");
        }
        return response.json();
      })
      .then((data) => {
        setPolls([data]);
        setPollName(data.pollName);
        setPollTopics(data.pollTopics);
        // console.log(data.pollTopics)
        const pollTopicsLength = data.pollTopics;
        // console.log('The value of pollTopics is',pollTopicsLength)
        const tempArr = [];
        for (let i = 0; i < pollTopicsLength.length; i++) {
          tempArr.push(0);
        }
        setVotes(tempArr);
        // console.log('The value of tempArr is',tempArr)
      })
      .catch((error) => {
        console.error("error fetching data", error);
      });
  }, [url]);

  // console.log(polls);
  // console.log('The value of pollname is',pollName)

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
  console.log("The value of pollTopics is", pollTopics);

  // TODO Create Submit Button and redirect to Results / Graphs
  //
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

  return (
    <>
    <NavBar />
    <div>
      <h1>Casting your Vote</h1>
      <p>Votes Remaining:{votesRemaining} </p>
      {/* onClick handler calls submitHandleButtonClick */}
      {/* send data to db when a button is clicked */}
      <div className="labeladddeletebuttons">
        {polls.map((poll, index) => (
          <div key={index} className="buttondiv">
            <h2>{poll.pollName}</h2>
            <ul>
              {poll.pollTopics.map((topic, topicIndex) => (
                <div key={topicIndex}>
                  <div className="buttonlables">
                    {topic.pollTopic}: {votes[topicIndex]} votes
                  </div>
                  <div className="adddeletebuttons">
                    <button onClick={() => addVote(topicIndex)}>+</button>
                    <button onClick={() => deleteVote(topicIndex)}>-</button>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="submitdashboard">
        <button onClick={submitHandleButtonClick}>Submit!</button>
        <button
          onClick={() =>
            navigate("/dashboard", { state: { username: `${username}` } })
          }
        >
          Dashboard
        </button>
      </div>
    </div>
   </> 
  );
}

// export VotingPage component so that it can be used in other files
export default VotingPage;
