import React, { Fragment, useState, useEffect, useRef } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [saveProcess, setSaveProcess] = useState(false);

  const warningRef = useRef(null);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === 'image/png' ||
      type === 'image/svg' ||
      type === 'image/jpeg' ||
      type === 'image/gif' ||
      type === 'image/tiff'
    ) {
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload('image', e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Image upload error', error);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const savePin = () => {
    setSaveProcess(true);
    setLoading(true);
    if (
      title &&
      about &&
      destination &&
      imageAsset?._id &&
      category
    ) {
      const doc = {
        _type: 'pins',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      };

      client.create(doc).then(() => navigate('/'));
    } else {
      setFields(true);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
    setLoading(false);
    setSaveProcess(false);
  };

  const executeScroll = () =>
    warningRef.current.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    if (fields) {
      executeScroll();
    }
  }, [fields]);

  if (loading && saveProcess)
    return (
      <Spinner message="Please wait while we're saving your content" />
    );

  return (
    <div
      className="flex flex-col justify-center items-center mt-5 lg:h-4/5"
      id="container-plus"
    >
      {fields && (
        <p
          className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in"
          ref={warningRef}
        >
          Please fill in all the fields
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex=col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset && (
              <label>
                {loading ? (
                  <Spinner />
                ) : (
                  <Fragment>
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col justify-center items-center">
                        <p className="font-bold text-2xl">
                          <AiOutlineCloudUpload />
                        </p>
                        <p className="text-md">Click to Upload</p>
                      </div>
                      <p className="mt-4 text-gray-400">
                        Use high-quality JPG, SVG, PNG, GIF, or TIFF
                        less than 20 MB
                      </p>
                    </div>
                    <input
                      type="file"
                      name="upload-image"
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </Fragment>
                )}
              </label>
            )}
            {imageAsset && (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 mt-5 lg:w-4/5 w-full bg-white p-5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add your title here"
          className="outline-none text-xl sm:text-md font-bold border-b-2 border-gray-200 p-2"
        />
        <input
          type="text"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="What is your pin about"
          className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Add a destination link"
          className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
        />
        <div className="flex flex-1 justify-start item-center flex-row gap-5">
          <div className="flex-grow">
            <p className="mb-2 font-semibold text-lg sm:text-xl">
              Choose Pin Category
            </p>
            <select
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              className="outline-none w-full text-base border-b-2 capitalize border-gray-200 p-2 rounded-md cursor-pointer"
            >
              <option value="other" className="bg-white">
                Select Category
              </option>
              {categories.map((item) => (
                <option
                  className="text-base border-0 outline-none bg-white text-black"
                  key={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          {user && (
            <div className="flex flex=grow gap-2 my-2 items-center bg-white rounded-lg">
              <img
                src={user.image}
                className="w-6 h-6 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={savePin}
            className="bg-red-500 text-white font-bold rounded-full p-2 w-28 outline-none"
          >
            Save Pin
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
