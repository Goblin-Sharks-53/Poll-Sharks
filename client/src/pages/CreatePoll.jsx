//* Create Poll page after user clicked Create a new Poll
import React, { useState } from 'react';
// allows for user to be redirect to another page (back to Dashboard)
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar.jsx';

// TODO consider a delter button for extra topics created but no longer want ?

function CreatePoll() {
  const [pollName, setPollName] = useState('');
  // setting useState's intial val to be an arr of 3 objs
  const [pollTopics, setPollTopics] = useState([
    { pollTopic: '' },
    { pollTopic: '' },

  ]);

  // console.log('the value of pollName is ', pollName)
  // console.log('the value of pollTopics is', pollTopics)

  const navigate = useNavigate();

  // bringing data from: dashboard?
  const location = useLocation();
  const data = location.state;
  // deconstructed data
  const { username } = data;

  // TODO create add topics button
  const addTopicsHandleButtonClick =  () => {
    //
    setPollTopics([...pollTopics, { pollTopic: '' }]);
  };


  const deleteTopicsHandleButtonClick = (indexDelete) => {
    // Filter out the item whose index matches indexDelete
    setPollTopics((currPoll) =>
      currPoll.filter((_, index) => index !== indexDelete)
    );
  };
  
  // TODO create post req to this route/controller
  // pollController.createPol
  // TODO Create Poll Button
  // function sends the user's response to the server when they click the button (Create Poll)
  // create a new poll record in mongoose w/ fetch post req
  const createPollHandleButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/create-poll', {
        // how client sends req to server
        // fetch(arg1: server url, arg2: object (req options))
        // fetch sends req to the server at the route (route) = arg1 | req to create a new poll
        // arg2: specifying that its a get req
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollName: pollName, // poll name user is voting on (this should have been passed down from Dashboard)
          // TODO set up for multiple topics
          pollTopics: pollTopics, // name of topics user selected
          createdBy: username,
        }),
      });



      // TODO user is to be redirected to Confirmation page for poll created
      // if request is successful, redirect user to Confirmation.jsx
      if (response.ok) {
        const code = await response.text();
        
        navigate('/confirmation' ,{ state: { username: `${username}`, code: `${code}`}});
      } else {
        // otherwise log error
        console.error('Failed to Create Poll');
      }
    } catch (error) {
      // if something goes wrong in try block, error is logged
      console.error('Error:', error);
    }
  };
  // onChange handler for editing topics when being typed in
  // we must do this bc we have an arr of topics (objs) as our state, & we need to know which el in the arr they are editing
  // index is the input that's being edited, newVal is the val getting changed to
  const handlePollTopicChange = (index, newValue) => {
    // we're calling setPollTopics w/ prevPollTopics (func) to see the current state & use it to determine what the next state will be
    // normally we'd pass data that would be the next state, here we are passing a func to look at the current state, which wll help us make the dec on what the next state will be (the return val of this func is the next state)
    setPollTopics((prevPollTopics) => {
      // iterate over prev state using map to return an updated arr
      // what we want is to return an array with prior objs for inputs we are NOT editing, AND an updated obj with the input that we ARE editing
      return prevPollTopics.map((pollTopic, i) => {
        // checking if index (input we are editing) is = i (the index of the state we want to edit)
        if (index === i) {
          // if yes, return an updated obj w/ the new input val
          // (EX: if typing in 2nd box, index = 1, current iteration is on the 2nd el : i=1, so we update, & return the pollTopic obj w/ a new val)
          return { pollTopic: newValue };
        } else {
          // otherwise, the state's index does NOT match, and we return the current el unedited
          // (EX: if typing in 2nd box, index = 1, current iteration is on the 1st el : i=0, so we don't update, instead we return the ce unchanged)
          return pollTopic;
        }
      });
    });
  };

  return (
    <>
    <NavBar/>
    <div>
      {/* style inline els on the same line */}
      <h1 style={{ display: 'inline' }}>Name Your Poll: </h1>
      {/* The text box for user input */}
      <input
        type='text'
        value={pollName}
        onChange={(e) => setPollName(e.target.value)} // Update state as they type
        placeholder='Type poll name'
        className='text-input'
      />
      <div>
        <p style={{ display: 'inline' }}>Name of Topics: </p>
        {/* onClick handler calls addTopicksHandleButtonClick*/}
        <button onClick={addTopicsHandleButtonClick}>+</button>
      </div>
      {/*  iterate over pollTopics (state) and render an input tag for each poll topic. used map function to transform pollTopics into input tags for each poll topic */}
      {pollTopics.map((topic, index) => {
        return (
          <div>
            {/* The text box for user input */}
            <input
              key = {index}
              type='text'
              value={topic.pollTopic}
              onChange={(e) => handlePollTopicChange(index, e.target.value)}
              placeholder='Type poll topic'
              className='text-input'
            />
            <button onClick ={() => deleteTopicsHandleButtonClick(index)}>🗑️</button>
          </div>
        );
      })}

      {/* onClick handler calls addTopics, createPolltHandleButtonClick*/}
      <button onClick={createPollHandleButtonClick}>Create Poll</button>
      {/* onClick handler redirects user back to Dashboard */}
      <button
        onClick={() =>
          navigate('/dashboard', { state: { username: `${username}` } })
        }
      >
        {' '}
        Dashboard{' '}
      </button>
    </div>
    </>
  );
}

// export CreatePoll component so that it can be used in other files
export default CreatePoll;