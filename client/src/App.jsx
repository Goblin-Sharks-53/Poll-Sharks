import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreatePoll from './pages/CreatePoll';
import VotingPage from './pages/VotingPage';
import Confirmation from './pages/Confirmation';
import Login from './pages/Login-Page';
import Register from './pages/Register.jsx'
import PastPolls from './pages/PastPolls.jsx';
import Results from './pages/Results.jsx'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register/>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/pastpolls' element={<PastPolls />} />
        <Route path='/create-poll' element={<CreatePoll />} />
        <Route path='/confirmation' element={<Confirmation />} />
        <Route path='/voting-page' element={<VotingPage />} />
        <Route path='/results' element ={<Results />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
