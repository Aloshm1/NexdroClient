import { Container } from "@mui/material";
import React, { useState } from "react";
import styles from "../../../../styles/login.module.css";
import Button from "@mui/material/Button";
import DroneImage from "../../../../images/drone_image.png";
import Link from "next/link";
import Image from "next/image";
import VisibilitySharpIcon from "@mui/icons-material/VisibilitySharp";
import VisibilityOffSharpIcon from "@mui/icons-material/VisibilityOffSharp";
import axios from "axios";
import Router from "next/router";
import Loader from "../../../../components/loader";
import { useRouter } from 'next/router'
import Dialog from '@mui/material/Dialog';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Slide from '@mui/material/Slide';

const domain = process.env.NEXT_PUBLIC_LOCALHOST;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PasswordRecovery() {
  const params = useRouter().query;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ password1: "", password2: "" });
  const [isLoading, setLoading] = useState(false);
  const [isAlert, setIsAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState("")

  const changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    document.getElementById("credentials_error").style.display = "none";
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = () => {
    console.log("Entered")
    var focusField = "";
    var error = false;
    if (formData.password1.length < 8) {
      document.getElementById("password1_error").style.display = "block";
      error = true;
      focusField = "password1";
    }
    
    if (formData.password1 !== formData.password2) {
      document.getElementById("credentials_error").innerText = "Password and confirm password doesnt match";
      document.getElementById("credentials_error").style.display = "block";
      error = true;
      if (focusField === "") {
        focusField = "password2";
      }
    }
    if (!error) {
      setLoading(true);
      axios
        .post(`${domain}/api/user/recoverPassword/${params.id}/verify/${params.token}`,{
            password: formData.password1
        })
        .then((res) => {
          console.log(res.data)
          if (res.data === "Password Recovered Successfully"){
            setAlertMsg("Your password is successfully changed. Login with new password.")
            setIsAlert(true)
          }else{
            document.getElementById("credentials_error").innerText = "Something went wrong on the server. Try again later."
            document.getElementById("credentials_error").style.display = "block"
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.response.data)
          if (err.response.data === "User Doesnt exists"){
            document.getElementById("credentials_error").innerText = "You are not a Nexdro member. Please signup."
            document.getElementById("credentials_error").style.display = "block"
          }
          if (err.response.data === "No token available"){
            document.getElementById("credentials_error").innerText = "The link has been expired. Recover again."
            document.getElementById("credentials_error").style.display = "block"
          }
          setLoading(false)
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
    <>
      <Container className="Container">
        <div className={styles.login}>
          <div className={styles.loginImage}>
            <Image src={DroneImage} />
          </div>
          <div className={styles.loginForm}>
            <h3 style = {{paddingBottom: "25px"}}>Recover your Drone Zone Password</h3>
            <label htmlFor="email">
              <div className="label">Type Password:</div>
            </label>
            <input
              type="text"
              id="password1"
              className="inputBox"
              value={formData.password1}
              name="password1"
              onChange={changeHandler}
              onKeyUp = {enterFormSubmit}
            />
            <div className="input_error_msg" id="password1_error">
              Password must have atleast 8 characters
            </div>
            <label htmlFor="password" className="label">
              <div className="label">Confirm Password:</div>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password2"
                className="inputBox"
                value={formData.password2}
                name="password2"
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
            <div className="input_error_msg" id="password2_error">
              Confirm password must have atleast 8 characters
            </div>
            <div className="input_error_msg" id="credentials_error">
              Password and confirm password doesnt match
            </div>
            
            {isLoading ? (
              <Button className="formBtnLoading">
                <Loader />
                Set Password
              </Button>
            ) : (
              <Button className="formBtn" onClick={handleClick}>
                Set Password
              </Button>
            )}
          </div>
        </div>
        <Dialog
        open={isAlert}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>Router.push("/login")}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon className="popupClose" onClick={()=>Router.push("/login")}/>
          <div className="popupTitle">
          {alertMsg}
          </div>
          <center>
          <div className="popupLoginBtn" onClick={()=>Router.push("/login")}>Close</div>
          </center>
        </div>
      </Dialog>
      </Container>
    </>
  );
}

export default PasswordRecovery;
