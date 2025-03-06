//Boilerplate imports
import { useRef, useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import './Login-Page.css';
// import NavBar from './NavBar.jsx';
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> development
=======
>>>>>>> development

function Login() {
  // declare navigate to change webaddresses
  const navigate = useNavigate();

  // setting the username/passRefs as useRef.
  const usernameRef = useRef();
  const passwordRef = useRef();

  async function loginRequest() {
    // the buttonclick invokes this function
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    console.log(username);
    console.log(password);
    try {
      console.log('hello Cosmo');
      //below is making fethc request to server
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password }),
      });
      console.log('The value of response.body is', response);
      if (response.ok) {
        console.log('You are logged in');
        // the line below is currently refreshing the page. we can test a redirect with another page once we have one, but it currently isn't correct.
        // window.location.href = '/' //put page structure for Dashboard/Homepage here.
        navigate('/dashboard', {
          state: { username: `${username}` },
        });
      } else {
        const error = await response.json();
        console.error('Login failed', error);
        alert('Login failed' + (error.message || 'Invalid login information.'));
      }
    } catch (error) {
      console.error(error);
    }
  }

  const registerButtonClick = async () => {
    // redirect user to Register.jsx
    navigate('/register');
  };

  return (
    <>
      {/* <NavBar /> */}
      <div>
        <h1>Log In</h1>
        <div className='inputs'>
          <label className='label'>Username</label>
          <input type='text' ref={usernameRef} />
        </div>
        <div className='inputs'>
          {' '}
          <label className='label'>Password</label>
          <input type='password' ref={passwordRef} />
        </div>
        <div className='card'>
          <div>
            <button onClick={loginRequest}>Login</button>
            <button onClick={registerButtonClick}>Register</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
