import { Cancel, Close, PermMedia, Search } from '@mui/icons-material';
import { Box, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import "./modals.css"
import { AuthContext } from '../../context/AuthContext';
import Comment from '../comment/Comment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CloseFriend from '../closeFriend/CloseFriend';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

const uploadError = () => toast.error("something went wrong!");
const passwordSentEmail = () => toast.success("Email sent successfully.");



const CommentsModal = (prop) => {
    const cancel = () => {
        prop.onSuccess();
    }


    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const [comment, setComment] = useState("");

    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            const res = await axios.get(`https://socialmedia-jainakshat.herokuapp.com/api/comments/${prop.post._id}`)
            setComments(res?.data?.reverse())

        }
        fetchComments();
    }, [prop])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (comment === "") return;
        let newComment = {
            userId: user._id,
            text: comment,
            postId: prop.post._id,
        }

        try {
            await axios.post("https://socialmedia-jainakshat.herokuapp.com/api/comments", newComment);
            newComment.createdAt = new Date();
            setComments([newComment, ...comments]);
            setComment("");

        } catch (err) {
            console.log(err);
            uploadError();

        }
    }




    return (

        <Box className='container'>

            <Close onClick={cancel} className='close' />
            <div className="share commentShare">
                <div className="shareWrapper">
                    <div className="shareTop">
                        <img className="shareProfileImg" src={user.profilePicture.url ? user.profilePicture.url : PF + "person/noAvatar.png"} alt="" />
                        <textarea placeholder={"Add a comment"} className="shareInput commentInput" autoFocus value={comment} onChange={(e) => setComment(e.target.value)} />
                        <button className="shareButton" onClick={handleSubmit}>Post</button>

                    </div>

                </div>
            </div>
            <div className="comments">
                {comments.map((c) => (
                    <Comment comment={c} key={c._id} />
                ))}

            </div>

        </Box>


    )

}


export default CommentsModal

export const EditPostModal = (prop) => {
    const cancel = () => {
        prop.onSuccess();
    }


    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const [file, setFile] = useState(prop.post?.img?.url ? [prop.post.img.url] : []);
    const [imagePreview, setImagePreview] = useState(prop.post?.img?.url ? [prop.post.img.url] : []);
    const navigate = useNavigate();
    const [desc, setDesc] = useState(prop.post.desc)
    const [disabled, setDisabled] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisabled(true);
        if (desc === "" && file.length === 0) {
            setDisabled(false);
            toast.error('Post cannot be empty.')
            return;
        }

        const updatedPost = {
            userId: user._id,
            desc: desc,
            img: file
        }

        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            }
            await axios.put("https://socialmedia-jainakshat.herokuapp.com/api/posts/" + prop.post._id, updatedPost, config);
            setDesc("")
            setFile([]);
            setImagePreview([]);
            cancel();
            (window.location.pathname === "/") ? navigate('/profile/' + user.username) : window.location.reload();
            toast.success('Post updated successfully');
        } catch (err) {
            setDisabled(false);
            console.log(err);
            uploadError();

        }

    }




    return (

        <Box className='container'>
            <Close onClick={cancel} className='close' />
            <div className="share editPost">
                <div className="shareWrapper">
                    <div className="shareTop">
                        <img className="shareProfileImg" src={user.profilePicture.url ? user.profilePicture.url : PF + "person/noAvatar.png"} alt="" />
                        <textarea placeholder={"What's in your mind ?"} className="shareInput commentInput" value={desc} onChange={((e) => setDesc(e.target.value))} />

                    </div>
                    <hr className="shareHr" />
                    {imagePreview.length ? (
                        <div className="shareImgContainer">
                            <img className="shareImg" src={imagePreview} alt="" />
                            {imagePreview.length && <Cancel className="shareCancelImg" onClick={() => { setImagePreview([]); setFile([]) }} />}
                        </div>
                    ) : <></>}
                    <form className="shareBottom" onSubmit={handleSubmit}>
                        <div className="shareOptions">
                            <label htmlFor="fileEdit" className="shareOption">
                                <PermMedia htmlColor="#4C3A51" className="shareIcon" />
                                <span className="shareOptionText">Photo</span>
                                <input type="file" style={{ display: "none" }} id="fileEdit" accept="image/*" onChange={createProductImagesChange} />
                            </label>

                        </div>

                        <button className="shareButton" type="submit" disabled={disabled}>{disabled ? <CircularProgress color="secondary" size="20px" /> : 'Update'}</button>
                    </form>
                </div>
            </div>

        </Box>


    )

}


