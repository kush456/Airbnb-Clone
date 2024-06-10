import { createContext , useEffect, useState} from "react";
import axios from "axios";
export const UserContext = createContext({});//creating a context 

export function UserContextProvider({children}){
    const [user,setUser] = useState(null);
    const [ready, setReady] = useState(false);//basically it takes time to fetch user data hence it reloads to login page, as tb tk user data is not there

    useEffect(() => {
        // This effect will run after every render
        if(!user){
            axios.get('/profile').then(({data})  => {
                setUser(data);
                setReady(true);
            });
        }
    }, []);// Dependency array: the effect will run when the count value changes

    return(
        //provider component
        <UserContext.Provider value={{user,setUser,ready}}>
            {children}
        </UserContext.Provider>
    )
}