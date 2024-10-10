import { useState } from "react";
// import {react, useState} from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Logo from '../img/logo.png';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import VisibilityIcon from '@mui/icons-material/Visibility';
const RegisterPage = () => {

    // debugger;
    // const navigate = useNavigate();
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [email, setemail] = useState("");
    const [err, setErr] = useState(null);
    const [Success, setSuccess] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const addTableItems = async (newObj) => {
        try {
            const response = await axios.post("http://localhost:3000/register", newObj);
            console.log(response.data);
            return response.data; // Returning data for potential use
        } catch (err) {
            setErr(err.response.data);
            console.log("Error registering user:", err.message);
            // throw error; // Re-throw the error to propagate it to the calling code
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username === "" || email === "" || password === "") {
            alert("Please fill in all required fields.");
        }
        else {
            try {
                const newValues = {
                    username: username,
                    email: email,
                    password: password,
                };

                const responseData = await addTableItems(newValues);
                console.log("Response data:", responseData);
                setSuccess(true);
                setUserExists(responseData === "User already exists");
                // setSuccess(responseData !== "User already exists");
                // setUserExists(false);
            } catch (error) {
                console.error("Error handling registration:", error.message);
                setSuccess(false);
                setUserExists(true);
            }
        }

        // setTimeout(() => {
        //     setErr(null);
        //     setusername("");
        //     setemail("");
        //     setpassword("");
        //     setSuccess(false);
        // }, 10000);
    };


    return (
        <>
            <div className="registerContainer">
                <div className="logo"><img style={ { width: "13rem", height: "6rem" } } src={ Logo } alt="logo" /><h1>Welcome to AcartZone.in</h1>
                    <p>Being an Clone version of Amazon shopping , we try to make your shopping experience as smooth  and as easy as possible since we serve with passion.</p></div>
                <div className="formContainer">
                    <div className="form">

                        <form className="formBox" onSubmit={ handleSubmit }>
                            <label>Your name</label>
                            <input className="input" type="text" placeholder="First and last name" value={ username } onChange={ (e) => setusername(e.target.value) } />
                            <PersonIcon className="icon" />
                            <br />
                            <label>Email Id</label>
                            <input className="input" type="text" placeholder="Email" value={ email } onChange={ (e) => setemail(e.target.value) } />
                            <MailIcon className="icon" />
                            <br />
                            <label>Password</label>
                            <input className="input" type={ !showPassword ? "password" : "text" } placeholder="At least 8 characters" value={ password } onChange={ (e) => setpassword(e.target.value) } />
                            <VisibilityIcon className="icon" onClick={ () => setShowPassword(!showPassword) } />
                            <br />
                            <button>Register</button>

                            { err ? (
                                <div>
                                    <Alert severity="error" style={ {
                                        width: '15rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0rem 0rem',
                                        position: 'absolute',
                                        left: '0.8rem',
                                        bottom: '2rem',
                                    } }>{ err }</Alert>
                                    <Link to="/login">Login here</Link>
                                </div>
                            ) : Success ? (
                                <div>
                                    <Alert severity={ userExists ? "error" : "success" } style={ {
                                        width: '15rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0rem 0rem',
                                        position: 'absolute',
                                        left: '0.8rem',
                                        bottom: '2rem',
                                    } }>
                                        { userExists ? (
                                            <div>
                                                User already exists <Link to="/login">Login here</Link>
                                            </div>
                                        ) : (
                                            "User successfully registered"
                                        ) }
                                    </Alert>
                                </div>
                            ) : null }
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterPage;