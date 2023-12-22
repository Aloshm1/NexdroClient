import { Container, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import styles from "../styles/createPilot.module.css";
import Button from "@mui/material/Button";
import DroneImage from "../images/drone_image.png";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import Router from "next/router";
import Loader from "../components/loader";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;

function VerifyEmail() {
    useEffect(()=>{
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        console.log(res)
        localStorage.setItem("email",res.data.verify )
        localStorage.setItem("role", res.data.role)
        if((res.data.verify) && localStorage.getItem("role") == "undefined"){
          Router.push("/choose-categories");
        } 
        else if (!localStorage.getItem("access_token")){
          Router.push("/login")
        }
        else if((localStorage.getItem("email") !== "false") && localStorage.getItem("role") == "undefined"){
          Router.push("/choose-categories");
        }else if((localStorage.getItem("email") == "true") && localStorage.getItem("role") !== "undefined"){
          Router.push("/noComponent")
        }
      });
        
     
     },[])
    let sendMail = () =>{
        const config = {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          };
          document.getElementById("p1").style.display = "none"
          document.getElementById("p3").style.display = "block"
            axios.post(`${domain}/api/user/emailResend`, config).then(res=>{
              console.log(res)
              if(res.data === "successfull"){
                document.getElementById("p3").style.display = "none"
                document.getElementById("p2").style.display = "block"
              }
            })
    }
  return (
    <>
      <Container className="Container">
        <Grid container spacing={2}>
          <Grid
            item
            xl={6}
            lg={6}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: {
                xs: "none",
                sm: "block",
                md: "block",
                lg: "block",
                xl: "block",
              },
            }}
          >
            <div>
            <Image src={DroneImage} style={{ width: "100px" }} />
            </div>
          </Grid>
          <Grid
            item
            xl={6}
            lg={6}
            md={6}
            sm={6}
            xs={12}
          
          >
            <div className="rightBox"  id="rightBoxLogin">
            <h4>
            We have sent you a verification link on your Mail Id. Please verify before Proceeding

            </h4>
            <p className="lightText" id="p3" style={{display: "none", backgroundColor: "#e5e5e5"}}><Loader /></p>
            <p className="lightText" id="p1">Didn&apos;t get the mail? Click <span style={{color: "blue", textDecoration: "underline", cursor: "pointer"}} onClick={sendMail} >here</span> to resend it</p>
            <p className="lightText" id="p2" style={{display:"none"}}>Email successfully sent to your mail again</p>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default VerifyEmail;
