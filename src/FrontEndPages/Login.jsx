import { useState } from "react";
// import {react, useState} from "react";
import axios from "axios";
// import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Logo from '../img/logo.png';
// import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import VisibilityIcon from '@mui/icons-material/Visibility';
const Login = () => {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // debugger;

    // const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [email, setemail] = useState("");
    // const [err, setErr] = useState(null);
    const [Success, setSuccess] = useState(false);
    // const [userExists, setUserExists] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email === "" || password === "") {
            alert("Please fill in all required fields.");
        }
        else {
            try {
                const response = await axios.post("http://localhost:3000/login", {
                    email: email,
                    password: password
                });

                // Check if login was successful
                if (response.data.message === "User Matched") {
                    // Redirect the user to the dashboard or homepage
                    console.log("Login successful");
                    setTimeout(() => {
                        navigate("/Home")
                    }, 5900);
                    setSuccess(true);
                } else {
                    // Handle unsuccessful login
                    console.log("Failed Response Reason:", response.data);
                    setError("Invalid email or password");
                    setSuccess(false);
                }
            } catch (error) {
                // Handle errors
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("Error:", error.response.data);
                    setError(error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log("Error:", error.request);
                    setError("Network error. Please try again.");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error:", error.message);
                    setError("An error occurred. Please try again later.");
                }
                setSuccess(false);
            }
        }
    };


    //the above catch are primarily focused on handling errors that may occur during HTTP requests made to a server, such as when logging in or accessing data.










    return (
        <>
            <div className="registerContainer">
                <div className="logo"><img style={ { width: "13rem", height: "6rem" } } src={ Logo } alt="logo" /><h1>Welcome to AcartZone.in</h1>
                    <p>Being an Clone version of Amazon shopping , we try to make your shopping experience as smooth  and as easy as possible since we serve with passion.</p></div>
                <div className="formContainer">
                    <div className="form">

                        <form className="formBox" onSubmit={ handleSubmit }>

                            <label>Email Id</label>
                            <input className="input" type="text" placeholder="Email" value={ email } onChange={ (e) => setemail(e.target.value) } />
                            <MailIcon className="icon" />
                            <br />
                            <label>Password</label>
                            <input className="input" type={ !showPassword ? "password" : "text" } placeholder="At least 8 characters" value={ password } onChange={ (e) => setpassword(e.target.value) } />
                            <VisibilityIcon className="icon" onClick={ () => setShowPassword(!showPassword) } />
                            <br />
                            <button>Submit</button>
                            { error && (
                                <Alert severity="error" style={ {
                                    width: '15rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0rem 0rem',
                                    position: 'absolute',
                                    left: '0.8rem',
                                    bottom: '2rem',
                                } }>
                                    { error }
                                </Alert>
                            ) }

                            { Success && (
                                <Alert severity="success" style={ {
                                    width: '15rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0rem 0rem',
                                    position: 'absolute',
                                    left: '0.8rem',
                                    bottom: '2rem',
                                } }>
                                    Login Successful
                                </Alert>
                            ) }



                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;