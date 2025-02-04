import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import "./LoginRegisterForm.css";
import { AuthContext } from "../../../Context/AuthContext";

export const LoginRegisterForm = ({
  apiEndPoint,
  title,
  redirectMessage,
  redirectPage,
  action,
  submitBtnMessage,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { dispatch } = useContext(AuthContext);
  const [registered, setRegistered] = useState(false);

  const checkUserCart = async (userId) => {
    const url = process.env.REACT_APP_BACKEND_URL + "/api/cart/create/" + userId;
    const res = await fetch(url, { method: "POST" });
    const data = await res.json();

    if (res.ok) {
      console.log(data.message);
      return;
    } else {
      setError(data.message);
      return;
    }
  };

  const checkUserProfile = async (userId) => {
    const url = process.env.REACT_APP_BACKEND_URL + "/api/info/" + userId;
    const res = await fetch(url, { method: "POST" });
    const data = await res.json();

    if (res.ok) {
      console.log(data.message);
      return;
    }
    setError(data.message);
  }

  const login = async (e) => {
    e.preventDefault();

    const url = process.env.REACT_APP_BACKEND_URL + "/api/auth/" + apiEndPoint; // "login" or "register"
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      if (apiEndPoint === "register") {
        // redirect to login page
        dispatch({ type: "SIGNUP" });
        setRegistered(true);
        return;
      }
      if (data.userType === "customer") {
        checkUserCart(data.id);
        checkUserProfile(data.id);
      }
      localStorage.setItem("userAuth", JSON.stringify(data)); // store username, usertype & JWT token in browser
      dispatch({ type: "LOGIN", userAuth: data });
    } else {
      setError(data.message);
    }
  };

  return (
    <form className="loginRegisterForm" onSubmit={login}>
      <p className="title">{title}</p>
      <div className="inputContainer">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Username</label>
      </div>
      <div className="inputContainer">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Password</label>
      </div>
      <div className="redirectMessage">
        {redirectMessage} &nbsp;
        <Link
          className="redirectLink"
          to={`${redirectPage}`}
          onClick={() => {
            window.scrollTo({ top: (0, 0), behavior: "instant" });
          }}
        >
          {action}
        </Link>
      </div>
      {/* show error message on unsuccessful login*/}
      {error && <div>{error}</div>}
      <button className="submitBtn" type="submit">
        {submitBtnMessage}
      </button>
      {registered && <Navigate to='/login'></Navigate>}
    </form>
  );
};
