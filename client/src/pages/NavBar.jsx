import { Link } from 'react-router-dom';
import './nav.css'


const NavBar = () => {

    return (
        <div className='navBar' styles='./nav.css'>
            <Link to="/">HOME</Link>
            <Link to="/pastpolls">PAST POLLS</Link>
            <Link to=''>PUBLIC POLLS</Link>
            <button>Logout</button> 
        </div>

    )
};

export default NavBar;