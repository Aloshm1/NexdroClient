import { Container, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import styles from "../../../../styles/createPilot.module.css";
import Button from "@mui/material/Button";
import DroneImage from "../../../../images/drone_image.png";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
export async function getServerSideProps(context) {
  const { params } = context;
  const { id, token } = params;
  const res = await fetch(`${domain}/api/user/verifyMail/${id}/verify/${token}`);
  const data = await res.json();
    return {
      props: {
        data: data
      },
    };

}
function VerifiedEmail({data}) {
  React.useEffect(() => {
    console.log(data)
if(data.message){
  setMessage(data.message)
}    
if(data.role){
  setMyRole(data.role)
}
if (data.token){
  localStorage.setItem("access_token", data.token)
  localStorage.setItem("role", data.role)
  localStorage.setItem("email", true)
}
  }, []);
  let [message, setMessage] = useState("");
  let [myRole, setMyRole] = useState(null);
  

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
          <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
            <div className="rightBox" id="rightBoxLogin">
              {message === "No token available" ? (
                <h4>oops something Went Wrong</h4>
              ) : (
                <div>
                  <h4>Your Mail has been successfully Verified</h4>

                  {/* //changing */}
                  { 
                     (!myRole || myRole === null || myRole == "undefined") ? 
                     <>
                     <p className="lightText">
                    Click below to complete your Profile or go to home Page
                  </p>
                  <Link href="/choose-categories">
                  <div
                    className="newBtn"
                    style={{ backgroundColor: "#4ffea3" }}
                  >
                    Next
                  </div>
                  </Link>
                  </> :
                  <>
                  <p className="lightText">
                  Click below to go to home Page
                </p>
                <Link href="/">
                <div
                  className="newBtn"
                  style={{ backgroundColor: "#00e7fc" }}
                >
                  Home Page
                </div>
                </Link>
                {/* <div
                  className="newBtn"
                  style={{ backgroundColor: "#4ffea3" }}
                >
                  Home Page
                </div> */}
                </>
                  }
                  
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default VerifiedEmail;
