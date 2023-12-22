import { Container, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../styles/login.module.css";
import Button from "@mui/material/Button";
import DroneImage from "../images/drone_image.png";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import VisibilitySharpIcon from "@mui/icons-material/VisibilitySharp";
import VisibilityOffSharpIcon from "@mui/icons-material/VisibilityOffSharp";
import axios from "axios";
import Router from "next/router";
import Loader from "../components/loader";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;

function Login(props) {
  let [flag, setFlag] = useState(true)
  let tempReload = () =>{
    props.reload(!flag)
  }
  useEffect(()=>{
    if(localStorage.getItem("reactivate")){
      document.getElementById("alert").style.display = "flex"
      setTimeout(()=>{
        if(document.getElementById("alert")){
          document.getElementById("alert").style.display = "none"
        }
      },4000)
      localStorage.removeItem("reactivate")
    }
    if(localStorage.getItem("access_token")){
      Router.push("/")
    }
    document.getElementById("email").focus()
  },[])
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  const changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    document.getElementById("credentials_error").style.display = "none";
    document.getElementById("credentials_error").innerText = "Invalid credentials";
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = () => {
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    var focusField = "";
    var error = false;
    if (formData.email === "") {
      document.getElementById("email_error").innerText = "Email ID is required";
      document.getElementById("email_error").style.display = "block";
      error = true;
      focusField = "email";
    }
    if (formData.email.length > 100) {
      document.getElementById("email_error").innerText = "Email ID should not exceed 100 characters";
      document.getElementById("email_error").style.display = "block";
      error = true;
      focusField = "email";
    }
    if (formData.email !== "" && !validateEmail(formData.email)) {
      document.getElementById("email_error").innerText =
        "Email ID is not valid";
      document.getElementById("email_error").style.display = "block";
      error = true;
      if (focusField === "") {
        focusField = "email";
      }
    }
    if (formData.password === "") {
      document.getElementById("password_error").style.display = "block";
      document.getElementById("password_error").innerText = "Password is required";
      error = true;
      if (focusField === "") {
        focusField = "password";
      }
    }
    if (formData.password.length > 100) {
      document.getElementById("password_error").style.display = "block";
      document.getElementById("password_error").innerText = "Password should not exceed 100 characters"
      error = true;
      if (focusField === "") {
        focusField = "password";
      }
    }
    if (!error) {
      setLoading(true);
      axios
        .post(`${domain}/api/user/login`, {
          email: formData.email,
          password: formData.password,
        })
        .then((res) => {
          console.log(res.data);
          localStorage.setItem("access_token", res.data.token);
          localStorage.setItem("token_type", "Bearer");
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("email", res.data.verify);

          // // props.updateLoginStatus()

          if (res.data.verify === false) {
            Router.push("/verify-email");
          } else if (res.data.role === undefined) {
            Router.push("/choose-categories");
          } else if (localStorage.getItem("role") === "pilot") {
            Router.push("/pilot-dashboard/account/");
          } else if (localStorage.getItem("role") === "service_center") {
            Router.push("/center-dashboard/account/");
          } else if (localStorage.getItem("role") === "company") {
            Router.push("/company-dashboard/account/");
          } else if (localStorage.getItem("role") === "halfCompany") {
            Router.push("/create-company");
          } else if (localStorage.getItem("role") === "halfPilot") {
            Router.push("/create-pilot");
          } else if (localStorage.getItem("role") === "training_center"){
            Router.push("/training-center-dashboard/account");
          } else {
            Router.push("/booster-dashboard/account/");
          }
          setLoading(false);
          tempReload("hii")
        })
        .catch((err) => {
          console.log(err.response);
          try {
            if (err.response.status === 400) {
             
              document.getElementById("credentials_error").innerText = err.response.data
              document.getElementById("credentials_error").style.display = "block";
              document.getElementById("email").focus();
              setLoading(false);
            } else {
              setServerError(true);
              document.getElementById("credentials_error").innerText = "Something went wrong. Try again later";
              document.getElementById("credentials_error").style.display = "block";
              setLoading(false);
            }
          } catch {
            setServerError(true);
            setLoading(false);
          }
        });
    } else {
      document.getElementById(focusField).focus();
    }
  };
  const enterFormSubmit = (e) => {
    if (e.key === "Enter"){
      handleClick()
    }
  }

  return (
    <section style = {{backgroundColor: "#F8FAFB"}}>
      <Head>
        <title>Login</title>
      </Head>
      <Container className="Container">
        <div className={styles.register}>
          <Grid container className = {styles.registerFormContainer}>
            <Grid item xs = {12} lg = {6} display={{ xs: "none", lg: "block" }}>
              <div className={styles.registerImage}>
                <Image src={DroneImage} alt = "drone_image"/>
              </div>
            </Grid>
            <Grid item xs = {12} lg = {6} className = {styles.registerFormInnerContainer}>
              <div className={styles.titleTextContainer}>
                <div className={styles.titleText}>Login with Nexdro</div>
              </div>
              <label htmlFor="email">
                <div className={styles.loginLabel}>Email ID</div>
              </label>
              <input
                type="email"
                id="email"
                className="inputBox"
                value={formData.email}
                name="email"
                onChange={changeHandler}
                onKeyUp = {enterFormSubmit}
              />
              <div className="input_error_msg" id="email_error">
                Email ID is required
              </div>
              <label htmlFor="password">
                <div className={styles.loginLabel}>Password</div>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="inputBox"
                  value={formData.password}
                  name="password"
                  onChange={changeHandler}
                  style={{ paddingRight: "40px" }}
                  onKeyUp = {enterFormSubmit}
                />
                {showPassword ? (
                  <VisibilityOffSharpIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="showPasswordIcon"
                  />
                ) : (
                  <VisibilitySharpIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="showPasswordIcon"
                  />
                )}
              </div>
              <div className="input_error_msg" id="password_error">
                Password is required
              </div>
              <div className="input_error_msg" id="credentials_error">
                Invalid credentials
              </div>
              <div style={{ textAlign: "right" }}>
                <Link
                  href="/forgot-password"
                  className={styles.forgetPasswordContainer}
                >
                  <a className={styles.forgetPassword}>Forgot Password</a>
                </Link>
              </div>
              {isLoading ? (
                <button className={styles.loginSubmitBtn} style = {{textTransform: "initial"}}>
                  <Loader />
                  Loading
                </button>
              ) : (
                <button className={styles.loginSubmitBtn} onClick={handleClick} style = {{textTransform: "initial"}}>
                  Login
                </button>
              )}
              <div className={`${styles.loginFormFooter}  mt-10 mb-30`}>
                Dont have Nexdro Account?{" "}
                <Link href="/register">
                  <a className={styles.loginPageRegisterLink}>Register Now</a>
                </Link>
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </section>
  );
}

export default Login;
