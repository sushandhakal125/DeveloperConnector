import api from "../utils/api";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  api
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data || { error: "Registration Failed" }
      })
    );
};

//Login = Get User Token
//Login = Get User Token
export const loginUser = userData => dispatch => {
  api
    .post("/api/users/login", userData)
    .then(res => {
      const token = res.data?.token;

      if (!token || typeof token !== "string") {
        console.error("❌ Invalid token received:", res.data);
        dispatch({
          type: GET_ERRORS,
          payload: { token: "Invalid token received" }
        });
        return;
      }

      localStorage.setItem("jwtToken", token);
      setAuthToken(token.startsWith("Bearer ") ? token : `Bearer ${token}`);
      const decoded = jwt_decode(token.replace("Bearer ", ""));
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      console.error("Login failed:", err.response?.data || err.message);
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { error: "Login Failed" }
      });
    });
};


//Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//Log user out
export const logoutUser = () => dispatch => {
  //Remove token from localStorage
  localStorage.removeItem("jwtToken");
  //Remove auth header for future requests
  setAuthToken(false);
  //Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