export const EditProfileModal = (prop) => {
    const cancel = () => {
        prop.onSuccess();
    }


    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;


    const [fileProfileImg, setFileProfileImg] = useState(user?.profilePicture?.url ? [user.profilePicture.url] : []);
    const [profileImagePreview, setProfileImagePreview] = useState(user?.profilePicture?.url ? [user.profilePicture.url] : []);

    const [fileCoverImg, setFileCoverImg] = useState(user?.coverPicture?.url ? [user.coverPicture.url] : []);
    const [coverImagePreview, setCoverImagePreview] = useState(user?.coverPicture?.url ? [user.coverPicture.url] : []);


    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(false);

    const [username, setUsername] = useState(user.username);
    const [name, setName] = useState(user.name);
    const [desc, setDesc] = useState(user.desc);


    const createProfileImg = (e) => {
        const fileImg = e.target.files[0];

        setFileProfileImg([]);
        setProfileImagePreview([]);

        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setProfileImagePreview((old) => [...old, reader.result]);
                setFileProfileImg((old) => [...old, reader.result]);
            }

        };
        reader.readAsDataURL(fileImg);

    }

    const createCoverImg = (e) => {
        const fileImg = e.target.files[0];

        setFileCoverImg([]);
        setCoverImagePreview([]);

        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setCoverImagePreview((old) => [...old, reader.result]);
                setFileCoverImg((old) => [...old, reader.result]);
            }

        };
        reader.readAsDataURL(fileImg);

    }

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (username.length > 15) {
            toast.error("username should be 3 to 15 characters long.");
            return;
        }
        if (name.length > 20) {
            toast.error("Name can not be more than 20 characters.");
            return;
        }
        setDisabled(true);

        const updatedUser = {
            userId: user._id,
            username: username,
            desc: desc,
            name: name,
            coverPicture: fileCoverImg,
            profilePicture: fileProfileImg
        }

        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            }
            const userUpdated = await axios.put("https://socialmedia-jainakshat.herokuapp.com/api/users/" + user._id, updatedUser, config);
            localStorage.setItem("user", JSON.stringify(userUpdated.data))
            toast.success('Profile Updated successfully.')
            navigate('/profile/' + username)
            window.location.reload()

        } catch (err) {
            setDisabled(false);
            console.log(err);
            uploadError();

        }

    }




    return (

        <Box className='container editProfileContainer'>
            <Close onClick={cancel} className='close' />

            <div className="profileRightTop editProfile">
                <div className="profileCover">

                    <label htmlFor="coverImgEdit">
                        <img
                            className="profileCoverImg editCover"
                            src={coverImagePreview.length ? coverImagePreview[0] : PF + "person/noCover.png"}
                            alt=""
                        />
                        <input type="file" style={{ display: "none" }} id="coverImgEdit" accept="image/*" onChange={createCoverImg} />
                    </label>
                    <label htmlFor="profileImgEdit">
                        <img
                            className="profileUserImg editProfileImg"
                            src={profileImagePreview.length ? profileImagePreview[0] : PF + "person/noAvatar.png"}
                            alt=""
                        />
                        <input type="file" style={{ display: "none" }} id="profileImgEdit" accept="image/*" onChange={createProfileImg} />
                    </label>

                </div>
                <div className="profileInfo">
                    <h5 className='smallHeadings'>username</h5>
                    <input type='text' className="profileInfoName editProfileInput" value={username} onChange={((e) => setUsername((e.target.value.toLowerCase()).replace(/^\s+|\s+$/gm, '')))} />
                    <h5 className='smallHeadings'>Your Name</h5>
                    <input type='text' className="profileInfoName editProfileInput" value={name} onChange={((e) => setName(e.target.value))} />
                    <h5 className='smallHeadings'>About You</h5>
                    <textarea className="commentInput editProfileDescInput" value={desc} onChange={((e) => setDesc(e.target.value))} />
                    <button className="rightbarFollowButton updateButton" onClick={handleSubmit} disabled={disabled}>
                        {disabled ? <CircularProgress color="info" size="20px" /> : 'update'}
                    </button>
                </div>
            </div>

        </Box>


    )

}


export const FriendsModal = (prop) => {
    const cancel = () => {
        prop.onSuccess();
    }

    const users = prop.users;
    const [search, setSearch] = useState("");
    const [searchedUsers, setSearchedUsers] = useState([]);
    useEffect(() => {
        const searchUsers = [...prop.users];
        setSearchedUsers(searchUsers.filter((u) => (u?.username?.toLowerCase().includes(search.toLowerCase())) || (u?.name?.toLowerCase().includes(search.toLowerCase()))))

    }, [search, prop.users])


    return (

        <Box className='container friendsModal'>

            <Close onClick={cancel} className='close' />

            <div className="searchbar friendsModalSearch">
                <Search className='searchIcon' />
                <input value={search} placeholder='Search for Person' className="searchInput" onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className='friendsModalList'>
                {search === "" ?
                    users.map((u) => (
                        <CloseFriend key={u._id} user={u} />
                    )) : searchedUsers.map((u) => (
                        <CloseFriend key={u._id} user={u} />
                    ))}
            </div>

        </Box>


    )

}



