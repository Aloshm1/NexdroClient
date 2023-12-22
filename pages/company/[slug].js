import Head from "next/head";
import { Alert, Grid } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import BusinessIcon from "@mui/icons-material/Business";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import HistoryIcon from "@mui/icons-material/History";
import BadgeIcon from "@mui/icons-material/Badge";
import LanguageIcon from "@mui/icons-material/Language";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import css from "../../styles/company.module.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  const company = await fetch(`${domain}/api/company/getCompanyData/${slug}`);
  const data = await company.json();
  return {
    props: {
      data: data,
      slug,
    },
  };
}
function Company({ data, slug }) {
  let [loginPopup, setLoginPopup] = useState(false);
  let [noPilot, setNoPilot] = useState(false);
  let [jobs, setJobs] = useState([]);
  let [likesJobs, setLikedJobs] = useState([]);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };

    axios.get(`${domain}/api/jobs/getCompanyJobs/${slug}`).then((res) => {
      console.log(res);
      setJobs(res.data);
    });
    if (localStorage.getItem("role") == "pilot") {
      axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
        setLikedJobs(res.data);
      });
    }
    console.log(data);
  }, []);
  let unlike = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/jobs/unlikeJob/${id}`, config)

      .then((response) => {
        axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
          setLikedJobs(res.data);
        });
      });
  };
  let like = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (!localStorage.getItem("access_token")) {
      //popup
      setLoginPopup(true);
    } else if (localStorage.getItem("role") !== "pilot") {
      //popup
      setNoPilot(true);
    } else {
      axios
        .post(`${domain}/api/jobs/likeJob/${id}`, config)

        .then((response) => {
          axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
            setLikedJobs(res.data);
          });
        });
    }
  };
  return (
    <div>
      {data.companyName && (
        <Head>
          <title>{`Company ${data.companyName}`}</title>
          <meta property="og:image" content={`${imageLink}/200x200/${data.profilePic}`} />
        </Head>
      )}

      <Container  maxWidth="xxl">
        <div style={{ padding: "30px 0px" }}>
          <Grid container spacing={2}>
            <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
              <div
                style={{ position: "relative", borderRadius: "10px" }}
                className={css.leftDiv}
              >
                <img
                  src={`${imageLink}/${data.coverPic}`}
                  className={css.coverPic}
                  alt={data.coverPic}
                />
                {/* <BookmarkAddOutlinedIcon className={css.bookmark} /> */}
                <div className={css.profilePicNameContainer}>
                  <div className={css.profilePic}>
                    <img
                      src={`${imageLink}/${data.profilePic}`}
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "50%",
                      }}
                      alt={data.profilePic}
                    />
                  </div>
                  <div className={css.nameDiv}>
                    <div className={css.companyName}>{data.companyName}</div>
                    {data.tagline && (
                      <div className={css.industry}>{data.tagline}</div>
                    )}

                    <div className={css.country}>
                      {data.location && data.location}
                      {data.location && ","} &nbsp;{data.country}
                    </div>
                  </div>
                </div>
              </div>

              <div className={css.contentDiv}>
                {data.summary && (
                  <>
                    <div className={css.add}>Summary</div>
                    <div className={css.desc}>{data.summary}</div>
                  </>
                )}
                <></>

                <>
                  <div className={css.add}>Active Jobs</div>
                  {jobs.length == 0 && (
                    <Alert severity="info" sx={{ marginBottom: "20px" }}>
                      No Active Jobs Yet
                    </Alert>
                  )}
                  <Grid container spacing={2}>
                    {jobs.map((item, i) => {
                      return (
                        <Grid item xl={4} lg={4} md={4} sm={6} xs={12} key={i}>
                          <div className={css.jobDiv}>
                            {likesJobs.includes(item._id) ? (
                              <BookmarkIcon
                                onClick={() => unlike(item._id)}
                                sx={{ float: "right", cursor: "pointer" }}
                              />
                            ) : (
                              <BookmarkBorderOutlinedIcon
                                onClick={() => like(item._id)}
                                sx={{ float: "right", cursor: "pointer" }}
                              />
                            )}
                            <div className={css.jobPic}>
                              <img
                                src={`${imageLink}/${item.companyId.profilePic}`}
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  borderRadius: "50%",
                                }}
                                alt={item.companyId.profilePic}
                              />
                            </div>

                            <Link href={`/job/${item.slug}`}>
                              <div className={css.jobTitle}>
                                {item.jobTitle}
                              </div>
                            </Link>
                            <div className={css.jobCompany}>
                              {item.companyId.companyName}
                            </div>
                            <div className={css.jobLocation}>
                              {item.workLocation
                                ? item.workLocation.split(",")[0].length > 15
                                  ? item.workLocation
                                      .split(",")[0]
                                      .slice(0, 15) + " ..."
                                  : item.workLocation.split(",")[0]
                                : ""}
                            </div>
                            <Link href={`/job/${item.slug}`}>
                              <div className={css.viewJob}>View Job</div>
                            </Link>
                          </div>
                        </Grid>
                      );
                    })}
                  </Grid>
                </>
              </div>
            </Grid>
            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={12}
              xs={12}
              sx={{ position: "relative" }}
            >
              <div
                className={css.rightDiv}
                style={{ position: "sticky", top: "80px" }}
              >
                <div className={css.add}>Additional Details</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <BusinessIcon />
                  </div>
                  <div style={{ marginLeft: "15px" }}>
                    <div className={css.rightHead}>Organization Type</div>
                    <div className={css.rightDesc}>
                      {data.companyType == "company" ? "Company" : "Consultant"}
                    </div>
                  </div>
                </div>
                {data.website && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <LanguageIcon />
                    </div>
                    <div style={{ marginLeft: "15px" }}>
                      <div className={css.rightHead}>Website</div>
                      <div className={css.rightDesc}>{data.website}</div>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <WarehouseIcon />
                  </div>
                  <div style={{ marginLeft: "15px" }}>
                    <div className={css.rightHead}>Industry</div>
                    <div className={css.rightDesc}>{data.industry}</div>
                  </div>
                </div>
                {data.foundingYear && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <HistoryIcon />
                    </div>
                    <div style={{ marginLeft: "15px" }}>
                      <div className={css.rightHead}>Established Year</div>
                      <div className={css.rightDesc}>{data.foundingYear}</div>
                    </div>
                  </div>
                )}
                {data.companySize && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <BadgeIcon />
                    </div>
                    <div style={{ marginLeft: "15px" }}>
                      <div className={css.rightHead}>Company Size</div>
                      <div className={css.rightDesc}>{data.companySize}</div>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <CalendarTodayOutlinedIcon />
                  </div>
                  <div style={{ marginLeft: "15px" }}>
                    <div className={css.rightHead}>Nexdro Member since</div>
                    <div className={css.rightDesc}>
                      {data.createdAt
                        ? data.createdAt.slice(0, 10)
                        : data.updatedAt.slice(0, 10)}
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
      <Dialog
        open={loginPopup}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setLoginPopup(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setLoginPopup(false)}
          />
          <div className="popupTitle">
            You aren&#39;t logged into Nexdro. Please login to continue?
          </div>
          <center>
            <Link href="/login">
              <div className="popupLoginBtn">Login/Signup</div>
            </Link>
          </center>
        </div>
      </Dialog>
      <Dialog
        open={noPilot}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setNoPilot(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setNoPilot(false)}
          />
          <div className="popupTitle">
            Only Pilots are allowed to save jobs at the moment. Please login
            with a pilot account.
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Company;
