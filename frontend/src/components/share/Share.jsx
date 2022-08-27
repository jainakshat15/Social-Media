import { Cancel, PermMedia } from "@mui/icons-material"
import axios from "axios";
import { useState } from "react";
import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./share.css"
import { toast } from 'react-toastify';
import { CircularProgress } from "@mui/material";


export default function Share() {
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [file, setFile] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const navigate = useNavigate();
    const desc = useRef();
    const [disabled, setDisabled] = useState(false);
    const emptyPost = () => toast.error("Can't upload an empty Post.");
    const uploadError = () => toast.error("something went wrong!");
    const postUploaded = () => toast.success("Post uploaded successfully.")


    const createProductImagesChange = (e) => {
        const fileImg = e.target.files[0];

        setFile([]);
        setImagePreview([]);

        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setImagePreview((old) => [...old, reader.result]);
                setFile((old) => [...old, reader.result]);
            }

        };
        reader.readAsDataURL(fileImg);

    }
    const submitHandler = async (e) => {
        e.preventDefault();
        setDisabled(true);
        if (!desc.current.value && file.length === 0) {
            setDisabled(false);
            emptyPost();
            return;
        }

        const newPost = {
            userId: user._id,
            desc: desc.current.value,
            img: file
        }

        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            }
            await axios.post("https://socialmedia-jainakshat.herokuapp.com/api/posts", newPost, config);
            postUploaded();
            desc.current.value = ""
            setFile([]);
            setImagePreview([]);
            window.location.pathname === "/" ? navigate('/profile/' + user.username) : window.location.reload();
        } catch (err) {
            setDisabled(false);
            uploadError();
            console.log(err);
        }
    }

    return (
        <>
            <div className="share">
                <div className="shareWrapper">
                    <div className="shareTop">
                        <img className="shareProfileImg" src={user.profilePicture.url ? user.profilePicture.url : PF + "person/noAvatar.png"} alt="" />
                        <textarea placeholder={"What's in your mind ?"} className="shareInput shareInputNew" ref={desc} />

                    </div>
                    <hr className="shareHr" />
                    {imagePreview.length ? (
                        <div className="shareImgContainer">
                            <img className="shareImg" src={imagePreview} alt="" />
                            <Cancel className="shareCancelImg" onClick={() => { setImagePreview([]); setFile([]) }} />
                        </div>
                    ) : <></>}
                    <form className="shareBottom" onSubmit={submitHandler}>
                        <div className="shareOptions">
                            <label htmlFor="file" className="shareOption">
                                <PermMedia htmlColor="#4C3A51" className="shareIcon" />
                                <span className="shareOptionText">Photo</span>
                                <input type="file" style={{ display: "none" }} id="file" accept="image/*" onChange={createProductImagesChange} />
                            </label>

                        </div>

                        <button className="shareButton" type="submit" disabled={disabled}>{disabled ? <CircularProgress color="secondary" size="20px" /> : 'Share'}</button>
                    </form>
                </div>
            </div>

        </>
    )
}

