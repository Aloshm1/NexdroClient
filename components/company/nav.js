import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import global from "../../styles/all.module.css";
import NavCss from "./Nav.module.css";
import axios from "axios";
import { Container } from "@mui/material";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;

function Nav() {
  const router = useRouter();
  let [currentUrl, setCurrentUrl] = useState("")
  useEffect(() => {
    setCurrentUrl(router.pathname)
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (window.location.href.includes("activities")) {
      document
        .getElementById("activities")
        .classList.add("navbaraccountActive");
    } else if (window.location.href.includes("account")) {
      document.getElementById("account").classList.add("navbaraccountActive");
    }
  }, []);
  return (
    <div className={NavCss.mainBar}>
      <Container maxWidth={"xxl"}>
        <div className={NavCss.navbarTitle}>
          <Link href="/company-dashboard/activities">
            <a
              id="activities"
              className={
                typeof window !== "undefined" &&
                currentUrl.includes("/company-dashboard/activities")
                  ? NavCss.navbaraccountActive
                  : NavCss.navbaraccount
              }
            >
              Activities
            </a>
          </Link>
          <Link href="/company-dashboard/account">
            <a
              id="account"
              className={
                typeof window !== "undefined" &&
                currentUrl.includes("/company-dashboard/account")
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
