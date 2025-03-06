import './nav.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const NavBar = () => {
  //setting react variables equal to
  const navigate = useNavigate();
  const location = useLocation();
// getting the username state so we can refrence them later on in handleClicks
  const data = location.state;
  console.log('state in navBar:' + data);
  const username = data.username;

  const viewPastPollsHandleClick = async () => {
    // redirect user to past polls page
    navigate('/pastpolls', { state: { username: `${username}` } });
  };

  const newPollHandleClick = async () => {
    // redirect user to createPoll.jsx
    navigate('/create-poll', { state: { username: `${username}` } });
  };

  const handleClickLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
};

  
  return (
    <div className='navBar'>
       <span class='highlight' 
        onClick={() =>
            navigate('/dashboard', { state: { username: `${username}` } })} 
        style={{ cursor: 'pointer', margin: '0 15px', color: 'white' }}
      >
        HOME
      </span>
      <span class='highlight'
        onClick={viewPastPollsHandleClick}
        style={{ cursor: 'pointer', margin: '0 15px', color: 'white' }}
      >
        PAST POLLS
      </span>
      <span class='highlight'
        onClick={newPollHandleClick}
        style={{ cursor: 'pointer', margin: '0 15px', color: 'white' }}
      >
        CREATE POLLS
      </span>
      <button className='logout' onClick={handleClickLogout}>Logout</button>
    </div>
  );
};

export default NavBar;
