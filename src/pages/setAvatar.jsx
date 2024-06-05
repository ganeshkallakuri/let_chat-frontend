// import React from 'react'
// import {useState, useEffect} from 'react'
// import { useNavigate } from 'react-router-dom';
// import styled from "styled-components";
// import loader from "../assets/loader.gif";
// import {ToastContainer, toast} from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { setAvatarRoute } from '../utils/APIRoutes';
// import axios from "axios";
// import { Buffer } from 'buffer';

// export default function SetAvatar() {

//     const api = 'https://api.multiavatar.com/45678945';
//     const navigate = useNavigate();
//     const [avatars, setAvatars] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [selectedAvatar, setSelectedAvatar] = useState(undefined);

//     const toastOptions= {
//       position: "bottom-right",
//       autoClose: 8000,
//       pauseOnHover: true,
//       draggable: true,
//       theme: "dark",
//     };

//     const setprofilePicture = async () => {};
// //     useEffect(async () => {
// //   const data = [];
// //   for (let i = 0; i < 4; i++) {
// //     try {
// //       const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
// //       data.push(`data:image/svg+xml;base64,${btoa(response.data)}`);
// //     } catch (error) {
// //       console.error("Error fetching avatar:", error);
// //     }
// //   }
// //   setAvatars(data);
// //   setIsLoading(false);
// // }, []);
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const data = [];
//       for (let i = 0; i < 4; i++) {
//         const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
//         data.push(`data:image/svg+xml;base64,${btoa(response.data)}`);
//       }
//       setAvatars(data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching avatars:", error);
//     }
//   };

//   fetchData(); // Call the async function directly inside useEffect

//   return () => {
//     // Cleanup code if needed
//   };
// }, []); // Ensure the dependency array is correct


//   // return (
//   // <>
//   //   <Container>
//   //     <div className='title-container'>
//   //       <h1>Pick an avatar as your Profile picture</h1>
//   //     </div>
//   //     <div className='avatars'>
//   //       {
//   //           avatars.map((avatar, index) => {
//   //             return (
//   //               <div 
//   //               key = {index}
//   //               className = {`avatar ${selectedAvatar === index ? "selected" : ""
//   //             }`}>
//   //               <img src = {`data:image/svg+xml;base64, ${avatar}`}  alt= "avatar" 
//   //               onClick={() => setSelectedAvatar(index)}/>
//   //             </div>
//   //             );
//   //           })
            
            
//   //       }
//   //     </div>
//   //   </Container>
//   // </>
//   // );
//   return (
//     <>
//       <Container>
//         <div className='title-container'>
//           <h1>Pick an avatar as your Profile picture</h1>
//         </div>
//         <div className='avatars'>
//           {isLoading ? (
//             <div>Loading...</div>
//           ) : (
//             avatars.map((avatar, index) => (
//               <div
//                 key={index}
//                 className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
//               >
//                 <img src={avatar} alt={`avatar-${index}`} onClick={() => setSelectedAvatar(index)} />
//               </div>
//             ))
//           )}
//         </div>
//       </Container>
//     </>
//   );
  
// }

// const Container = styled.div``;
 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes';
import loader from "../assets/loader.gif";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from 'buffer';


export default function SetAvatar() {
  const api = 'https://api.multiavatar.com/45678945';
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions= {
          position: "bottom-right",
          autoClose: 8000,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        };
  useEffect(() => {
    if(!localStorage.getItem("lets-chat-user")) {
      navigate("/login");
      }
    }, []);
  const setProfilePicture = async () => {
    if(selectedAvatar === undefined){
      toast.error("Please select an avatar", toastOptions);
    } else{
      const  user = await JSON.parse(localStorage.getItem("lets-chat-user"));
      const {data} = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if(data.isSet){
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("lets-chat-user", JSON.stringify(user));
        navigate('/');
      } 
      else{
        toast.error("Error setting avatar. please try again", toastOptions);
      }
    }
  };
  const fetchData = async () => {
    try {
      const data = [];
      for (let i = 0; i < 4; i++) {
        // const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
        // data.push(`data:image/svg+xml;base64,${btoa(response.data)}`);
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching avatars:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAvatarClick = (index) => {
    setSelectedAvatar(index);
    // Additional logic if needed
  };

  return (
    <>
    {
      isLoading ? <Container>
        <img src = {loader} alt = "loader" className = "loader" />
      </Container> : (

      <Container>
        <div className="title-container">
          <h1>Pick an avatar as your Profile picture</h1>
        </div>
        <div className="avatars">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            avatars.map((avatar, index) => (
              <div
              //   key={index}
              //   className={`avatar ${selectedAvatar === index ? "selected" : " "}`}
              //   onClick={() => handleAvatarClick(index)}
              // >
              //   <img src={avatar} alt={`avatar-${index}`} />
              className={`avatar ${
                selectedAvatar === index ? "selected" : ""
              }`}
            >
              <img
                src={`data:image/svg+xml;base64,${avatar}`}
                alt="avatar"
                key={avatar}
                onClick={() => setSelectedAvatar(index)}
              />
              </div>
            ))
          )}
        </div>
        <button className="submit-btn" onClick={setProfilePicture}>Set as Profile picture</button>
        <ToastContainer />
      </Container>
      )
    }

    </>
  );
}

const Container = styled.div`
  /* Add your styles here */
  .title-container {
    margin-bottom: 20px;
  }

  .avatars {
    display: flex;
    justify-content: space-around;
  }

  .avatar {
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;

    &:hover {
      border-color: #007bff; /* Add your desired hover color */
    }

    &.selected {
      border-color: #28a745; /* Add your selected color */
    }

    img {
      width: 100px; /* Adjust the width as needed */
      height: 100px; /* Adjust the height as needed */
      object-fit: cover;
    }
  }

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader{
    max-inline-size: 100%;
  }

  .title-container{
    h1{
      color: white;
    }
  }
  .avatars{
    display: flex;
    gap: 2rem;
    .avatar{
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transitions: 0.5s ease-in-out;
      img{
        height: 6rem;
      }
    }
    .selected{
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
