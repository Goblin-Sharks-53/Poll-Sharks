import { useRef, useState } from 'react';
import '../App.css';
import './Register.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  // declare navigate to change webaddresses
  const navigate = useNavigate();

  // setting the email/passRefs as useRef.
  const usernameRef = useRef();
  const passwordRef = useRef();

  async function regRequest() {
    // the buttonclick invokes this function
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    console.log(username);
    console.log(password);
    try {
      const response = await fetch('http://localhost:3000/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (response.ok) {
        console.log('You are logged in');
        navigate('/dashboard', {
          state: { username: `${username}` },
        });
      } else {
        const error = await response.json();
        console.error('Registration failed', error);
        alert('Login failed' + (error.message || 'Invalid login information.'));
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h1>Register</h1>
      <div className='inputs'>
        <label className='label'>Username</label>
        <input type='text' ref={usernameRef} />
      </div>
      <div className='inputs'>
        {' '}
        <label className='label'>Password</label>
        <input
          type='password'
          data-testid='register-password'
          ref={passwordRef}
        />
      </div>
      <div className='card'>
        {/* onclick, this should update the refsand  */}
        <button onClick={regRequest}>Sign Up</button>
      </div>
    </>
  );
}

export default Register;
