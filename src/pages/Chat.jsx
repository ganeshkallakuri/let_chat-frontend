import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled
 from 'styled-components'
import { allUsersRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";
export default function Chat() {

  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat,  setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if(!localStorage.getItem("lets-chat-user")) {
      navigate("/login");
      }else{
        setCurrentUser(JSON.parse(localStorage.getItem("lets-chat-user")));
        setIsLoaded(true);
      }
  },[]);
  useEffect(() => {
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  },[currentUser])
  useEffect(() => {
    if(currentUser){
      if(currentUser.isAvatarImageSet){
        const data = axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      }else{
        navigate("/setAvatar");
      }
    }
  },[currentUser]);
  const handleChatChange = (chat) => {
      setCurrentChat(chat);
  };
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (currentUser) {
          if (currentUser.isAvatarImageSet) {
            const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(response.data);
          } else {
            navigate("/setAvatar");
          }
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
  
    fetchContacts(); // Call the async function to fetch contacts
  }, [currentUser, navigate]);
  
  return (
    <>
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat = {handleChatChange} />
        {
          isLoaded && currentChat === undefined ? (
            <Welcome  currentUser = {currentUser}/>
          ) : ( 
            <ChatContainer 
            currentChat={currentChat} 
            currentUser = {currentUser} 
            socket = {socket}
            />
          )
          
        }
      </div>
    </Container>
    </>
  );  
}

const Container = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #131324;
.container {
  height: 85vh;
  width: 85vw;
  background-color: #00000076;
  display: grid;
  grid-template-columns: 25% 75%;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-columns: 35% 65%;
  }
  @media screen and (max-width: 720px) {
    /* Adjust the layout for smaller screens */
    /* For example: */
    grid-template-rows: 10% 80% 10%;
  }
  
}

`;

