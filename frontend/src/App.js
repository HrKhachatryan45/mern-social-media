import React, {useEffect, useState} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useAuthContext} from "./context/useAuthContext";
import ProfileSettings from "./pages/ProfileSettings";
import AnotherProfileSettings from "./pages/AnotherProfileSettings";
import Chat from "./pages/Chat";
import PostLink from "./pages/PostLink";
function App(props) {
    const {authUser} = useAuthContext()


    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={authUser?<Home/>:<Navigate to={'/login'}/>} />
                <Route path={'/login'} element={authUser?<Navigate to={'/'}/>:<Login/> }/>
                <Route path={'/signup'} element={authUser?<Navigate to={'/'}/>:<Signup/>}/>
                <Route path={'/profile'} element={authUser?<ProfileSettings/>:<Navigate to={'/login'}/>}/>
                <Route path={'/profile/:userId'} element={authUser?<AnotherProfileSettings/>:<Navigate to={'/login'}/>}/>
                <Route path={'/chat'} element={authUser?<Chat/>:<Navigate to={'/login'}/>}/>
                <Route path={'/post/:postId'} element={<PostLink/>}/>
            </Routes>
            <ToastContainer autoClose={1000}/>
        </BrowserRouter>
    );
}

export default App;