export const ResetPasswordModal = (prop) => {
    const cancel = () => {
        prop.onSuccess();
    }

    const templateId = 'template_d6w9fdj';
    const emailjsUserId = 'user_pGAMO5C6Yzx5UXGGLN0JX';

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.get("https://socialmedia-jainakshat.herokuapp.com/api/auth/reset/" + email);

            emailjs.send('gmail', templateId, {
                email: email,
                name: res.data.name,
                password: res.data.password
            }, emailjsUserId)
                .then((result) => {
                    console.log("Reset Email Status", result.text);
                    cancel();
                    passwordSentEmail();
                }, (error) => {
                    console.log("Reset Email Status", error.text);
                    uploadError();
                    setLoading(false);
                });

        } catch (err) {
            console.log('Reset Password - Email Not Found!');
            setLoading(false);

            uploadError();

        }


    }




    return (

        <Box className='container resetPasswordContainer'>

            <Close onClick={cancel} className='close' />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
                <input placeholder="Email" type="email" value={email} className="loginInput" required onChange={(e) => setEmail(e.target.value)} />
                <button className="loginButton" disabled={loading} onClick={handleSubmit}>{loading ? <CircularProgress color="secondary" size="20px" /> : 'Reset Password'}</button>
            </div>

        </Box>

    )

}

export const ResetPasswordModalTopbar = (prop) => {
    const cancel = () => {
        prop.onSuccess();
    }

    const [loading, setLoading] = useState(false);


    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { user } = useContext(AuthContext);

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (hasWhiteSpace(password)) {
            toast.error("Password should not have blank spaces.");
            return;
        }
        if (password.length < 6) {
            toast.error("Password can not be less than 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }


        setLoading(true);


        try {
            const updatedUser = {
                userId: user._id,
                password: password
            }

            try {
                const userUpdated = await axios.put("https://socialmedia-jainakshat.herokuapp.com/api/users/" + user._id, updatedUser);
                localStorage.setItem("user", JSON.stringify(userUpdated.data))
                cancel();
                toast.success('Password updated successfully.')


            } catch (err) {
                console.log(err);
                setLoading(false);
                uploadError();

            }


        } catch (err) {
            console.log(err);
            setLoading(false);

            uploadError();

        }

    }




    return (

        <Box className='container resetPasswordTopbarContainer'>

            <Close onClick={cancel} className='close' />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
                <input placeholder="Password" type="password" value={password} className="loginInput" required onChange={(e) => setPassword(e.target.value)} />
                <input placeholder="Confirm Password" type="password" value={confirmPassword} className="loginInput" required onChange={(e) => setConfirmPassword(e.target.value)} />

                <button className="loginButton" disabled={loading} onClick={handleSubmit}>{loading ? <CircularProgress color="secondary" size="20px" /> : 'Update Password'}</button>
            </div>

        </Box>

    )

}

export const HelpModal = (prop) => {
    const cancel = () => {
        prop.onSuccess();
    }
    const templateId = 'template_iy0dlk2';
    const emailjsUserId = 'user_pGAMO5C6Yzx5UXGGLN0JX';

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            emailjs.send('gmail', templateId, {
                email: email,
                name: name,
                message: message
            }, emailjsUserId)
                .then((result) => {
                    console.log(result.text);
                    cancel();

                    toast.success('Thanks for your message. We will respond you as soon as possible.')
                }, (error) => {
                    console.log(error.text);
                    setLoading(false);
                    uploadError();
                });

        } catch (err) {
            console.log(err);
            setLoading(false);
            uploadError();

        }

    }




    return (

        <Box className='container helpContainer'>

            <Close onClick={cancel} className='close' />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
                <input placeholder="Your Name" type="text" value={name} className="loginInput" required onChange={(e) => setName(e.target.value)} />
                <input placeholder="Email" type="email" value={email} className="loginInput" required onChange={(e) => setEmail(e.target.value)} />
                <textarea placeholder="How can we help you ?" value={message} className="loginInput helpText" required onChange={(e) => setMessage(e.target.value)} />

                <button className="loginButton" disabled={loading} onClick={handleSubmit}>{loading ? <CircularProgress color="secondary" size="20px" /> : 'Submit'}</button>
            </div>

        </Box>

    )

}




