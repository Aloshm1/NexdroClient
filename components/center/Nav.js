import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import global from "../../styles/all.module.css";
import NavCss from "./Nav.module.css";
import axios from "axios"
import { Container } from "@mui/material";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;

function Nav() {
  let [currentUrl, setCurrentUrl] = useState("")
  const router = useRouter();
  useEffect(()=>{
    setCurrentUrl(router.pathname)
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if(window.location.href.includes("activities")){
      document.getElementById("activities").classList.add("navbaraccountActive")
    }
    else if(window.location.href.includes("account")){
      document.getElementById("account").classList.add("navbaraccountActive")
    }
    
  },[])
  return (
    <div className={NavCss.mainBar}>
      <Container className={`Container`}>
        <div className={NavCss.navbarTitle}>
        <Link href="/center-dashboard/activities">
            <a id="activities"
              className={
                currentUrl.includes("/center-dashboard/activities") 
                  ? NavCss.navbaraccountActive
                  : NavCss.navbaraccount
              }
            >
              Activities
            </a>
          </Link>
          <Link href="/center-dashboard/account">
            <a id="account"
              className={
                currentUrl.includes("/center-dashboard/account") 
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
