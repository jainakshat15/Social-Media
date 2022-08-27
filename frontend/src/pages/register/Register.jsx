import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";
import { useNavigate } from "react-router"
import { toast } from 'react-toastify';
import { CircularProgress } from "@mui/material";



export default function Register() {
    const username = useRef()
    const name = useRef()
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);



    const emailExists = () => toast.error("Email or Username already exists!");

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
    }

    const handleClick = async (e) => {
        e.preventDefault();

        if (username.current.value.length > 15 || username.current.value.length < 3) {
            toast.error("username should be 3 to 15 characters long.");
            return;
        }

        if (hasWhiteSpace(username.current.value)) {
            toast.error("username should not have blank spaces.");
            return;
        }
        if (name.current.value.length > 20) {
            toast.error("Name can not be more than 20 characters.");
            return;
        }
        if (hasWhiteSpace(password.current.value)) {
            toast.error("Password should not have blank spaces.");
            return;
        }
        if (passwordAgain.current.value !== password.current.value) {
            toast.error("Passwords don't match!");
            return;
        }

        setLoading(true);

        const user = {
            name: name.current.value,
            username: username.current.value.toLowerCase(),
            email: email.current.value,
            password: password.current.value
        }
        try {
            const newUser = await axios.post("https://socialmedia-jainakshat.herokuapp.com/api/auth/register", user);
            localStorage.setItem("user", JSON.stringify(newUser.data));
            window.location.reload();
        } catch (err) {
            emailExists();
            setLoading(false);
            console.log(err);
        }

    };


    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Social Media</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input placeholder="Username" required ref={username} className="loginInput" />
                        <input placeholder="Email" required ref={email} type="email" className="loginInput" />
                        <input placeholder="Name" required ref={name} className="loginInput" />
                        <input placeholder="Password" required ref={password} type="password" minLength="6" className="loginInput" />
                        <input placeholder="Password Again" required ref={passwordAgain} type="password" className="loginInput" />
                        <button className="loginButton" disabled={loading}>{loading ? <CircularProgress color="secondary" size="20px" /> : 'Sign Up'}</button>

                        <button type="submit" className="loginRegisterButton" onClick={() => navigate('/login')}>
                            Log into Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}