import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import pilot from "../../styles/pilotLanding.module.css";
import GroupIcon from "@mui/icons-material/Group";
import HailIcon from "@mui/icons-material/Hail";

function Index() {
  let [tab, setTab] = useState("about");
  let [followingTab, setFollowingTab] = useState("following");
  return (
    <div
      style={{
        backgroundColor: "rgb(248, 248, 251)",
        paddingTop: "40px",
        paddingBottom: "20px",
        border: "1px solid rgb(238, 238, 238)",
      }}
    >
      <Container className={Container}>
        <Grid container spacing={2}>
          {/* //left side code */}
          <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
            <div style={{ backgroundColor: "#fff", borderRadius: "10px" }}>
              <div style={{ position: "relative" }}>
                <img
                  src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/2f3eb4b5e8645a3bc5211d31192c90ad65981ad2b7fa68793f91decbc9ccae73%2B12345`}
                  className={pilot.coverImg}
                  data-src=""
                  loading="lazy"
                />
                <img
                  src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/b8e20ef24e3e9d0bdd8c11a3e5f661553074b55f7340dd5268a7c2d08fd6a50e89492`}
                  className={pilot.profilePic}
                  data-src=""
                  loading="lazy"
                />
              </div>
              <div style={{ padding: "20px", marginTop: "10px" }}>
                <div className={pilot.pilotName}>Yaseen Ahmed</div>
                <div className={pilot.pilotType}>
                  Unlicensed Pilot | Bangalore, India
                </div>
                <div style={{ paddingBottom: "10px" }}>
                  <div className={pilot.hireBtn}>
                    {" "}
                    <HailIcon />
                    Hire Pilot
                  </div>
                  <div className={pilot.followBtn}>
                    {" "}
                    <GroupIcon />
                    Follow Pilot
                  </div>
                </div>
              </div>
              <div style={{ cursor: "pointer" }}>
                <Grid container spacing={0}>
                  <Grid
                    item
                    xl={2.4}
                    lg={2.4}
                    md={2.4}
                    sm={2.4}
                    xs={2.4}
                    onClick={() => setTab("all")}
                  >
                    <div className={tab == "all" ? pilot.tabActive : pilot.tab}>
                      All
                    </div>
                  </Grid>
                  <Grid
                    item
                    xl={2.4}
                    lg={2.4}
                    md={2.4}
                    sm={2.4}
                    xs={2.4}
                    onClick={() => setTab("images")}
                  >
                    <div
                      className={tab == "images" ? pilot.tabActive : pilot.tab}
                    >
                      Images
                    </div>
                  </Grid>
                  <Grid
                    item
                    xl={2.4}
                    lg={2.4}
                    md={2.4}
                    sm={2.4}
                    xs={2.4}
                    onClick={() => setTab("3d")}
                  >
                    <div className={tab == "3d" ? pilot.tabActive : pilot.tab}>
                      3D
                    </div>
                  </Grid>
                  <Grid
                    item
                    xl={2.4}
                    lg={2.4}
                    md={2.4}
                    sm={2.4}
                    xs={2.4}
                    onClick={() => setTab("videos")}
                  >
                    <div
                      className={tab == "videos" ? pilot.tabActive : pilot.tab}
                    >
                      Videos
                    </div>
                  </Grid>
                  <Grid
                    item
                    xl={2.4}
                    lg={2.4}
                    md={2.4}
                    sm={2.4}
                    xs={2.4}
                    onClick={() => setTab("about")}
                  >
                    <div
                      className={tab == "about" ? pilot.tabActive : pilot.tab}
                    >
                      About
                    </div>
                  </Grid>
                </Grid>
              </div>
              <hr
                style={{
                  margin: "0px 10px",
                  borderTop: "1px solid #dfdfdf",
                  borderBottom: "0px",
                }}
              />
              <div style={{ marginTop: "10px" }}>
                {tab === "all" ? (
                  <>
                    <Grid container spacing={1}>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/b52eb39294f24beebbb89037b89437a956bec79553ed862d8f9943c0feb27784hgvue55a0143480ba2615b59244d3c4d160b61127fb19534868ce0d44e14a8f604cc2.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/pexels-studio-art-smile-347686099605c27b61730886cb206d5dff4824dcbcce96faa51f30a73b7eae6a92d1e25b4601e1bc808e7ed01160a4dd9bd6578469c4cb385cf020d3c4550e71dcefa99.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/JasonHawkes-369557fdc6dd2fa59751a22cdbf41795ecfc2b44f6d68ab1815bd6a10d6221879e18.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/b52eb39294f24beebbb89037b89437a956bec79553ed862d8f9943c0feb27784hgvue55a0143480ba2615b59244d3c4d160b61127fb19534868ce0d44e14a8f604cc2.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/JasonHawkes-369557fdc6dd2fa59751a22cdbf41795ecfc2b44f6d68ab1815bd6a10d6221879e18.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {tab === "images" ? (
                  <>
                    <Grid container spacing={1}>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/JasonHawkes-369557fdc6dd2fa59751a22cdbf41795ecfc2b44f6d68ab1815bd6a10d6221879e18.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/b52eb39294f24beebbb89037b89437a956bec79553ed862d8f9943c0feb27784hgvue55a0143480ba2615b59244d3c4d160b61127fb19534868ce0d44e14a8f604cc2.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/JasonHawkes-369557fdc6dd2fa59751a22cdbf41795ecfc2b44f6d68ab1815bd6a10d6221879e18.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {tab === "3d" ? (
                  <>
                    <Grid container spacing={1}>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/b52eb39294f24beebbb89037b89437a956bec79553ed862d8f9943c0feb27784hgvue55a0143480ba2615b59244d3c4d160b61127fb19534868ce0d44e14a8f604cc2.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/pexels-studio-art-smile-347686099605c27b61730886cb206d5dff4824dcbcce96faa51f30a73b7eae6a92d1e25b4601e1bc808e7ed01160a4dd9bd6578469c4cb385cf020d3c4550e71dcefa99.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/JasonHawkes-369557fdc6dd2fa59751a22cdbf41795ecfc2b44f6d68ab1815bd6a10d6221879e18.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {tab === "videos" ? (
                  <>
                    <Grid container spacing={1}>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/pexels-studio-art-smile-347686099605c27b61730886cb206d5dff4824dcbcce96faa51f30a73b7eae6a92d1e25b4601e1bc808e7ed01160a4dd9bd6578469c4cb385cf020d3c4550e71dcefa99.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/JasonHawkes-369557fdc6dd2fa59751a22cdbf41795ecfc2b44f6d68ab1815bd6a10d6221879e18.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/b52eb39294f24beebbb89037b89437a956bec79553ed862d8f9943c0feb27784hgvue55a0143480ba2615b59244d3c4d160b61127fb19534868ce0d44e14a8f604cc2.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                        <img
                          src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/JasonHawkes-369557fdc6dd2fa59751a22cdbf41795ecfc2b44f6d68ab1815bd6a10d6221879e18.jpg`}
                          className={pilot.img}
                          data-src=""
                          loading="lazy"
                        />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {tab === "about" ? (
                  <>
                    <div style={{ padding: "20px" }}>
                      <Grid container spacing={2}>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <div className={pilot.pilotTitle}>
                            Name:{" "}
                            <span className={pilot.pilotData}>
                              Yaseen Ahmed
                            </span>
                          </div>
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <div className={pilot.pilotTitle}>
                            Pilot Type:
                            <span className={pilot.pilotData}>
                              Licensed Pilot
                            </span>
                          </div>
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <div className={pilot.pilotTitle}>
                            Birth Date:
                            <span className={pilot.pilotData}>04-12-1999</span>
                          </div>
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <div className={pilot.pilotTitle}>
                            Sexuality:
                            <span className={pilot.pilotData}>Male</span>
                          </div>
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <div className={pilot.pilotTitle}>
                            Work Type:
                            <span className={pilot.pilotData}>Full Time</span>
                          </div>
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <div className={pilot.pilotTitle}>
                            Monthly Payment:
                            <span className={pilot.pilotData}>124$</span>
                          </div>
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <div className={pilot.pilotTitle}>
                            Completed Year:
                            <span className={pilot.pilotData}>2021</span>
                          </div>
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <div className={pilot.pilotTitle}>
                            Center Year:
                            <span className={pilot.pilotData}>Nexevo Tech</span>
                          </div>
                        </Grid>
                      </Grid>
                      <hr style={{ borderBottom: "1px solid #f9f9f9" }} />
                      <div className={pilot.pilotTitle}>Skills:</div>
                      <div style={{ margin: "10px 0px" }}>
                        <div className={pilot.skillBadge}>marriage</div>
                        <div className={pilot.skillBadge}>Arial view</div>
                        <div className={pilot.skillBadge}>Noise</div>
                        <div className={pilot.skillBadge}>marriage</div>
                        <div className={pilot.skillBadge}>Water</div>
                      </div>
                      <hr style={{ borderBottom: "1px solid #f9f9f9" }} />
                      <div className={pilot.pilotTitle}>Drones:</div>
                      <div style={{ margin: "10px 0px" }}>
                        <div className={pilot.skillBadge}>DJI Mavic</div>
                        <div className={pilot.skillBadge}>Inspire 1</div>

                        <div className={pilot.skillBadge}>Inspire 2</div>
                      </div>
                      <hr style={{ borderBottom: "1px solid #f9f9f9" }} />
                      <div className={pilot.pilotTitle}>Industry:</div>
                      <div style={{ margin: "10px 0px" }}>
                        <div className={pilot.skillBadge}>Construction</div>
                        <div className={pilot.skillBadge}>Eduavtion</div>
                        <div className={pilot.skillBadge}>Money</div>

                        <div className={pilot.skillBadge}>Govt: work</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Grid>
          {/* //right */}
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <div className={pilot.rightCont}>
              <div className={pilot.recentActivity}>Recent Activity</div>
              <div className={pilot.noRecentActivity}>No recent activity</div>
            </div>
            <div className={pilot.rightCont1}>
              <div>
                <Grid container spacing={0} style={{ borderRadius: "10px" }}>
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={6}
                    className={pilot.followingTab}
                    onClick={() => setFollowingTab("following")}
                    style={{
                      backgroundColor:
                        followingTab == "following" ? "#ffffff" : "",
                      border: followingTab == "following" ? "none" : "",
                      borderRadius: followingTab == "following" ? "15px" : "",
                    }}
                  >
                    Following (100)
                  </Grid>
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={6}
                    className={pilot.followingTab}
                    onClick={() => setFollowingTab("followers")}
                    style={{
                      backgroundColor:
                        followingTab == "followers" ? "#ffffff" : "",
                      border: followingTab == "followers" ? "none" : "",
                    }}
                  >
                    Followers (50)
                  </Grid>
                </Grid>
                <>
                  <div
                    style={{
                      padding: "5px 20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div>
                        <img
                          src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/b8e20ef24e3e9d0bdd8c11a3e5f661553074b55f7340dd5268a7c2d08fd6a50e89492`}
                          className={pilot.followingPic}
                          data-src=""
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div>
                      <div className={pilot.followingName}>Yaseen Ahmed</div>{" "}
                      <div className={pilot.follow}>Follow</div>
                    </div>
                    <hr style={{ borderBottom: "1px solid #e5e5e5" }} />
                  </div>
                </>

                <>
                  <div
                    style={{
                      padding: "5px 20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div>
                        <img
                          src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/b8e20ef24e3e9d0bdd8c11a3e5f661553074b55f7340dd5268a7c2d08fd6a50e89492`}
                          className={pilot.followingPic}
                          data-src=""
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div>
                      <div className={pilot.followingName}>Yaseen Ahmed</div>{" "}
                      <div className={pilot.follow}>Follow</div>
                    </div>
                    <hr />
                  </div>
                </>
                <>
                  <div
                    style={{
                      padding: "5px 20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div>
                        <img
                          src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/b8e20ef24e3e9d0bdd8c11a3e5f661553074b55f7340dd5268a7c2d08fd6a50e89492`}
                          className={pilot.followingPic}
                          data-src=""
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div>
                      <div className={pilot.followingName}>Yaseen Ahmed</div>{" "}
                      <div className={pilot.follow}>Follow</div>
                    </div>
                    <hr />
                  </div>
                </>
                <>
                  <div
                    style={{
                      padding: "5px 20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div>
                        <img
                          src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/b8e20ef24e3e9d0bdd8c11a3e5f661553074b55f7340dd5268a7c2d08fd6a50e89492`}
                          className={pilot.followingPic}
                          data-src=""
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div>
                      <div className={pilot.followingName}>Yaseen Ahmed</div>{" "}
                      <div className={pilot.follow}>Follow</div>
                    </div>
                    <hr />
                  </div>
                </>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Index;
