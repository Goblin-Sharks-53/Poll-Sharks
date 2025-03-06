import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';  
import { useState, useRef } from 'react';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const usernameRef = useRef();
  const passwordRef = useRef();

  const loginRequest = async () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    console.log(username, password);

    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('You are logged in');
        setIsLoggedIn(true);  
        setUsername(username); 
        navigate('/dashboard', { state: { username } });
      } else {
        const error = await response.json();
        console.error('Login failed', error);
        alert('Login failed: ' + (error.message || 'Invalid login information.'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const registerButtonClick = () => {
    navigate('/register');
  };

  return (
    <div className="home-page">
      <nav className="nav-bar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/guest-voting">Guest Voting</Link></li>
          <li><Link to="/register">Register</Link></li> {/* Register button */}
        </ul>
      </nav>

      <section className="content">
        <h1>Welcome to the Polls Page!</h1>
        <p>Here you can vote on polls, view results, and more. Please log in to create or manage your polls, or vote as a guest.</p>

        {!isLoggedIn ? (
          <>
            <h2>Login to Continue</h2>
            <div className="inputs">
              <label className="label">Username</label>
              <input type="text" ref={usernameRef} />
            </div>
            <div className="inputs">
              <label className="label">Password</label>
              <input type="password" ref={passwordRef} />
            </div>
            <div className="card">
              <button onClick={loginRequest}>Login</button>
              <button onClick={registerButtonClick}>Register</button>
            </div>
          </>
        ) : (
          <p>You are logged in as {username}. Start voting or managing polls!</p>
        )}

        <div className="cta-buttons">
          <Link to="/guest-voting">
            <button className="cta-btn">Vote as Guest</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
