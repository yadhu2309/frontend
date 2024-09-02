import React, { useContext, useState } from 'react';
import { AppContext } from '../utils/AppContext';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const { client } =useContext(AppContext)
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState({});
  const [success, setSuccess] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(name);
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
const newError = {}
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      newError.confirmPassword = "Passwords do not match";
      setError(newError)
      return;
    }
    if (!validateEmail(formData.email)) {
        newError.email = "Invalid email format";
        setError(newError)
        return;
      }
       // Name validation
    if (!validateName(formData.name)) {
        newError.name = "Invalid name. Name should only contain letters."
        setError(newError)
        return;
      }

    try {
      // Make the Axios request to your backend API
      const response = await client.post('/user/register/', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.password
      });

      console.log(response.data)
      navigate('/login')
      // Handle success
    //   setSuccess("Signup successful!");

      setError({});

    } catch (error) {
      // Handle error
      console.log(error, error.response.data.email)
      const newerror = {}
      if(error.status == 400){
        if(error.response.data.email){

            newerror.email = error.response.data.email[0]
        }
        if(error.response.data.name){

            newerror.name = error.response.data.name[0]
        }
        if(error.response.data.password){

            newerror.password = error.response.datapassword[0]
        }
        if(error.response.data.confirm_password){

            newerror.confirmPassword = error.response.data.confirm_password[0]
        }
        setError(newerror)
        
      }
    //   setError("Signup failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>

      <form onSubmit={handleSubmit} style={styles.form}>
        {error&&console.log(error)}
      <h2>Signup</h2>
                <div style={styles.inputGroup}>

          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        {error.name && <p className="error-message">{error.name}</p>}

                <div style={styles.inputGroup}>

          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        {error.email && <p className="error-message">{error.email}</p>}

                <div style={styles.inputGroup}>

          <label>Password:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        {error.password && <p className="error-message">{error.password}</p>}

                <div style={styles.inputGroup}>

          <label>Confirm Password:</label>
          <input 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
          />
        </div>
        {error.confirmPassword && <p className="error-message">{error.confirmPassword}</p>}

        <button type="submit" style={styles.button}>Sign Up</button>
        <button onClick={(e)=>{ e.preventDefault();navigate('/login')}} style={styles.buttonLogin}>Login</button>

      </form>
    </div>
  );
}
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
    buttonLogin: {
        marginTop:'5px',
        width: '100%',
        padding: '10px',
        backgroundColor: 'green',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
      },
  };

export default Signup;
