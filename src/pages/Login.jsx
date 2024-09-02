// src/Login.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../utils/AppContext';
import OtpModal from '../components/OtpModal';

const Login = () => {
  const { setAuthToken, client, } = useContext(AppContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState()

  // otp modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can add authentication logic
    // axios.defaults.xsrfCookieName = 'csrftoken'
    // axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    // axios.defaults.withCredentials = true

   client.post('/user/login/',{
    email: email,
    password: password,
   }).then((response)=>{
    if(response.status === 200){

      localStorage.setItem('token', response.data.access)
      // localStorage.setItem('refresh', response.data.refresh)
      setAuthToken(response.data.access)
      // setRefreshToken(response.data.refresh)
      
      setError('')
      navigate('/')
    }
  }).catch((error)=>{
    console.log(error.response)
    if(error.response.status === 401){
      setError('Invalid Email or Password')
    }
  })
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Login</h2>
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        {error&&<p className='error-message'>{error}</p>}
        <button type="submit" style={styles.button}>
          Login
        </button>
        <button disabled={email?false:true} onClick={(e)=>{e.preventDefault();handleOpen()}}  style={styles.otp}>
          OTP Login
        </button>
        <button onClick={(e)=>{e.preventDefault();navigate('/signup')}} style={styles.buttonSignup}>
          Signup
        </button>
      </form>
      <OtpModal
      open={open}
      handleClose={handleClose}
      handleOpen={handleOpen}
      email={email}
      setError={setError}/>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  form: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    borderRadius: '3px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  buttonSignup: {
    marginTop:'5px',
    width: '100%',
    padding: '10px',
    backgroundColor: 'green',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  otp: {
    marginTop:'5px',
    width: '100%',
    padding: '10px',
    backgroundColor: '#eb1a97',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

export default Login;
