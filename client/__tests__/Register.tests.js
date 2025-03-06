import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Register from '../src/pages/Register';
import React from 'react';

//? Setting up mock for useNavigate before rendering component (TEST 7)
// makes mock function that lets us see if navigate was called
const mockNavigate = jest.fn();
// mock useNavigate to track if it was called
jest.mock('react-router-dom', () => ({
  // keeps other React Router functions working
  ...jest.requireActual('react-router-dom'),
  // replace `useNavigate` with a Jest mock function
  useNavigate: jest.fn(() => mockNavigate),
}));

// Wrap component in BrowserRouter to render Register inside router (helper function)
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

//? TESTS
describe('Register Page', () => {
  // this is to be done before EVERY test, makes sure fetch is mocked
  beforeEach(() => {
    // mocks `fetch()` to control the return value of the response. Whatever we pass to mockResolvedValue is what the fetch will return
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    });
  });

  //? TESTING (1): that the Register page renders correctly
  it('renders the Register page heading', () => {
    renderWithRouter(<Register />);
    // will check if the text "Register" is rendering on the screen
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  //? TESTING (2): the nav bar

  //? TESTING (3): that the inputs and button exist on the page
  it('renders username input, password input and signup button', () => {
    renderWithRouter(<Register />);
    // will store the reference to username (usernameInput), then use usernameInput to then check that it finds an el w/ the role of textbox
    const usernameInput = screen.getByRole('textbox');
    // will check that the username input is on the screen
    expect(usernameInput).toBeInTheDocument();

    // will store the reference to password (passwordInput), then use passwordInput to then check that it finds an el w/ the role of textbox
    const passwordInput = screen.getByRole('textbox');
    // will check that the password input is on the screen
    expect(passwordInput).toBeInTheDocument();

    // will check that it finds a button labeled "Sign Up"
    const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
    expect(signUpButton).toBeInTheDocument();

    // below syntax also works, but for uniformity purposes, will stick w/ syntax from above

    // expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  //? TESTING (4): that typing into username input works
  it('username input works', async () => {
    renderWithRouter(<Register />);
    const usernameInput = screen.getByRole('textbox');

    // will check that typing into the username input works
    await userEvent.type(usernameInput, 'testinguser');
    expect(usernameInput.value).toBe('testinguser');
  });

  //? TESTING (5): that typing into password input works
  it('password input works', async () => {
    renderWithRouter(<Register />);
    const passwordInput = screen.getByTestId('register-password');

    // will check that typing into the password input works
    await userEvent.type(passwordInput, 'testingpassword');
    expect(passwordInput.value).toBe('testingpassword');
  });

  //? TESTING (6): that clicking the sign up button triggers the registration request
  it('when clicking the Sign Up button, the function regRequest is called', async () => {
    renderWithRouter(<Register />);
    // mock funtion to track if regRequest is called
    const mockRegRequest = jest.fn();

    // finds the username input
    const usernameInput = screen.getByRole('textbox');
    // finds the password input
    const passwordInput = screen.getByTestId('register-password');
    // finds the Sign Up button
    const button = screen.getByRole('button', { name: /Sign Up/i });

    // Fill in the username input and password input
    await userEvent.type(usernameInput, 'testinguser');
    await userEvent.type(passwordInput, 'testingpassword');

    // replace the real function with our mock function
    button.onclick = mockRegRequest;

    // click the Sign Up button (regRequest function is called)
    fireEvent.click(button);

    //check if the mock function was called when the button was clicked
    expect(mockRegRequest).toHaveBeenCalled();
  });

  //? TESTING (7): that clicking the Sign Up button calls navigate w/ correct path (/dashboard)
  it('clicking the Sign Up button navigates user to Dashboard', async () => {
    renderWithRouter(<Register />);
    // finds the username input
    const usernameInput = screen.getByRole('textbox');
    // finds the password input
    const passwordInput = screen.getByTestId('register-password');
    // finds the Sign Up button
    const button = screen.getByRole('button', { name: /Sign Up/i });
    // fill in the username input and password input
    await userEvent.type(usernameInput, 'testinguser');
    await userEvent.type(passwordInput, 'testingpassword');
    // click the Sign Up button (regRequest function is called)
    fireEvent.click(button);

    // making an await function to wait for the fectch func to be called
    await waitFor(() => {
      // check if navigate was called w/ correct args, then user is redirected to  "/dashboard"
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
        state: { username: 'testinguser' },
      });
    });
  });
});
