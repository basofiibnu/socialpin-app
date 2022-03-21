import React, { useState, useEffect } from 'react';
import { MdLogout } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import {
  userQuery,
  userCreatedPinsQuery,
  userSavedPinsQuery,
} from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImg =
  'https://source.unsplash.com/1600x900/?nature,photography,technology';
const activeBtnStyles =
  'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles =
  'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('Created');

  const navigate = useNavigate();
  const { userId } = useParams();

  const logout = () => {
    localStorage.clear();

    navigate('/login');
  };

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === 'Created') {
      const createdPinQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  if (!user) {
    return <Spinner message={'Loading profile...'} />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImg}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              alt="banner-cover"
            />
            <img
              src={user.image}
              alt="user-pic"
              className="rounded-full w-20 -mt-10 shadow-xl object-cover"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id && (
                <GoogleLogout
                  clientId={`${process.env.REACT_APP_GOOGLE_API_ID_TOKEN}`}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <MdLogout color="red" fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
          </div>
          <div className="text-center mt-3 mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('Created');
              }}
              className={`${
                activeBtn === 'Created'
                  ? activeBtnStyles
                  : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('Saved');
              }}
              className={`${
                activeBtn === 'Saved'
                  ? activeBtnStyles
                  : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>
          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No Pins Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
