import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
function Header(){

    const {user} = useContext(UserContext);//grabbing anything, here user from UserContext, thr value in the provider component

    return(
        <div>
            <header className="px-4 py-2 flex justify-between"> 
                <Link to='/' className="flex items-center gap-1 ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 -rotate-90">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                    <span className="text-primary font-bold text-xl">airbnb</span>
                </Link>


                <div className="flex p-2 border border-gray-300 rounded-full shadow-md shadow-gray-300">
                    <div className="font-bold p-2 ">Anywhere</div>
                    <div className="border border-l "></div>
                    <div className="font-bold p-2">Any week</div>
                    <div className="border border-l "></div>
                    <div className=" p-2">Add guests</div>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#F5385D" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                </div>

                <div className="flex justify-between items-center">

                    <Link to={user ?'/account':'/login'} className="flex p-2 border border-gray-300 rounded-full border-width-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        {!!user && (//converts to a boolean the two excalamation marks 
                            <div className="font-bold">
                                {user.name}
                            </div>
                        )}
                    </Link>
                </div>
            </header>
        </div>
    );
}

export default Header;