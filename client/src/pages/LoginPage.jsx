import React, { useContext, useState } from "react";
import {Link, Navigate} from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
function LoginPage(){ 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);//consumer component

    
    async function loginUser(ev){
        ev.preventDefault();
        try {
            const userInfo = await axios.post('/login', { email, password });
            if (userInfo.data.success) {
                alert(userInfo.data.message);
                setUser(userInfo.data);//we only need the data like email name etcc na, so our user becomes this now in user context file
                setRedirect(true);
              // Perform additional actions, such as redirecting to the dashboard
            } else {
              alert(userInfo.data.message);
            }
        } catch (error) {
            alert(error.message);
        }
    }
        // try{
        //     const userInfo = await axios.post("/login", {
        //         email: email,
        //         password:  password
        //     });
            
        //     setUser(userInfo.data);//we only need the data like email name etcc na, so our user becomes this now in user context file
        //     setRedirect(true);
        // }catch(e){
        //     alert('Login failed, please try again later');
        // } 

    
    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={loginUser}>
                    <input type="email" placeholder="your@email.com" 
                        value = {email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    <input type="password" placeholder="Password" 
                        value = {password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <button className="primary" type="submit">Login</button>
                    <div className="text-center text-gray-500 py-2">
                        Don't have an account yet? <Link to={'/register'} className="underline text-black ">Register Now</Link>
                    </div>
                </form>
            </div>
            {redirect && <Navigate to="/"/>}
        </div>
    );
}

export default LoginPage;