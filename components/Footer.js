import { Container, Grid } from "@mui/material";
import axios from "axios";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import footer from "../styles/footer.module.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Box } from "@mui/material";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;

function Footer() {
  let [categories, setCategories] = useState([]);
  let [tags, setTags] = useState([]);
  useEffect(() => {
    axios.get(`${domain}/api/category/getCategories`).then((res) => {
      setCategories(res.data);
    });
    axios.get(`${domain}/api/tag/getTags`).then((res) => {
      setTags(res.data);
    });
  }, []);
  return (
    <div className={"footer"}>
      <Container maxWidth="xxl">
        <Grid container spacing={3}>
          <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
            <Box
              className={footer.leftBar}
              sx={{ borderRight: { xs: "0px", sm: "1px solid gray" } }}
            >
              <div className={footer.companyName}>Nexdro Technologies</div>
              <div className={footer.text}>
                Nexdro Technologies Private Limited - Its registered office is
                in Bangalore, Karnataka, india.
              </div>
              <div className={footer.mediaLinks}>
                <Link href="https://www.facebook.com/Nexdro.official">
                  <a target="_blank" aria-label="facebook">
                    <FacebookIcon sx={{ mr: "10px" }} titleAccess = "facebook" />
                  </a>
                </Link>
                <Link href="https://twitter.com/Nexdro_official">
                  <a target="_blank" aria-label="twitter">
                    <TwitterIcon sx={{ mr: "10px" }} titleAccess = "twitter"/>
                  </a>
                </Link>
                <Link href="https://www.instagram.com/nexdro.official">
                  <a target="_blank" aria-label="instagram">
                    <InstagramIcon sx={{ mr: "10px" }} titleAccess = "instagram" />
                  </a>
                </Link>
                <Link href="https://www.linkedin.com/company/nexdro">
                  <a target="_blank" aria-label="linkedin">
                    <LinkedInIcon sx={{ mr: "10px" }} titleAccess = "linkedin" />
                  </a>
                </Link>
              </div>
              <div style={{ fontFamily: "roboto-regular", marginTop: "15px" }}>
                <span style={{ fontFamily: "roboto-bold" }}>
                  For General Enquiries
                </span>
                :{" "}
                <a href="mailto:support@nexdro.com" className={footer.tag} aria-label="support">
                  support@nexdro.com
                </a>
              </div>
              <div style={{ fontFamily: "roboto-regular", marginTop: "15px" }}>
                <span style={{ fontFamily: "roboto-bold" }}>For Complaints</span>:{" "}
                <a href="mailto:complaints@nexdro.com" className={footer.tag} aria-label="complaint">
                  complaints@nexdro.com
                </a>
              </div>
            </Box>
          </Grid>

          <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
            {/* //left */}
            <Box
              className={footer.leftBar}
              sx={{ borderRight: { xs: "0px", md: "1px solid gray" } }}
            >
              <div className={footer.heading}>Useful Links</div>
              <ul className = {footer.footer_ul}>
                <li>
                  <Link href="/about-us">
                    <a className={footer.tag} aria-label="about">About Us</a>
                  </Link>
                </li>
                <li>
                  <Link href="/help-center">
                    <a className={footer.tag} aria-label="help">Help Center</a>
                  </Link>
                </li>
                <li>
                  <Link href="/complaints">
                    <a className={footer.tag} aria-label="complaints_page">Complaints</a>
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions">
                    <a className={footer.tag} aria-label="terms_conditions">Terms and Conditions</a>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy">
                    <a className={footer.tag} aria-label="privacy_policy">Privacy Policy</a>
                  </Link>
                </li>
              </ul>
              {/* <Link href="/shoot-of-the-week">
                <div className={footer.tag}>Shoot of the week</div>
              </Link> */}
            </Box>
          </Grid>
          <Grid item xl={3} lg={3} md={3} sm={6}>
            {/* //left */}
            <Box
              className={footer.leftBar}
              sx={{ borderRight: { xs: "0px", sm: "1px solid gray" } }}
            >
              <div className={footer.heading}>Accounts</div>
              {/* <Link href="/company-pro">
                <div className={footer.tag}>Company Pro</div>
              </Link>
              <Link href="/pilot-pro">
                <div className={footer.tag}>Pilot Pro</div>
              </Link> */}
              <ul className = {footer.footer_ul}>
                <li>
                  <Link href="/drone-pilot">
                    <a className={footer.tag} aria-label="drone_pilot">Drone Pilots</a>
                  </Link>
                </li>
                <li>
                  <Link href="/company-recruiter">
                    <a className={footer.tag} aria-label="company_page">Company (Recruiter)</a>
                  </Link>
                </li>
                <li>
                  <Link href="/center-page">
                    <a className={footer.tag} aria-label="center_page">Service Center</a>
                  </Link>
                </li>
              </ul>
            </Box>
          </Grid>
          <Grid item xl={3} lg={3} md={3} sm={6}>
            {/* //left */}
            <Box className={footer.leftBar}>
              <div className={footer.heading}>
                Weblogs
              </div>
              <ul className = {footer.footer_ul}>
                <li>
                  <Link href="/blogs">
                    <a className={footer.tag} aria-label="blog">Blogs</a>
                  </Link>
                </li>
                <li>
                  <Link href="/events">
                    <a className={footer.tag} aria-label="events">Events</a>
                  </Link>
                </li>
              </ul>
            </Box>
          </Grid>
        </Grid>
        <div className={footer.copyrightContainer}>
          <div className={footer.copyRight}>
            Copyright &#169; 2022: NEXDRO TECHNOLOGIES PVT LTD
          </div>
          {/* <div className={footer.copyRight}>
            Desclaimer: Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Maxime mollitia, molestiae quas vel sint commodi repudiandae
          </div> */}
        </div>
      </Container>
    </div>
  );
}

export default Footer;
