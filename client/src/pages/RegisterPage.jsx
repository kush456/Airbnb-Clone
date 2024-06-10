import React, { useState } from "react";
import {Link} from "react-router-dom";
import axios from "axios";
//import ES6 wala here and const require in backend could also cause lil problems 
function RegisterPage(){
    const[name,setName] = useState();
    const[email,setEmail] = useState();
    const[password,setPassword] = useState();

    async function registerUser(ev){
        ev.preventDefault();
        try{
            await axios.post("/register", {
                name: name,
                email: email,
                password:  password
                
            });
            //also add the functionality to return to index page logged in if person is registered successfully
            alert('Registration successful');
        }catch(e){
            alert('Registration failed, please try again later');
            //this is client side so this will tell the client 
            //that was server side so the backend engineer needs to know what kind of error this is..
        } 

    }
    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" placeholder="Username" 
                        value={name} 
                        onChange={(e)=>setName(e.target.value)}
                    />
                    <input type="email" placeholder="your@email.com" 
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    <input type="password" placeholder="Password" 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <button className="primary" type="submit">Register</button>
                    <div className="text-center text-gray-500 py-2">
                        Already a member? <Link to={'/login'} className="underline text-black ">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;