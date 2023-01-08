import React, { useState, useEffect } from "react";
import AuthForm from "../components/forms/AuthForm";
import { Link} from "react-router-dom";
import { toast } from "react-toastify";
import {
  RegisterAPI,
  LoginAPI,
  VerifyEmailAndSendOTPAPI,
  VerifyOTPAPI,
  ResetPassword,
} from "../services/AuthApis";

const FirstPage = () => {
  const [page, setPage] = useState("");

  const [display, setDisplay] = useState(false);

  // handle otp add
  const [enterOTP, setEnterOTP] = useState("");

  const [state, setState] = useState({
    user: {},
    token: "",
  });


  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.substr(1);
  }

  useEffect(() => {
    setPage(capitalizeFirstLetter(String(window.location.pathname.slice(1))));
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    gender: "",
    dateofbirth: "",
  });

  const {
    username,
    email,
    password,
    confirmPassword,
    contact,
    gender,
    dateofbirth,
  } = formData;

  const clearData = () => {
    setEnterOTP("");
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
      contact: "",
      gender: "",
      dateofbirth: "",
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (page === "Register") {
      handleRegister();
    } else if (page === "Login") {
      handleLogin();
    } else if (page === "Reset-password") {
      handleResetPassword();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //register user
  const handleRegister = async () => {
    try {
      const registerData = {
        username,
        email,
        password,
        contact,
        gender,
        dateofbirth,
      };
      if (
        !username ||
        !email ||
        !password ||
        !contact ||
        !gender ||
        !dateofbirth
      ) {
        toast.error("Do not skip any field");
        return;
      }

      if (password.length < 6) {
        toast.error("Password is should be 6 characters long");
        return;
      }

      const res = await RegisterAPI(registerData);
      
      if (res.data.status === "ok") {
        toast.success(res.data.message);
        setPage("Login");
      } else {
        toast.error(res.data.error);
        setPage("Register");
      }
    } catch (err) {
      toast.error("Retry check network connection");
    }
  };

  // login user
  const handleLogin = async () => {
    try {
      const loginData = { username, password };

      if (!username) {
        toast.error("Enter Email or Username");
        return;
      }

      if (!password || password.length < 6) {
        toast.error("Enter password and min 6 char");
        return;
      }

      const res = await LoginAPI(loginData);
      if (res.data.status === "ok") {
        toast.success(res.data.message);
      

        setState({
          user: res.data.user,
          token: res.data.token,
        });

        // user data and token save localstorage
        window.localStorage.setItem("auth", JSON.stringify(res.data));

        // navigate home page
        window.location = "/";
      } else {
        toast.error(res.data.error);
      }
    } catch (err) {
      toast.error("username or password incorrect");
    }
  };

  // reset-password user

  // verify emailID and send otp specific emailID 4 digit
  const handleSendOTP = async () => {
    try {
      if (!email) {
        toast.error("Enter Email_Id");
        return;
      }

      const res = await VerifyEmailAndSendOTPAPI(email);
      if (res.data.status === "ok") {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.error);
      }
    } catch (err) {
      toast.error("check internet connection");
    }
  };

  // handle otp change
  const handleOTPChange = (e) => {
    setEnterOTP(e.target.value);
  };

  // submit otp and verify
  const handleSubmitOTP = async () => {
    try {
      const verifyData = { enterOTP, email };

      if (!email) {
        toast.error("Enter Email_Id");
        return;
      }
      if (!enterOTP) {
        toast.error("Enter OTP");
        return;
      }
      if (enterOTP.length < 4) {
        toast.error("Enter OTP 4 digit");
        return;
      }

      const res = await VerifyOTPAPI(verifyData);

      if (res.data.message === "Success") {
        toast.success(res.data.message);
        setDisplay(false);
      } else {
        toast.error(res.data.error);
      }
    } catch (err) {
      toast.error("check internet connection");
    }
  };

  // reset-password
  const handleResetPassword = async () => {
    try {
      const ResetData = { email, password };
      if (!password || password.length < 6) {
        toast.error("Enter password min 6 char");
        return;
      }
      if (!confirmPassword || confirmPassword.length < 6) {
        toast.error("Enter confirmPassword min 6 char");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("password and confirmPassword not match retry");
        return;
      }

      const res = await ResetPassword(ResetData);
      if (res.data.status === "ok") {
        toast.success(res.data.message);
        setPage("Login");
      } else {
        toast.error(res.data.error);
      }
    } catch (err) {
      toast.error("check internet connection");
    }
  };

  return (
    <div
      className="container-fluid m-0 p-0"
      style={{
        background: "url('')",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        height: "40.5rem",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center border border-danger"
        style={{ height: "60px" }}
      >
        <span className="text-primary ms-5 h4 " style={{ cursor: "pointer" }}>
          SocialCircle
        </span>
        <div className="me-5">
          <Link
            className="btn btn-outline-primary"
            to="/login"
            onClick={() => {
              setPage("Login");
              clearData();
              setDisplay(false);
            }}
          >
            Login
          </Link>
          <Link
            className="ms-5 me-5 btn btn-outline-success"
            to="/register"
            onClick={() => {
              setPage("Register");
              clearData();
              setDisplay(false);
            }}
          >
            Register
          </Link>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <span className="d-flex align-self-start mt-4 me-5 h2">{page}</span>
        <AuthForm
          page={page}
          setPage={setPage}
          formData={formData}
          clearData={clearData}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          setDisplay={setDisplay}
          display={display}
          handleSendOTP={handleSendOTP}
          enterOTP={enterOTP}
          handleOTPChange={handleOTPChange}
          handleSubmitOTP={handleSubmitOTP}
        />
      </div>
    </div>
  );
};

export default FirstPage;
