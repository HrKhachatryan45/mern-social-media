import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import useSignup from "../hooks/useSignup";

function Signup(props) {
    const [inputDetails,setInputDetails]=useState({
        fullName:'',
        username:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const {signup,loading} = useSignup()

        const handleSubmit = async (ev)=>{
        ev.preventDefault()
            await signup(inputDetails)
        }

    return (
        <div
            className={'w-full h-screen flex flex-col lg:flex-row md:flex-row sm:flex-col items-center justify-center lg:justify-around md:justify-around sm:justify-center bg-[url(https://static.vecteezy.com/system/resources/previews/014/848/048/original/gradient-blue-background-design-with-gradient-balls-suitable-for-poster-design-invitations-greeting-cards-and-others-vector.jpg)]  bg-cover '}>
            <div className={'left  lg:w-5/12 md:w-5/12 sm:w-8/12   h-fit flex items-center justify-center'}>
                <div className={'mr-6'}>
                    <img className={'w-14 h-14 lg:w-24 lg:h-24 md:w-16 md:h-16 sm:w-16 sm:h-16'}
                         src={'https://cdn-icons-png.flaticon.com/512/1177/1177585.png'}/>
                </div>
                <div>
                    <h1 className={'specialText text-3xl  lg:text-4xl md:text-3xl sm:text-2xl font-customOne font-[600]'}>INSTABOOK</h1>
                    <h3 className={'text-black  hidden lg:text-lg md:text-[15px] lg:mt-3 md:mt-1 font-[500] sm:hidden'}>Explore
                        ideas throughout the world</h3>
                </div>
            </div>
            <div
                className={'right mt-4 w-[85%] lg:w-5/12 md:w-6/12 sm:w-9/12 bg-white  sm:mt-4  lg:h-4/6 md:h-[60%] sm:h-4/6 rounded-xl  '}>

                <form onSubmit={handleSubmit}
                      className={' p-5 w-full h-full flex flex-col justify-center items-center'}>
                    <h1 className={'text-black text-3xl font-[600] font-customTwo mb-6'}>Sign Up</h1>
                    <section className={'w-full flex justify-between items-center mb-4'}>
                        <input
                            onChange={(ev) => setInputDetails({...inputDetails, fullName: ev.target.value})}
                            value={inputDetails.fullName}
                            type={'text'}
                            placeholder={'Full Name'}
                            className={'input bg-customGray w-1/2 mr-2 focus:outline-none focus:border-2 focus:border-customGreen'}
                        />
                        <input
                            onChange={(ev) => setInputDetails({...inputDetails, username: ev.target.value})}
                            value={inputDetails.username}
                            type={'text'}
                            placeholder={'Username'}
                            className={'input bg-customGray w-1/2 ml-2 focus:outline-none focus:border-2 focus:border-customGreen'}
                        />
                    </section>
                    <input
                        onChange={(ev) => setInputDetails({...inputDetails, email: ev.target.value})}
                        value={inputDetails.email}
                        type={'text'}
                        placeholder={'Email'}
                        className={'input bg-customGray w-full focus:outline-none  mb-4 focus:border-2 focus:border-customGreen'}
                    />
                    <section className={'w-full flex justify-between items-center mb-5'}>
                        <input
                            onChange={(ev) => setInputDetails({...inputDetails, password: ev.target.value})}
                            value={inputDetails.password}
                            type={'password'}
                            placeholder={'Password'}
                            className={'input bg-customGray w-1/2 mr-2  focus:outline-none focus:border-2 focus:border-customGreen'}
                        />
                        <input
                            onChange={(ev) => setInputDetails({...inputDetails, confirmPassword: ev.target.value})}
                            value={inputDetails.confirmPassword}
                            type={'password'}
                            placeholder={'Confirm Password'}
                            className={'input bg-customGray w-1/2 ml-2  focus:outline-none focus:border-2 focus:border-customGreen'}
                        />
                    </section>

                    <p>Already have an account ? <b className={'hover:underline hover:text-blue-500'}><Link
                        to={'/login'}>Login!</Link></b></p>
                    <div className={'w-full flex items-center justify-end mt-6'}>
                        <button
                            className={'btn bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-white w-32 rounded-lg text-[15px]'}>
                            {loading ? <span className={'loading loading-spinner text-primary'}></span> : 'Signup'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;