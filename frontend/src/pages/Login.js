import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import useLogin from "../hooks/useLogin";

function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {login,loading} = useLogin()
    const handleSubmit = async (ev)=>{
        ev.preventDefault()
        await login(username,password)
    }

    return (
        <div className={'w-full h-screen flex flex-col lg:flex-row md:flex-row sm:flex-col items-center justify-center lg:justify-around md:justify-around sm:justify-center bg-[url(https://static.vecteezy.com/system/resources/previews/014/848/048/original/gradient-blue-background-design-with-gradient-balls-suitable-for-poster-design-invitations-greeting-cards-and-others-vector.jpg)]  bg-cover '}>
            <div className={'left  lg:w-5/12 md:w-5/12 sm:w-8/12   h-fit flex items-center justify-center'}>
                <div className={'mr-6'}>
                    <img className={'w-14 h-14 lg:w-24 lg:h-24 md:w-16 md:h-16 sm:w-16 sm:h-16'} src={'https://cdn-icons-png.flaticon.com/512/1177/1177585.png'}/>
                </div>
                <div>
                    <h1 className={'specialText text-3xl  lg:text-4xl md:text-3xl sm:text-2xl font-customOne font-[600]'} >INSTABOOK</h1>
                    <h3 className={'text-black  hidden lg:text-lg md:text-[15px] lg:mt-3 md:mt-1 font-[500] sm:hidden'}>Explore ideas throughout the world</h3>
                </div>
            </div>
            <div className={'right mt-4 w-[85%] lg:w-5/12 md:w-6/12 sm:w-9/12 bg-white  sm:mt-4  lg:h-4/6 md:h-3/6 sm:h-4/6 rounded-xl  '}>
                <form onSubmit={handleSubmit}
                      className={' p-5 w-full h-full flex flex-col justify-center items-center'}>
                    <h1 className={'text-black text-3xl font-[600] font-customTwo mb-6'}>Login</h1>
                    <input
                        value={username}
                        onChange={(ev)=>setUsername(ev.target.value)}
                        type={'text'}
                        placeholder={'Username'}
                        className={'input bg-customGray w-full focus:outline-none  mb-4 focus:border-2 focus:border-customGreen '}
                    />
                    <input
                        value={password}
                        onChange={(ev)=>setPassword(ev.target.value)}
                        type={'password'}
                        placeholder={'Password'}
                        className={'input bg-customGray w-full focus:outline-none  mb-4 focus:border-2 focus:border-customGreen '}
                    />

                    <p>Don't have an account yet? <b className={'hover:underline hover:text-blue-500'}><Link
                        to={'/signup'}>Signup!</Link></b></p>
                    <div className={'w-full flex items-center justify-end mt-6'}>
                        <button
                            className={'btn bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-white w-32 rounded-lg text-[15px]'}>
                            {loading ? <span className={'loading loading-spinner text-primary'}></span> : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;