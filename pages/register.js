import { Container, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import styles from "../styles/register.module.css";
import loginStyles from "../styles/login.module.css";
import Button from "@mui/material/Button";
import DroneImage from "../images/drone_image.png";
import Link from "next/link";
import Image from "next/image";
import VisibilitySharpIcon from "@mui/icons-material/VisibilitySharp";
import VisibilityOffSharpIcon from "@mui/icons-material/VisibilityOffSharp";
import axios from "axios";
import Router from "next/router";
import Loader from "../components/loader";
import Countries from "./api/country.json";
import Head from "next/head";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    phone: "",
    password: "",
    code: "",
  });
  const [isPilot, setIsPilot] = useState(true)
  const [isLoading, setLoading] = useState(false);
  const [termsConditions, setTermsConditions] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [device, setDevice] = useState(undefined);

  const changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    document.getElementById("credentials_error").style.display = "none";
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const countryChangeHandler = (e) => {
    document.getElementById(`country_error`).style.display = "none";
    document.getElementById("credentials_error").style.display = "none";
    var countryDet = e.target.value.split(",")
    setFormData({
      ...formData,
      country: countryDet[0],
      code: countryDet[countryDet.length-1],
    });
  };

  const phoneChangeHandler = (e) => {
    document.getElementById(`phone_error`).style.display = "none";
    document.getElementById("credentials_error").style.display = "none";
    try {
      if (
        Number(
          e.target.value.slice(
            formData.code.length + 1,
            14 + formData.code.length + 1
          )
        ) ||
        e.target.value.slice(
          formData.code.length + 1,
          14 + formData.code.length + 1
        ) === ""
      ) {
        setFormData({
          ...formData,
          phone: e.target.value.slice(
            formData.code.length + 1,
            14 + formData.code.length + 1
          ),
        });
      }
    } catch {}
  };

  useEffect(() => {
    if(localStorage.getItem("access_token")){
      Router.push("/")
    }
    document.getElementById("name").focus();
    var systemInfo = window.navigator.userAgent
    var temp_device
    try{
      temp_device = systemInfo
      setDevice(temp_device)
    }
    catch{
      temp_device = systemInfo
      setDevice(temp_device)
    }
    console.log(temp_device)
  }, []);

  const changeIsPilot = () => {
    setIsPilot(!isPilot)
  }

  const handleClick = () => {
    console.log("register")
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    var focusField = "";
    var error = false;
    var fields = ["name", "email", "country", "phone", "password"];
    for (var i = 0; i < fields.length; i++) {
      if (formData[fields[i]] === "") {
        document.getElementById(`${fields[i]}_error`).style.display = "block";
        document.getElementById(
          `${fields[i]}_error`
        ).innerText = `${fields[i]} is required`;
        error = true;
        if (focusField === "") {
          focusField = fields[i];
        }
      }
      if (fields[i] === "name" && (formData[fields[i]].length < 3 || formData[fields[i]].length > 25)){
        document.getElementById(`${fields[i]}_error`).style.display = "block";
        document.getElementById(
          `${fields[i]}_error`
        ).innerText = `${fields[i]} should be between 3 and 25 characters`;
        error = true;
        if (focusField === "") {
          focusField = fields[i];
        }
      }
      if (
        (fields[i] === "email" ||
          fields[i] === "password") &&
        formData[fields[i]].length !== 0 &&
        (formData[fields[i]].length < 3 || formData[fields[i]].length > 100)
      ) {
        document.getElementById(`${fields[i]}_error`).style.display = "block";
        document.getElementById(
          `${fields[i]}_error`
        ).innerText = `${fields[i]} should be between 3 and 100 characters`;
        error = true;
        if (focusField === "") {
          focusField = fields[i];
        }
      }
      if (
        fields[i] === "email" &&
        !validateEmail(formData.email) &&
        formData.email.length !== 0
      ) {
        document.getElementById(`email_error`).style.display = "block";
        document.getElementById(
          `email_error`
        ).innerText = `Email id is not valid`;
        error = true;
        if (focusField === "") {
          focusField = fields[i];
        }
      }
      if (
        fields[i] === "country" &&
        formData.country.length !== 0 &&
        (formData.country.length < 2 || formData.country.length > 100)
      ) {
        document.getElementById(`country_error`).style.display = "block";
        document.getElementById(
          `country_error`
        ).innerText = `Country should be between 2 and 100 characters`;
        error = true;
        if (focusField === "") {
          focusField = fields[i];
        }
      }
      if (
        fields[i] === "phone" &&
        formData.phone.length !== 0 &&
        (formData.phone.length > 14 || formData.phone.length < 7)
      ) {
        document.getElementById(`phone_error`).style.display = "block";
        document.getElementById(
          `phone_error`
        ).innerText = `Invalid phone number`;
        error = true;
        if (focusField === "") {
          focusField = fields[i];
        }
      }
      if (
        fields[i] === "password" &&
        formData.password.length !== 0 &&
        formData.password.length < 8
      ) {
        document.getElementById(`password_error`).style.display = "block";
        document.getElementById(
          `password_error`
        ).innerText = `Password should have minimum 8 characters`;
        error = true;
        if (focusField === "") {
          focusField = fields[i];
        }
      }
    }
    if (!error) {
      console.log(formData.email)
      setLoading(true);
      axios
        .post(`${domain}/api/user/checkMail`, { email: formData.email })
        .then((res) => {
          console.log(res);
          axios.post(`${domain}/api/user/checkPhoneNo`, {
            phoneNo: formData.phone,
            country: formData.country,
          })
          .then(res => {
            console.log(res.data)
            if (res.data === "User phoneNo available"){
              axios
            .post(`${domain}/api/user/register`, {
              name: formData.name,
              email: formData.email,
              phoneNo: formData.phone,
              password: formData.password,
              country: formData.country,
            })
            .then((res) => {
              console.log(res);
              localStorage.setItem("access_token", res.data.token);
              localStorage.setItem("token_type", "Bearer");
              localStorage.setItem("role", res.data.role);
              localStorage.setItem("email", res.data.verify);
              console.log(localStorage.getItem("access_token"));
              if (isPilot){
                localStorage.setItem("tempUserType", "pilot")
                Router.push("/create-pilot")
              }else{
                localStorage.setItem("tempUserType", "others")
                Router.push("/choose-categories");
              }
            })
            .catch((err) => {
              console.log(err);
              document.getElementById("credentials_error").style.display =
                "block";
              setLoading(false);
            });
            }else{
              document.getElementById("phone_error").innerText = "Phone number already taken"
              document.getElementById("phone_error").style.display = "block"
              document.getElementById("phone").focus()
              setLoading(false);
            }
          })
          .catch(err => {
            document.getElementById("phone_error").innerText = "Phone number already taken"
            document.getElementById("phone_error").style.display = "block"
            document.getElementById("phone").focus()
            setLoading(false);
          })
          
        })
        .catch((err) => {
          setLoading(false);
          console.log("error");
          console.log(err);
          if (err.response.data === "User already exists") {
            document.getElementById("email_error").innerText =
              "Email ID already taken";
            document.getElementById("email_error").style.display = "contents";
            document.getElementById("email").focus();
          } else {
            document.getElementById("credentials_error").style.display =
              "block";
            document.getElementById("credentials_error").innerText =
              "Something went wrong.";
          }
          if (!err.response.data) {
            document.getElementById("credentials_error").style.display =
              "block";
          }
        });
    } else {
      document.getElementById(focusField).focus();
    }
  };

  const enterFormSubmit = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <section style = {{backgroundColor: "#F8FAFB"}}>
      <Head>
        <title>Register</title>
      </Head>
      <Container className="Container">
        <div className={styles.register}>
          <Grid container className = {styles.registerFormContainer}>
            <Grid item xs = {12} lg = {6} display={{ xs: "none", lg: "block" }}>
              <div className={styles.registerImage}>
                <Image src={DroneImage} alt = "register_image"/>
              </div>
            </Grid>
            <Grid item xs = {12} lg = {6} className = {styles.registerFormInnerContainer}>
              <div className={styles.registerInputTitleContainer}>
                <div className={styles.registerInputTitle}>Create a Nexdro account</div>
              </div>
              <div className={styles.registerInputRow}>
                <div className={styles.registerInputCol}>
                  <label htmlFor="name">
                    <div className={styles.registerFormLabel}>Name</div>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={`inputBox ${styles.registerInput}`}
                    value={formData.name}
                    name="name"
                    onChange={changeHandler}
                    onKeyUp={enterFormSubmit}
                  />
                  <div className="input_error_msg" id="name_error">
                    Name is required
                  </div>
                </div>
                <div className={styles.registerInputCol}>
                  <label htmlFor="email">
                    <div className={styles.registerFormLabel}>Email ID</div>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`inputBox ${styles.registerInput}`}
                    value={formData.email}
                    name="email"
                    onChange={changeHandler}
                    onKeyUp={enterFormSubmit}
                  />
                  <div className="input_error_msg" id="email_error">
                    Email ID is required
                  </div>
                </div>
              </div>
              <div className={styles.registerInputRow}>
                <div className={styles.registerInputCol}>
                  <label htmlFor="country">
                    <div className={styles.registerFormLabel}>Country</div>
                  </label>
                  <select
                    className={`inputBox ${styles.registerInput}`}
                    id="country"
                    onChange={countryChangeHandler}
                    name="country"
                    style={{ color: formData.country ? "black" : "gray" }}
                  >
                    <option value="" style={{ color: "#000" }}>
                      Select country
                    </option>
                    {Countries.map((country, index) => {
                      return (
                        <option
                          value={`${country.name},${country.dial_code}`}
                          style={{ color: "#000", cursor: "pointer" }}
                          key={index}
                        >
                          {country.name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="input_error_msg" id="country_error">
                    Country is required
                  </div>
                </div>
                <div className={styles.registerInputCol}>
                  <label htmlFor="phone">
                    <div className={styles.registerFormLabel}>Phone Number</div>
                  </label>
                  <input
                    type="text"
            
                    id="phone"
                    className={`inputBox ${styles.registerInput}`}
                    value={`${formData.code} ${formData.phone}`}
                    name="phone"
                    onChange={phoneChangeHandler}
                    onKeyUp={enterFormSubmit}
                  />
                  <div className="input_error_msg" id="phone_error">
                    Phone number is required
                  </div>
                </div>
              </div>
              <label htmlFor="password" className={styles.registerFormLabel}>
                <div className={styles.registerFormLabel}>Password</div>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`inputBox ${styles.registerInput}`}
                  value={formData.password}
                  name="password"
                  onChange={changeHandler}
                  style={{ paddingRight: "40px" }}
                  onKeyUp={enterFormSubmit}
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
              <div className = {styles.isPilotCheckboxContainer}>
                <label htmlFor="isPilotCheckbox" className="label1" onClick = {changeIsPilot}>Are you a drone pilot?</label>
                <span className="isPilotradioContainer" style = {{marginLeft: "13px"}}>
                  <span className="isPilotradio" onClick = {() => {setIsPilot(true)}}>
                    <input type="radio" name="" id="pilot" checked = {isPilot} />
                    <label htmlFor = "pilot" style = {{cursor: "pointer", marginLeft: "5px"}}>Yes</label>
                  </span>
                  <span className="isPilotradio" onClick = {() => {setIsPilot(false)}}>
                    <input type="radio" name="" id="not_pilot" checked = {!isPilot} />
                    <label htmlFor = "not_pilot" style = {{cursor: "pointer", marginLeft: "5px"}}>No</label>
                  </span>
                </span>
              </div>
              <div className="input_error_msg" id="credentials_error">
                Something went wrong. Try again.
              </div>
              {isLoading ? (
                <Button
                  className="formBtnLoading"
                  style={{ textTransform: "capitalize" }}
                >
                  <Loader />
                  Loading
                </Button>
              ) : (
                <button
                  className={styles.registerBtn}
                  onClick={handleClick}
                >
                  Register
                </button>
              )}
              <div className={`${loginStyles.loginFormFooter} ${styles.registerFormFooter} mt-10`}>
                Already have Nexdro Account?{" "}
                <Link href="/login">
                  <a className={loginStyles.loginPageRegisterLink}> Sign In</a>
                </Link>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", fontSize: "14px", textAlign: "center", marginBottom: "20px" }}>
                <div style = {{color: "#374957"}}>
                  By clicking Register, you&apos;re okay with our &nbsp;
                  <Link href="/terms-and-conditions">
                    <a className="tnc" style = {{fontSize: "14px"}}>terms and conditions</a>
                  </Link>
                ,&nbsp;
                  <Link href="/privacy-policy">
                    <a className="tnc" style = {{fontSize: "14px"}}>privacy policy&nbsp;</a>
                  </Link>
                  and our default Notification Settings
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </section>
  );
}

export default Register;
