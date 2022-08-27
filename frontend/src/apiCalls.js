import axios from "axios"


export const loginCall = async (userCredential,dispatch) => {

    dispatch({type: "LOGIN_START"});
    try{
        const res = await axios.post("https://socialmedia-jainakshat.herokuapp.com/api/auth/login",userCredential);
        dispatch({type: "LOGIN_SUCCESS",payload: res.data})
        return true
    }catch(err){
        dispatch({type: "LOGIN_FAILURE",payload: err})
        return false
    }
}