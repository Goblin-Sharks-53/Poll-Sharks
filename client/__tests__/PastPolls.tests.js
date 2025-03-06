import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useLocation } from 'react-router-dom';
import PastPolls from '../src/pages/PastPolls';
import React from 'react';

//? Setting up mock for useNavigate before rendering component (TEST)
// makes mock function that lets us see if navigate was called
const mockNavigate = jest.fn();
// mock useNavigate to track if it was called
jest.mock('react-router-dom', () => ({
  // keeps other React Router functions working
  ...jest.requireActual('react-router-dom'),
  // replace `useNavigate` with a Jest mock function
  useNavigate: jest.fn(() => mockNavigate),
  // mocking location state
  useLocation: () => ({ state: { username: 'marshall' } }),
}));

// Wrap component in BrowserRouter to render Register inside router (helper function)
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// TESTS
describe('Past Polls', () => {
  // this is to be done before EVERY test, makes sure fetch is mocked
  beforeEach(() => {
    // mocks `fetch()` to control the return value of the response. Whatever we pass to mockResolvedValue is what the fetch will return
    global.fetch = jest.fn().mockResolvedValue({
      // mockResolvedValue is what json will return, polldata which is an arr of objs
      json: jest.fn().mockResolvedValue([
        {
          _id: '123',
          pollName: 'locations',
          pollTopics: [
            { pollTopic: 'italy', votes: 2, _id: '1234' },
            { pollTopic: 'ireland', votes: 2, _id: '12345' },
            { pollTopic: 'iceland', votes: 2, _id: '123456' },
          ],
          code: 'ABC123',
          createdBy: 'marshall',
        },
      ]),
    });
  });

  //? TESTING (1): that the Past Polls page renders correctly
  it('renders the Past Polls page heading', () => {
    renderWithRouter(<PastPolls />);
    // will check if the text "Past Polls" is rendering on the screen
    expect(screen.getByText('Past Polls')).toBeInTheDocument();
  });

  //? TESTING (2): the nav bar
  // it('renders the nav bar', () => {
  //   renderWithRouter(<PasPolls />);

  //   expect();
  // });

  //? TESTING (3): that the buttons (Past Polls & Past Polls Graphs) exists on the page
  // it('renders past polls button and past polls graphs button', () => {
  //   renderWithRouter(<PasPolls />);

  //   expect();
  // });

  //? TESTING (4): that clicking the Past Polls button triggers the getPastPolls function
  // it('when clicking the Past Polls button, the function getPastPolls is called', () => {
  //   renderWithRouter(<PasPolls />);

  //   expect();
  // });

  //? TESTING (5): that clicking the Past Polls button calls navigate w/ the correct path (pop up)
  // it('clicking the Past Polls button navigates user to Pop Up', () => {
  //   renderWithRouter(<PasPolls />);

  //   expect();
  // });

  //? TESTING (6): that clicking the Past Polls Graphs button triggers the pastPollsGraphs and navigates w/ the correct path (/oastPollsGraph)
  //   it('clicking the Past Polls Graphs button, triggers the pastPollsGraphs and navigates user to Past Polls Graphs Page ', () => {
  //     renderWithRouter(<PasPolls />);

  //     expect();
  //   });
});
