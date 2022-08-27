import { useContext, useRef, useState } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ResetPasswordModal } from "../../components/post/Modals";
import { toast } from 'react-toastify';

export default function Login() {
    const email = useRef();
    const password = useRef();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false)

    const { isFetching, dispatch } = useContext(AuthContext);


    const loginError = () => toast.error("Wrong Credentials!");
    const handleClick = (e) => {
        e.preventDefault();
        loginCall({ email: email.current.value, password: password.current.value }, dispatch).then(e => { !e && loginError() })

    };
    return (
        <>
            <Modal
                open={showModal}
                //className={classes.modal}
                onClose={() => setShowModal(false)}
            >
                <ResetPasswordModal onSuccess={() => setShowModal(false)} />
            </Modal>
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
                            <input placeholder="Email" type="email" className="loginInput" required ref={email} />
                            <input placeholder="Password" type="password" className="loginInput" minLength="6" required ref={password} />
                            <button className="loginButton" type="submit" disabled={isFetching}>{isFetching ? <CircularProgress color="secondary" size="20px" /> : "Log In"}</button>
                            <span className="loginForgot" onClick={() => setShowModal(true)}>{isFetching ? <CircularProgress color="secondary" size="20px" /> : "Forgot Password?"}</span>
                            <button className="loginRegisterButton" onClick={() => navigate('/register')}>
                                {isFetching ? <CircularProgress color="secondary" size="20px" /> : "Create a New Account"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}