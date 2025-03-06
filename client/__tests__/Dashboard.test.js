import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
// MemoryRouter does not affect the actual browser's URL.
// import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../src/pages/Dashboard';


// Mock useNavigate and useLocation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: { username: 'TestUser' } // Mock location state
  })
}));


describe('Unit testing React components', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  })

  // checking if username being showed on Dashboard
  test('renders Dashboard with username', () => {
    render(<Dashboard />);
    expect(screen.getByText(/DASHBOARD/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello, TestUser/i)).toBeInTheDocument();
  });

  test('Contains three buttons', () => {
    render(<Dashboard />);
    // screen.debug();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  test('Contains three buttons with correct names', () => {
    render(<Dashboard />);
    // Test Create Poll button
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Create a New Poll');
    expect(buttons[1]).toHaveTextContent('Vote Now!');
    expect(buttons[2]).toHaveTextContent('View Past Polls');
  });

  test('Creat a New Poll is invoked on click', async () => {
    render(<Dashboard />);
    userEvent.click(screen.getByText('Create a New Poll'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/create-poll', {
        state: { username: 'TestUser' } // Mock location state
      });
    })
    
  });

  test('Vote Now! is invoked on click with bad input', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {}); 
    global.fetch = jest.fn(() => 
      Promise.resolve({ ok: false })
    );
    render(<Dashboard />);
    await userEvent.type(screen.getByPlaceholderText('Enter Code'), 'TestVote');
    await userEvent.click(screen.getByText('Vote Now!'));
    // suppose to send GET request to url
    //await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/user/resultsTestVote`, {"headers": {"Content-Type": "application/json"}, "method": "GET"});
      expect(window.alert).toHaveBeenCalledWith('Please input a valid poll code');
    //})
    global.fetch.mockClear();
    window.alert.mockRestore();
  });

  test('Vote Now! is invoked on click with good input', async () => {
    global.fetch = jest.fn(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );
    render(<Dashboard />);
    await userEvent.type(screen.getByPlaceholderText('Enter Code'), '123');
    await userEvent.click(screen.getByText('Vote Now!'));
    // suppose to send GET request to url
    //await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/user/results123`, {"headers": {"Content-Type": "application/json"}, "method": "GET"});
      expect(mockNavigate).toHaveBeenCalledWith('/voting-page', {
        state: { username: 'TestUser', code: '123' },
      });
    //})
    global.fetch.mockClear();
  });

  test('View Past Polls is invoked on click', async () => {
    render(<Dashboard />);
    userEvent.click(screen.getByText('View Past Polls'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/pastpolls', {
        state: { username: 'TestUser' } // Mock location state
      });
    })
    
  });

});
