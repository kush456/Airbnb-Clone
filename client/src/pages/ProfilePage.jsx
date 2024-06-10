import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function ProfilePage(){
    const {user,ready,setUser} = useContext(UserContext);
    const [redirect, setRedirect] = useState(null);
    let {subpage} = useParams();
    if(subpage=== undefined){
        subpage = 'profile';
    }
    
    async function logout(){
        try{
            const res = await axios.post('/logout');
            if(res.status === 200){
                setUser(null); // Update the user state in UserContext
                setRedirect('/');
            }
        } catch(err){
            console.log(err);
        }

    }

    if(!ready){
        return <div>Loading...</div> //for a very few miliseconds this will show
    }

    if(ready && !user){//if not logged in
        <Navigate to='/login' />
    }

    //logout par, better as it is above the return function so wo null user wala jhanjat nhi, ni toh ho toh gya tha 
    if(redirect){
        return <Navigate to={redirect} />
    }

    
    //only if we are ready and have the user data will it work not giving the null error
    return(
        <div>
            <AccountNav />
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto my-6">
                    Logged in as {user.name} ({user.email})<br/>
                    <button className="primary max-w-sm mt-2" onClick={logout}>Logout</button>
                </div>
            )}
            {subpage === 'places' && (
                <PlacesPage />
            )}
            
        </div>
    );
}