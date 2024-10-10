// import React from 'react'
// //  
// import { useEffect, useState } from "react";
// import axios from "axios";
// export default function Home() {
//     // console.log('I am at Home Page')
//     const [auth, setAuth] = useState(false)
//     const [name, setname] = useState('')
//     const [message, setMessage] = useState('')

//     // const accessToken = localStorage.getItem('accessToken')
//     // console.log(accessToken)
//     useEffect(() => {


//         axios.get("http://localhost:3000/home", {
//             withCredentials: true
//         }).then((res) => {
//             if (res.data === "You have accessed a protected route") {
//                 setAuth(true)
//                 setname(res.data.username)
//             }
//             else {
//                 setAuth(false)
//                 setMessage(res.data.message)
//             }
//         }).catch((err) => {
//             console.log("Error:", err);
//         })
//     }, [])

//     // useEffect(() => {
//     //     const token = localStorage.getItem('token')
//     //     if (token) {
//     //         setAuth(true)
//     //     }
//     //     else {
//     //         setAuth(false)
//     //     }
//     // }, [])

//     return (

//         <div className='container'>
//             {
//                 auth ? <h1> Hello { name } , you are authorised </h1> : <h1> { message }</h1>
//             }
//         </div>

//     )
// }

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Home() {
    const [auth, setAuth] = useState(false);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log(document.cookie);
        const token = Cookies.get('accessToken');
        if (token) {
            axios.get("http://localhost:3000/home", {
                withCredentials: true
            }).then((res) => {
                if (res.data === "You have accessed a protected route") {
                    setAuth(true);
                    setName(res.data.username);
                } else {
                    setAuth(false);
                    setMessage(res.data.message);
                }
            }).catch((err) => {
                console.log("Error:", err);
            });
        } else {
            // Handle case when token is not present
        }
    }, []);

    return (
        <div className='container'>
            {
                auth ? <h1>Hello { name }, you are authorized</h1> : <h1>{ message }</h1>
            }
        </div>
    );
}
