import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Homepage from './pages/Homepage';
import Calender from './pages/calenderpage/CalenderPage';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={
            <Homepage/>
          } exact
          />
           <Route path='/calender' element={
            <Calender/>
          } 
          />
          <Route path='/login' element={
            <Login/>
          } 
          />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
