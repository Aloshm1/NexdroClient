import { Container } from "@mui/material";
import React, { useState } from "react";
import styles from "../styles/login.module.css";
import Button from "@mui/material/Button";
import DroneImage from "../images/drone_image.png"
import Image from "next/image"
import axios from "axios";
import Loader from "../components/loader";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
function ForgetPassword() {
  const [isLoading, setLoading] = useState(false);
  let [email, setEmail] = useState("")
  let submit = () =>{
    setLoading(true)
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    if(email == ""){
      document.getElementById("email_error").innerHTML = "Email is Required"
      document.getElementById("email_error").style.display = "block"
      setLoading(false)
    }else if(email !== "" && (!validateEmail(email))){
      document.getElementById("email_error").innerHTML = "Invalid Email Id"
      document.getElementById("email_error").style.display = "block"
      setLoading(false)
    }else{
      axios.post(`${domain}/api/user/forgetPassword`, {
        email: email,
      }).then(res=>{
        console.log(res)
        if(res.data == "invalid email"){
          document.getElementById("email_error").innerHTML = "Email Id doesn't exists"
      document.getElementById("email_error").style.display = "block"
      setLoading(false)
        }else{
          document.getElementById("email_error").innerHTML = "Recovery Mail has been sent to your mail Id"
          document.getElementById("email_error").style.display = "block"
          setLoading(false)
        }
       
      }).catch(err=>{
        document.getElementById("email_error").innerHTML = "Email Id doesn't exists"
      document.getElementById("email_error").style.display = "block"
      setLoading(false)
      })
    }
  }
  return (

    <Container className="Container">
      <div className={styles.login}>
        <div className={styles.loginImage}>
          <Image src = {DroneImage} />
        </div>
        <div className={styles.loginForm}>
          <h3 style={{marginBottom:"30px"}}>Forgot your password?</h3>
          <label htmlFor="email">
            <div className="label" htmlFor="email">Email ID</div>
          </label>
          <input type="email" id="email" className="inputBox" value={email} onChange={(e)=>{
            document.getElementById("email_error").style.display = "none"
            setEmail(e.target.value)
          }} />
          <div className="input_error_msg" id="email_error">
                Email is required
              </div>
              {isLoading ? (
              <Button className="formBtnLoading  mt-10 mb-10" style = {{textTransform: "capitalize"}}>
                <Loader />
                Submit
              </Button>
            ) : (
              <Button className="formBtn  mt-10 mb-10" style = {{textTransform: "capitalize"}}  onClick={submit}>
                Submit
              </Button>
            )}
        </div>
      </div>
    </Container>
  );
}

export default ForgetPassword;