import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import global from "../../styles/all.module.css";
import NavCss from "./Nav.module.css";
import axios from "axios"
import { Container } from "@mui/material";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const frontendDomain = process.env.NEXT_PUBLIC_BASE_URL;

function Nav() {
  const router = useRouter();
  const [userName, setUserName] = useState(false)
  let [currentUrl, setCurrentUrl] = useState("")
  useEffect(()=>{
    setCurrentUrl(router.pathname)
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/user/pilotDetails`, config)
    .then(res => {
      console.log(res.data)
      setUserName(res.data.userName)
    })
    .catch(err => {
      setUserName(false)
    })
    if(window.location.href.includes("activities")){
      document.getElementById("activities").classList.add("navbaraccountActive")
    }
    else if(window.location.href.includes("account")){
      document.getElementById("account").classList.add("navbaraccountActive")
    }
    
  },[])
  return (
    <div className={NavCss.mainBar}>
      <Container maxWidth={"xxl"}>
        {
          userName &&
          <Link href={`/pilot/${userName}`}>
            <a target = "_blank"><button className={NavCss.upgradeButton} style={{cursor:"pointer"}}>View Profile</button></a>
          </Link>
        }
        <div className={NavCss.navbarTitle}>
        <Link href="/pilot-dashboard/activities">
            <a id="activities"
              className={
                currentUrl.includes("/pilot-dashboard/activities") 
                  ? NavCss.navbaraccountActive
                  : NavCss.navbaraccount
              }
            >
              Activities
            </a>
          </Link>
          <Link href="/pilot-dashboard/account">
            <a id="account"
              className={
                currentUrl.includes("/pilot-dashboard/account") 
                  ? NavCss.navbaraccountActive
                  : NavCss.navbaraccount
              }
            >
              My Account
            </a>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default Nav;
