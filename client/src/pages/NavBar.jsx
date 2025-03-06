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

//   const homeHandleClick = async () => {
//     //redirect to DashBoard
//     navigate('/dashboard')
//   }
  return (
    <div className='navBar'>
       <span
        onClick={() =>
            navigate('/dashboard', { state: { username: `${username}` } })} 
        style={{ cursor: 'pointer', margin: '0 15px', color: 'blue' }}
      >
        HOME
      </span>
      <span
        onClick={viewPastPollsHandleClick}
        style={{ cursor: 'pointer', margin: '0 15px', color: 'blue' }}
      >
        PAST POLLS
      </span>
      <span
        onClick={newPollHandleClick}
        style={{ cursor: 'pointer', margin: '0 15px', color: 'blue' }}
      >
        CREATE POLLS
      </span>
      <button>Logout</button>
    </div>
  );
};

export default NavBar;
