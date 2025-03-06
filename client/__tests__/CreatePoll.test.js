import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import CreatePoll from '../src/pages/CreatePoll';

// Mock useNavigate and useLocation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: { username: 'TestUser' }, // Mock location state
  }),
}));

describe('Unit testing React components on CreatePoll', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders CreatePoll components', () => {
    render(<CreatePoll />);
    //screen.debug();
    expect(screen.getByText(/Name Your Poll:/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type poll name')).toBeInTheDocument();
    expect(screen.getByText(/Name of Topics:/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Type poll topic')).toHaveLength(2);
  });

  test('Contains six buttons', () => {
    render(<CreatePoll />);
    // screen.debug();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(6);
  });

  test('Contains six buttons with correct names', () => {
    render(<CreatePoll />);
    // Test Create Poll button
    //screen.debug();
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Logout');
    expect(buttons[1]).toHaveTextContent('+');
    expect(buttons[2]).toHaveTextContent('🗑️');
    expect(buttons[3]).toHaveTextContent('🗑️');
    expect(buttons[4]).toHaveTextContent('Create Poll');
    expect(buttons[5]).toHaveTextContent('Dashboard');
  });

  // after click + the number of buttons and topics input should increase 1
  test('addTopics is invoked on click', async () => {
    render(<CreatePoll />);
    let topicsInput = screen.getAllByPlaceholderText('Type poll topic');
    let buttons = screen.getAllByRole('button');
    expect(topicsInput).toHaveLength(2);
    await userEvent.click(buttons[1]);
    buttons = screen.getAllByRole('button');
    topicsInput = screen.getAllByPlaceholderText('Type poll topic');
    expect(buttons.length).toBe(7);
    expect(topicsInput).toHaveLength(3);
  });

  test('deleteTopics is invoked on click', async () => {
    render(<CreatePoll />);
    let topicsInput = screen.getAllByPlaceholderText('Type poll topic');
    let buttons = screen.getAllByRole('button');
    expect(topicsInput).toHaveLength(2);
    await userEvent.click(buttons[2]);
    buttons = screen.getAllByRole('button');
    topicsInput = screen.getAllByPlaceholderText('Type poll topic');
    expect(buttons.length).toBe(5);
    expect(topicsInput).toHaveLength(1);
  });

  test('createPoll is invoked on click with good input', async () => {
    // !response.ok
    global.fetch = jest.fn(() => 
      Promise.resolve({ ok: true, text: () => Promise.resolve('mockcode') })
    );
    render(<CreatePoll />);
    // pollName = 'goodName'
    const topicsInput = screen.getAllByPlaceholderText('Type poll topic');
    await userEvent.type(screen.getByPlaceholderText('Type poll name'), 'goodName');
    await userEvent.type(topicsInput[0], 'goodTopic1');
    await userEvent.type(topicsInput[1], 'goodTopic2');
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[4]);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/user/create-poll`, {'headers': {'Content-Type': 'application/json'}, 'method': 'POST', body: JSON.stringify({
      pollName: 'goodName', // poll name user is voting on (this should have been passed down from Dashboard)
      // TODO set up for multiple topics
      pollTopics: [{ pollTopic: 'goodTopic1' },
        { pollTopic: 'goodTopic2' },], // name of topics user selected
      createdBy: 'TestUser',
    })});
    expect(mockNavigate).toHaveBeenCalledWith('/confirmation', {
      state: { username: 'TestUser', code: 'mockcode' } // Mock location state
    });
    global.fetch.mockClear();
  });

  test('Dashboard is invoked on click', async () => {
    render(<CreatePoll />);
    userEvent.click(screen.getByText('Dashboard'));
    await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
            state: { username: 'TestUser' } // Mock location state
          });
        });
  });


});
