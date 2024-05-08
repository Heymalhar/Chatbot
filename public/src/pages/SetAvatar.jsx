import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {setAvatarRoute} from '../utils/APIRoutes';
import {Buffer} from 'buffer';
import loader from '../assets/loader.gif';

export default function SetAvatar(){

    const api = 'https://api.multiavatar.com/mJd7npP38ZTIr2';
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        
        const fetchData = async () => {
            if(!localStorage.getItem("chat-app-user")){
                navigate("/login");
            }
        }

        fetchData();

    },[navigate]);

    const setProfilePicture = async () => {
        if(selectedAvatar === undefined){
            toast.error("Please select an avatar! It's gonna be your profile picture after all.", toastOptions);
        } else {
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar]
            });
            console.log(data);
            if(data.isSet){
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chat-app-user", JSON.stringify(user));
                navigate("/");
            } else {
                toast.error("An error occured while setting the avatar. Please try again.", toastOptions);
            }
        }
    };
    
    useEffect(() => {
        let requestCounter = 0;
    
        const fetchData = async () => {
            const data = [];
            for (let i = 0; i < 4; i++) {
                requestCounter++;
                if (requestCounter > 5) {
                    // Wait for 5 seconds before making the next request
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    requestCounter = 0; // Reset the counter after waiting
                }
    
                const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                const buffer = new Buffer(response.data);
                data.push(buffer.toString("base64"));
            }
    
            setAvatars(data);
            setIsLoading(false);
        };

        if(localStorage.getItem("chat-app-user")){
            fetchData();
        }
    
    }, []);    
    

    return(

        <>
        {
            isLoading ? <Container>
                <img src={loader} alt="Loader" className="loader" />
            </Container> : (

                <Container>
                    <div className="title-container">
                        <h1>
                            Pick an avatar for yourself!
                        </h1>
                    </div>
                    <div className="avatars">
                        {
                            avatars.map((avatar, index) => {
                                return(
                                    <div
                                    key={index} 
                                    className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                                        <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)}>
                                        </img>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <button className="submit-btn" onClick={setProfilePicture}>Set this avatar as your profile picture</button>
                </Container>

            )
        }

            <ToastContainer />
        
        </>

    )

}

const Container = styled.div`

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
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
            img{
                height: 6rem;
            }
        }
        .selected{
            border: 0.4rem solid #4e0eff;
        }
    }
    .submit-btn{
        background-color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.5s;
        &:hover{
            background-color: #4e0eff;
        }
    }

`;