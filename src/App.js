import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Homepage from './pages/Homepage';
import Calender from './pages/calenderpage/CalenderPage';
import Login from './pages/Login';
import PrivateRoute from './utils/PrivateRoute';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={
            <PrivateRoute>
              <Homepage/>
            </PrivateRoute>
          } exact
          />
           <Route path='/calender' element={
            <PrivateRoute>
              <Calender/>
            </PrivateRoute>

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
