//Boilerplate imports------------------------------
const router = require('../routers/routers');
const express = require('express');
const { Poll } = require('../models/users');
const crypto = require('crypto');

const pollController = {};

//This is the controller for the dashboard vote now button
pollController.dashboardVoteNow = async (req, res, next) => {
  try {
    //destructure req.body to take the incoming code
    // console.log('The value of the incoming req.body.code is', req.body.code);
    const { code } = req.body;
    // console.log('The value of the code is', code);
    //assign a variable to the value of the code inside of the database
    const poll = await Poll.findOne({ code: code });
    // console.log('The value of the poll is', poll);
    //check if the code exist inside of the database
    if (poll) {
      //if it exist inside of the database, return a 200 response
      next();
    } else {
      //otherwise throw an error
      return res
        .status(400)
        .json({ message: "code doesn't exist in database" });
    }
  } catch (err) {
    return next({
      log: 'You are receiving an error from the pollController.dashboardVoteNow',
      status: 500,
      message: { err: 'This is a 500 error message' },
    });
  }
};

pollController.createPoll = async (req, res, next) => {
  try {
    // await Poll.deleteMany({});
    const { pollName, pollTopics, createdBy } = req.body;
    const generateUniqueCode = async () => {
      let code;
      let exists = true;
      while (exists) {
        code = crypto.randomBytes(3).toString('hex').toUpperCase();
        exists = await Poll.findOne({ code });
      }
      return code;
    };
    const code = await generateUniqueCode();
    const pollTopicsWithVotes = pollTopics.map((topic) => ({
      ...topic,
      votes: 0,
    }));
    const poll = await Poll.create({
      pollName,
      pollTopics: pollTopicsWithVotes,
      code,
      createdBy,
    });
    // console.log('The value of poll is', poll);
    res.locals.code = code;
    next();
  } catch (err) {
    return next({
      log: 'You are receiving an error from the pollController.createPoll',
      status: 500,
      message: { err: 'This is a 500 error message' },
    });
  }
};

pollController.pastPolls = async (req, res, next) => {
  const username = req.params.username
  const poll = await Poll.find({createdBy: username});
  // console.log('The value of the poll is', poll);
  res.locals.polls = poll;
  next();
};

pollController.votingPage = async (req, res, next) => {
  const code = req.params.code;
  // console.log('The value of the code is ',code)

  const poll = await Poll.findOne({ code });
  // console.log('The value of the poll is ', poll)
  res.locals.poll = poll;
  next();
};

pollController.updatedVotes = async (req, res, next) => {
  // console.log('The value of req.body is',req.body)
  const votes = req.body.votes;
  // console.log('The value of incoming votes is',votes)
  const updatedPoll = await Poll.findOne({ code: req.body.code });
  // console.log('The value of the updated poll is',updatedPoll.pollTopics)
  const pollTopics = updatedPoll.pollTopics;
  // console.log('The value of the updated poll is', pollTopics)
  pollTopics.map((poll, index) => {
    // console.log('The value of poll.votes is',poll.votes)
    // console.log('The value of votes[index]is', votes[index])
    return (poll.votes = Number(poll.votes) + votes[index]);
  });
  // console.log('The value of updatedPollTopics is', updatedPoll);
  await Poll.findOneAndUpdate({ code: req.body.code },  updatedPoll );
  next();
};

pollController.getResults = async (req, res, next) => {
  //get the data from database
  // console.log(req.params.code)
  const code = req.params.code
  const data = await Poll.findOne({ code: code })
  // console.log('the value of data is', data)
  res.locals.data = data
  next ()
}

module.exports = pollController;
