import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes, Navigate } from 'react-router-dom';

import { client } from '../client';
import { userQuery } from '../utils/data';

import logo from '../assets/logo.png';
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';
import Pins from './Pins';

import { fetchUser } from '../utils/fetchUser';

const Home = () => {
  const [user, setUser] = useState([]);
  const [shouldRedirect, setshouldRedirect] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const scrollRef = useRef(null);

  const userInfo = fetchUser();

  useEffect(() => {
    if (userInfo) {
      const query = userQuery(userInfo?.googleId);
      client.fetch(query).then((data) => {
        setUser(data[0]);
      });
    } else {
      setshouldRedirect(true);
    }
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  if (shouldRedirect) {
    return <Navigate replace to="/login" />;
  }

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-empty">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img
              src={user?.image}
              alt="logo"
              className="w-10 rounded-full"
            />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar
              user={user && user}
              closeToggle={setToggleSidebar}
            />
          </div>
        )}
      </div>
      <div
        className="pb-2 flex-1 h-screen w-100 overflow-y-scroll"
        ref={scrollRef}
      >
        <Routes>
          <Route
            path="/user-profile/:userId"
            element={<UserProfile />}
          />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
