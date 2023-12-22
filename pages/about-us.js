import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import Image from "next/image";
import css from "../styles/about.module.css";
import img1 from "../images/insp.png";
import headerImg from "../images/Headerdrone.png";
import vision from "../images/vision1.png";
import mission from "../images/mission2.png";
function AboutUs() {
    let [tab, setTab] = useState("ourStory")
  let scrollFunction = (text) => {
    setTab(text)
    var element = document.getElementById(text);
    var headerOffset = 120;
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };
  return (
    <>
      <div style={{position:"relative"}}>
        {/* //image */}
        <div className={css.top}>
          <div className={css.topDiv}>
          <div className={css.images}>
          </div>
            <div className={css.about}>About Nexdro</div>
            <div className={css.mission}>
              Our Mission is to create World&apos;s #1 Drone Pilots Networks
              community, where drone professionals can Build their Portfolios,
              discover Job opportunities and Get Hired.
            </div>
          </div>
        </div>
      </div>
      <div className={css.sNav}>
      <div className={tab == "ourStory" ? css.navTabActive : css.navTab} onClick={() => scrollFunction("ourStory")}>
          Our Story
        </div>
        <div className={tab == "mission" ? css.navTabActive : css.navTab} onClick={() => scrollFunction("mission")}>
          Mission/Vision
        </div>
        {/* <div className={css.navTab}>Our Team</div>
        <div className={css.navTab}>Mentors</div> */}
      </div>
      <Container className={Container} maxWidth = "xxl">
        <div style={{ margin: "30px 0px" }}>
          <Grid container columnSpacing={2} id="ourStory">
            <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
              <div className={css.kutti}>#Kutti Story</div>
              <div className={css.text}>
                &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;While everyone was
                sitting at home during COVID-Pandemic situation, few people had
                enrolled themselves as volunteers and given their helping hands
                to the government to bring back our nation,{" "}
                <span className={css.bold}>Habeeb</span> was also the one.
                Simultaneously he had not forgotten to notice that the drone
                activities have increased in terms of monitoring the peoples
                roaming in prohibited areas and its saving{" "}
                <span className={css.bold}>#time</span> and{" "}
                <span className={css.bold}>#Human</span> efforts. At the same
                time drone related operations were in demand in the market, and
                we were getting lags to find the drone pilots. He tried to find
                the drone pilots networks over the internet but no luck. Then he
                came to know there is no Networking platform in India to connect
                the drone Pilots/Professionals, Yes there he got struck but{" "}
                <span className={css.bold}>he never stopped</span> his journey.
                He continued with his research about Drone sectors and found the
                future scope of Drone Pilots on Global Markets. At the end of
                the research he came to know there will be a huge vacuum in
                drone sectors to find the right Drone Professionals to execute
                drone related operations. As a techie he desired to overcome
                this issue. Yes, from there{" "}
                <span className={css.bold}>he begins his journey…</span>
              </div>
              <div className={css.text}>
                &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;After 2.5 years of efforts
                he and his team finally came up with{" "}
                <span className={css.bold}>
                  World’s #1 Drone Pilots Network Platform
                </span>
                . Which will help Drone Pilots to explore Job Opportunities.
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                <Image src={img1} />
              </div>
            </Grid>
          </Grid>
          <div style={{ marginTop: "50px" }} id="mission" className={css.misvis}>
            <Grid container spacing={0}>
             
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <div className={css.visionBox}>
                  {/* <div className={css.vision}>Our Mission</div> */}
                  <div
                    style={{
                      height: "130px",
                      width: "200px",
                      objectFit: "cover",
                      marginTop: "20px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <Image src={mission} />
                  </div>
                  <div className={css.missionText}>
                    &quot;Our Mission is to create World&apos;s #1 Drone Pilots Networks
                    community, where drone professionals can Build their
                    Portfolios, discover Job opportunities and Get Hired&quot;
                  </div>
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <div className={css.visionBox}>
                  {/* <div className={css.vision}>Our Vision</div> */}
                  <div
                    style={{
                      height: "130px",
                      width: "200px",
                      objectFit: "cover",
                      marginTop: "20px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <Image src={vision} />
                  </div>
                  <div className={css.missionText}>
                  &quot;To Be a Career partner for drone pilots and help them to choose the right career path by the way we aimed to fill the vacuum in the drone industry.&quot;
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </Container>
    </>
  );
}

export default AboutUs;
