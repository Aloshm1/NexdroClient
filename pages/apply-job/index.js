import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import job from "../../styles/job.module.css";
import styles from "../../styles/hirePilot.module.css";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Router from "next/router";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import DashCss from "../../styles/companyDashboard.module.css";
import Head from "next/head";
import io from "socket.io-client";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Image from "next/image";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import Ivcss from "../../styles/imageView.module.css";
import { Button, Container } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
const imageLink = process.env.NEXT_PUBLIC_CDN;

var socket, selectedChatCompare;
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const localhost = process.env.NEXT_PUBLIC_LOCALHOST;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: "#00E7FC",
  height: 3,
  padding: "13px 0",
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    border: "1px solid #707070",
    "&:hover": {
      boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
    },
    "& .airbnb-bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },

  "& .MuiSlider-track": {
    height: 0,
  },
  "& .MuiSlider-rail": {
    color: theme.palette.mode === "dark" ? "#bfbfbf" : "#cecece",
    opacity: theme.palette.mode === "dark" ? undefined : 1,
    height: 2,
  },
}));
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const temp_data = {
    keywords: "",
    employeeType: [],
    jobType: [],
    address: "",
  };
  let response = await axios.post(
    `${domain}/api/jobs/filterJobs?page=1`,
    temp_data
  );
  console.log(response.data)
  let data = await fetch(`${domain}/api/seo/getSeo/jobs`);
  let metaData = await data.json();
  try {
    return {
      props: {
        jobs: response.data,
        metaData: metaData,
      },
    };
  } catch {
    return {
      props: {
        jobs: "no data",
      },
    };
  }
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ApplyJob({ jobs, metaData }, props) {
  let [jobAlertEmail, setJobAlertEmail] = useState("");
  let [role, setRole] = useState("");
  let [norole, setnorole] = useState(false);
  let [loginPopup, setLoginPopup] = useState(false);
  let [likedJobs, setLikedJobs] = useState([]);
  let [page, setPage] = useState(2);
  let [nextPage, setNextPage] = useState(false);
  let [applyPopup, setApplyPopup] = useState(false);
  let [applyFailed, setApplyFailed] = useState(false);
  let [message, setMessage] = useState(
    "Hello, I am interested in your role. Can we speak further?"
  );
  let [jobId, setJobId] = useState("");
  let [applied, setApplied] = useState([]);
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [showMoreIndex, setShowMoreIndex] = useState("")

  const [count, setCount] = useState(0);
  const handleScroll = () => {
    setCount(count++);
  };
  const [share, setShare] = React.useState(false);

  useEffect(() => {
    handleScroll1();
  }, [count]);
  const handleScroll1 = () => {
    if (isLoggedIn) {
      try {
        const wrappedElement = document.getElementById("Container");
        if (
          wrappedElement.getBoundingClientRect().bottom <=
          window.innerHeight + 1
        ) {
          if (nextPage) {
            console.log("Loadmore");
            loadMore();
          } else {
            window.removeEventListener("scroll", handleScroll);
          }
        }
      } catch {
        console.log("Error");
      }
    }
  };
  let [myId, setMyId] = useState("");
  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsLoggedIn(true);
    }
    window.addEventListener("scroll", handleScroll);
    console.log(jobs);
    setNextPage(jobs.next);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setRole(res.data.role);
        setMyId(res.data._id);
      });
      axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
        setLikedJobs(res.data);
      });
    }
    if (localStorage.getItem("role") == "pilot") {
      axios
        .get(`${domain}/api/jobApplications/getMyAppliedJobs`, config)
        .then((res) => {
          console.log(res);
          setApplied(res.data);
        });
    }
  }, []);
  let [filterPopup, setFilterPopup] = useState(false);
  let [data, setData] = useState(jobs.results);
  let [tab, setTab] = useState("pilotType");
  let [filter, setFilter] = useState({
    keywords: "",
    places: "",
    salaryRange: [100, 1000],
    salary: false,
    pilotType: [],
    workType: [],
  });
  let [isLoading, setLoading] = useState(false);
  let handlePriceRange = async (e, value) => {
    setFilter({
      ...filter,
      salaryRange: value,
    });
  };
  let changeHandler = (e, field) => {
    var temp_filter = filter;
    temp_filter[field] = e.target.value;
    setFilter({ ...temp_filter });
    filterPage(temp_filter);
  };
  let changeTab = (tab) => {
    setTab(tab);
  };
  let [pilotType, setPilotType] = useState([]);
  let changePilotType = (type) => {
    let temp_filter = filter;
    if (temp_filter.pilotType.includes(type)) {
      temp_filter.pilotType.splice(temp_filter.pilotType.indexOf(type), 1);
    } else {
      temp_filter.pilotType.push(type);
    }
    setFilter({ ...temp_filter });
    filterPage(temp_filter);
  };
  let [workType, setWorkType] = useState([]);
  let workTypeChange = (type) => {
    let temp_filter = filter;
    if (temp_filter.workType.includes(type)) {
      temp_filter.workType.splice(temp_filter.workType.indexOf(type), 1);
    } else {
      temp_filter.workType.push(type);
    }
    setFilter({ ...temp_filter });
    filterPage(temp_filter);
  };
  useEffect(() => {
    console.log(pilotType);
    console.log(workType);
  }, [pilotType, workType]);
  let salaryChange = () => {
    let temp_filter = filter;
    temp_filter.salary = !temp_filter.salary;
    setFilter({ ...temp_filter });
  };
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
    console.log("Reached");
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };

    if (!localStorage.getItem("role")) {
      setLoginPopup(true);
    } else {
      console.log("Request send");
      axios
        .post(`${domain}/api/jobs/likeJob/${id}`, config)
        .then((response) => {
          axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
            setLikedJobs(res.data);
          });
        })
        .catch((err) => {
          console.log("first");
        });
    }
  };
  let filterPage = (filters) => {
    setLoading(true);
    const data = {
      keywords: filters.keywords,
      employeeType: filters.pilotType,
      jobType: filters.workType,
      address: filters.places,
    };
    if (filters.salary) {
      data.price = filters.salaryRange;
    }
    console.log(data);
    console.log(filter);
    axios
      .post(`${domain}/api/jobs/filterJobs?page=1`, data)
      .then((res) => {
        console.log(res);
        setData(res.data.results);
        setLoading(false);
        if (res.data.next) {
          setNextPage(true);
          setPage(res.data.next.page);
        } else {
          setNextPage(false);
        }
      })
      .catch((err) => {
        setNextPage(false);
        setLoading(false);
      });
  };
  let clearFilter = () => {
    let temp_filter = {
      keywords: "",
      places: "",
      salaryRange: [100, 1000],
      salary: false,
      pilotType: [],
      workType: [],
    };
    console.log(filter);
    console.log(temp_filter);
    if (
      filter.keywords != "" ||
      filter.places != "" ||
      filter.salary != false ||
      filter.pilotType.length != 0 ||
      filter.workType.length != 0
    ) {
      setFilter({
        ...temp_filter,
      });
      filterPage(temp_filter);
      setWorkType([]);
      setPilotType([]);
    }
  };
  let loadMore = () => {
    setNextPage(false);
    const temp_data = {
      keywords: filter.keywords,
      employeeType: filter.pilotType,
      jobType: filter.workType,
      address: filter.places,
    };
    if (filter.salary) {
      temp_data.price = filter.salaryRange;
    }
    axios
      .post(`${domain}/api/jobs/filterJobs?page=${page}`, temp_data)
      .then((res) => {
        console.log(res);
        setData([...data, ...res.data.results]);
        setLoading(false);
        if (res.data.next) {
          setNextPage(true);
          setPage(res.data.next.page);
        } else {
          setNextPage(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setNextPage(false);
      });
  };
  const applyNow = (id) => {
    if (!applied.includes(id)) {
      if (!localStorage.getItem("role")) {
        setLoginPopup(true);
      } else if (role === "pilot") {
        setJobId(id);
        setApplyPopup(true);
      } else {
        setnorole(true);
      }
    }
  };
  let sendMail = () => {
    if (message == "") {
      document.getElementById("message_error").innerHTML =
        "Message is required";
      document.getElementById("message_error").style.display = "block";
    } else if (message !== "" && (message.length < 3 || message.length > 100)) {
      document.getElementById("message_error").innerHTML =
        "Message should be between 3-100 words";
      document.getElementById("message_error").style.display = "block";
    } else {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios
        .post(
          `${domain}/api/jobApplications/createApplication`,
          { jobId: jobId, message: message },
          config
        )
        .then((res) => {
          document.getElementById("alert").style.display = "flex";
          setTimeout(() => {
            if (document.getElementById("alert")) {
              document.getElementById("alert").style.display = "none";
            }
          }, 4000);
          socket = io(localhost);

          axios
            .get(`${domain}/api/jobApplications/getMyAppliedJobs`, config)
            .then((res) => {
              console.log(res);
              setApplied(res.data);
            });
          setMessage(
            "Hello, I am interested in your role. Can we speak further?"
          );
          let tempData = {
            data: res.data.data,
            id: myId,
          };
          setTimeout(() => {
            socket.emit("hello", tempData);
            socket.emit("refreshMyChats", myId);
          }, 20);
        })
        .catch((err) => {
          setApplyFailed(true);
        });
      setApplyPopup(false);
    }
  };
  let [txt, setTxt] = useState("template");
  let changeHandler1 = (e) => {
    setTxt(e);
    setTimeout(() => {
      if (e == "custom") {
        document.getElementById("folderName").focus();
      }
    }, 500);
  };
  let emailHandler = (e) => {
    document.getElementById("email_error").style.display = "none";
    setJobAlertEmail(e.target.value);
  };
  let submitSubscribe = (e) => {
    if (e.key == "Enter") {
      submitJobAlert();
    }
  };
  let submitJobAlert = () => {
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    if (jobAlertEmail.trim().length <= 0) {
      document.getElementById("email_error").innerHTML = "Email is Required";
      document.getElementById("email_error").style.display = "block";
    } else if (jobAlertEmail.length > 100 || !validateEmail(jobAlertEmail)) {
      document.getElementById("email_error").innerHTML = "Invalid Email";
      document.getElementById("email_error").style.display = "block";
    } else {
      axios
        .post(`${domain}/api/user/subscribeJobAlerts`, {
          emailId: jobAlertEmail,
        })
        .then((res) => {
          console.log(res);
          if (res.data == "email registered") {
            document.getElementById("email_error").innerHTML =
              "Email Id already subscribed";
            document.getElementById("email_error").style.display = "block";
          } else {
            document.getElementById("email_error").innerHTML =
              "Thanks for Subscribing";
            document.getElementById("email_error").style.display = "block";
          }
          setJobAlertEmail("");
          setTimeout(() => {
            if (document.getElementById("email_error")) {
              document.getElementById("email_error").style.display = "none";
            }
          }, 4000);
        });
    }
  };
  return (
    <div className={styles.applyJobOuterContainer}>
      <Head>
        <title>{metaData.title}</title>
        <meta name="keywords" content={metaData.metaKeywords} />
        <meta name="description" content={metaData.metaDescription} />
        <meta name="title" content={metaData.metaTitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={styles.jobSearchTitleContainer}
        id="applyJobFilters"
      >
        <div className={styles.jobSearchTitle}>
          Apply for Jobs &#38; Get Connect with Recruiters
        </div>
        <div className={styles.jobSearchTitleDesc}>
          Initiate direct chat with recruiters and explore more about
          the job opportunities.{" "}
          <span className = {styles.jobSearchTitleDescSpan}>
            Absolutely Free
          </span>
          .
        </div>
      </div>
      <Container maxWidth = "xxl" sx = {{marginTop: "30px"}}>
        <Alert
          id="alert"
          severity="success"
          style={{
            position: "sticky",
            top: "75px",
            border: "1px solid #e5e5e5",
            zIndex: "1000",
            display: "none",
          }}
        >
          You have applied for the job. Recruiter will text you soon!!
        </Alert>
        <div
          className={job.fBtn}
          id="fbtn"
          onClick={() => setFilterPopup(true)}
        >
          <FilterAltIcon />
          Filter
        </div>
        <Grid container rowSpacing={0} columnSpacing={5}>
          <Grid item xxl={3.5} xl={3.3} lg={3.3} md={3} sm={12} xs={12}>
            <div id="applyJobFilters">
              {typeof window !== "undefined" &&
              localStorage.getItem("role") !== "service_center" ? (
                <div>
                  {/* <div className={job.jobListingleftTitle}>
                    {role === "company"
                      ? "Create Job Alert"
                      : "Show your talent"}
                  </div> */}
                  {/* <div className={job.jobboxLightDesc}>
                    {role === "company"
                      ? "Create a job alert now, Click below button"
                      : "Upload your Aerial shots and get promoted"}
                  </div> */}
                  {role === "company" ? (
                    <button
                      className={styles.jobboxBtn}
                      onClick={() => Router.push("/job/create")}
                      type="button"
                      aria-label="create-job"
                    >
                      Create a job
                    </button>
                  ) : (
                    <div
                      className={styles.jobboxBtn}
                      onClick={() => Router.push("/upload-files")}
                    >
                      Upload Now
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )}
              <div className = {styles.hirePilotFilterContainer}>
                <div>
                  {/* <button
                    className={job.jobBack}
                    onClick={clearFilter}
                    type="button"
                    aria-label="clear"
                  >
                    Clear All
                  </button> */}
                  <label
                    className={styles.hirePilotFilterTitle}
                    htmlFor="keywords"
                  >
                    Keywords
                  </label>
                  <input
                    type="text"
                    className={styles.hirePilotFilterInput}
                    placeholder="Search Keywords"
                    value={filter.keywords}
                    id="keywords"
                    onChange={(e) => changeHandler(e, "keywords")}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <div>
                    <label
                      className={styles.hirePilotFilterTitle}
                      htmlFor="places"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      className={styles.hirePilotFilterInput}
                      placeholder="Search Places..."
                      value={filter.places}
                      id="places"
                      onChange={(e) => changeHandler(e, "places")}
                    />
                  </div>
                  <div style = {{marginBottom: "40px"}}>
                    <div>
                      <div className={styles.hirePilotFilterTitle} style = {{marginBottom: "8px"}}>
                        Pilot Type
                      </div>
                    </div>
                    <div>
                      <div>
                        <input
                          type="checkbox"
                          id="licensed"
                          onChange={() => changePilotType("Licensed Pilot")}
                          checked={filter.pilotType.includes("Licensed Pilot")}
                        />
                        <label className={styles.hirePilotCheckboxLabel} htmlFor="licensed">
                          Licensed Pilot
                        </label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id="unlicensed"
                          onChange={() => changePilotType("Unlicensed Pilot")}
                          checked={filter.pilotType.includes("Unlicensed Pilot")}
                        />
                        <label className={styles.hirePilotCheckboxLabel} htmlFor="unlicensed">
                          Unlicensed Pilot
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div className={styles.hirePilotFilterTitle}>Work</div>
                    </div>
                    <div style = {{marginBottom: "40px"}}>
                      <div>
                        <input
                          type="checkbox"
                          id="fullTime"
                          onChange={() => workTypeChange("Full-time")}
                          checked={filter.workType.includes("Full-time")}
                        />

                        <label className={styles.hirePilotCheckboxLabel} htmlFor="fullTime">
                          Full Time
                        </label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id="partTime"
                          onChange={() => workTypeChange("Part-time")}
                          checked={filter.workType.includes("Part-time")}
                        />
                        <label className={styles.hirePilotCheckboxLabel} htmlFor="partTime">
                          Part Time
                        </label>
                      </div>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="salary"
                        checked={filter.salary}
                        onChange={salaryChange}
                      />
                      <label
                        className={styles.hirePilotFilterTitle}
                        style={{ marginLeft: "13px", fontFamily: "roboto-bold" }}
                        htmlFor="salary"
                      >
                        Salary
                      </label>
                      <div className="filterLabel" style={{ display: "block", fontSize: "14px", color: "#374957", fontFamily: "roboto-bold", marginTop: "15px" }}>
                        ${filter.salaryRange[0]} - $
                        {filter.salaryRange[1]}
                      </div>
                    </div>
                    <Box style={{ marginRight: "7px", marginLeft: "10px" }}>
                      <AirbnbSlider
                        getAriaLabel={(index) =>
                          index === 0 ? "Minimum price" : "Maximum price"
                        }
                        value={filter.salaryRange}
                        onChange={handlePriceRange}
                        min={500}
                        max={20000}
                      />
                    </Box>
                  </div>
                  <button
                    className={job.search}
                    onClick={() => filterPage(filter)}
                    type="button"
                    aria-label="search"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div
                className={job.jobShowTalentContainer}
                style={{ padding: "0px", backgroundColor: "#00e7fc" }}
              >
                <div className={job.jobListingleftTitle}>
                  <Image
                    src="https://i.ytimg.com/vi/Z5nYIk-LSUc/maxresdefault.jpg"
                    layout="fill"
                    height={"100%"}
                    width={"100%"}
                    objectFit="cover"
                    alt="newsletter"
                    className={job.jobListingleftImage}
                    priority
                  />
                </div>
                <div
                  className={job.jobboxLightDesc}
                  style={{ margin: "5px 20px" }}
                >
                  Get alerts on jobs, Stay connect with us.
                </div>

                <div>
                  <input
                    type="text"
                    className={job.subscribeInput}
                    placeholder="Enter your email Id"
                    value={jobAlertEmail}
                    onChange={emailHandler}
                    onKeyUp={submitSubscribe}
                  />
                </div>
                <div
                  className="input_error_msg"
                  id="email_error"
                  style={{ margin: "0px 20px 0px 20px" }}
                >
                  Email ID is required
                </div>
                <button
                  className={job.subscribeBtn}
                  style={{
                    margin: "5px 20px 20px 20px",
                    width: "calc(100% - 40px)",
                  }}
                  onClick={submitJobAlert}
                  type="button"
                  aria-label="subscribe"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </Grid>
          <Grid item xxl={8.5} xl={8.7} lg={8.7} md={9} sm={12} xs={12}>
            <div>
              {/* //job box */}
              {isLoading ? (
                <>
                  <Skeleton
                    count={5}
                    style={{
                      height: "170px",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      border: "1px solid #e8e8e8",
                    }}
                  />
                </>
              ) : (
                <>
                  <div style={{ position: "relative" }} id="Container"  className={job.jobNewOuterContainer}>
                    {data.map((item, i) => {
                      return (
                        <>
                          <div className={job.jobNewContainer}>
                            <div className={job.jobNewImageContainer}>
                              <Link
                                href={
                                  item.companyId
                                    ? `/company/${item.companyId.slug}`
                                    : ""
                                }
                              >
                                <a
                                  aria-label="/"
                                  className={job.companyImageLink}
                                >
                                  <Image
                                    src={`${imageLink}/100x100/${item.companyId.profilePic}`}
                                    layout="fill"
                                    objectFit="cover"
                                    alt="company image"
                                    className={job.companyImage}
                                    priority
                                  />
                                </a>
                              </Link>
                            </div>
                            <div className={job.jobNewMainContainer}>
                              <div className={job.jobNewTitleContainer}>
                                <div className={job.jobNewTitleCompanyName}>
                                  <div className={styles.jobNewTitle}>
                                    <Link href={`/job/${item.slug}`}>
                                      <a aria-label={item.slug}>
                                        {item.jobTitle}
                                      </a>
                                    </Link>
                                  </div>
                                  <div className={styles.jobNewCompanyName}>
                                    <Link
                                      href={
                                        item.companyId
                                          ? `/company/${item.companyId.slug}`
                                          : ""
                                      }
                                    >
                                      <a aria-label={item.slug}>
                                        {item.companyId
                                          ? item.companyId.companyName
                                          : ""}
                                      </a>
                                    </Link>
                                  </div>
                                  <div className={job.jobMoreIcon}>
                                    {/* {role === "pilot" && showMoreIndex !== i ? ( */}
                                      <div>
                                        <MoreVertIcon onClick = {() => setShowMoreIndex(i)} style = {{color: "#999999"}} />
                                      </div>
                                    {/* ) : (
                                      <>
                                        {showMoreIndex === i?
                                        <div>
                                          <ClearRoundedIcon  onClick = {() => setShowMoreIndex("")} />
                                        </div>:""}
                                        <div>
                                          <ShareIcon
                                            onClick={() =>
                                              setShare(`/job/${item.slug}`)
                                            }
                                          />
                                        </div>
                                        {role === "" || role === "pilot" ? (
                                          <div>
                                            {likedJobs.includes(item._id) ? (
                                              <BookmarkIcon
                                                onClick={() => unlike(item._id)}
                                              />
                                            ) : (
                                              <BookmarkBorderIcon
                                                onClick={() => like(item._id)}
                                              />
                                            )}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </>
                                    )} */}
                                  </div>
                                </div>
                              </div>
                              <div className={job.jobNewDetailsBtnContainer}>
                                <div className={job.jobNewDetailsContainer}>
                                  <p className={job.jobNewDetails}>
                                    <LocationOnOutlinedIcon
                                      className={job.jobDetailsIcon}
                                    />{" "}
                                    {item.workLocation
                                      ? item.workLocation.split(",")[0].length >
                                        15
                                        ? item.workLocation
                                            .split(",")[0]
                                            .slice(0, 15) + " ..."
                                        : item.workLocation.split(",")[0]
                                      : ""}
                                  </p>
                                  <p className={job.jobNewDetails}>
                                    <AccountBalanceWalletOutlinedIcon
                                      className={job.jobDetailsIcon}
                                    />{" "}
                                    {item.minSalary
                                      ? `${item.minSalary} - ${item.maxSalary} USD`
                                      : "Not Mentioned"}
                                  </p>
                                  <p className={job.jobNewDetails}>
                                    <WorkOutlineRoundedIcon
                                      className={job.jobDetailsIcon}
                                    />{" "}
                                    {item.experience || "0-1 years"}
                                  </p>
                                  </div>
                                  <div className={job.jobNewDetailsContainer}>
                                  <p className={job.jobNewDetails}>
                                    <EventSeatOutlinedIcon
                                      className={job.jobDetailsIcon}
                                    />{" "}
                                    {item.noOfOpenings} Vacancies
                                  </p>
                                  <p className={job.jobNewDetails}>
                                    <WorkspacePremiumOutlinedIcon
                                      className={job.jobDetailsIcon}
                                    />{" "}
                                    {item.employeeType}
                                  </p>
                                </div>
                                <div className={job.jobNewApplyContainer}>
                                  <p className={job.jobNewPostedDate}>
                                    2days ago
                                  </p>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    className={job.jobNewApplyBtn}
                                    onClick={() => applyNow(item._id)}
                                  >
                                    {applied.includes(item._id)
                                      ? "Applied"
                                      : "Apply Now"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                  {!isLoggedIn && nextPage && (
                    <Alert
                      severity="info"
                      sx={{
                        background:
                          "linear-gradient(183deg, rgb(162 162 162 / 0%) 0%, rgb(241 230 230 / 64%) 60%, #ffd7d7 100%)",
                      }}
                    >
                      <Link href="/register">
                        <a
                          className="link"
                          style={{ color: "rgb(1, 67, 97)" }}
                          aria-label="register"
                        >
                          Sign up
                        </a>
                      </Link>{" "}
                      or{" "}
                      <Link href="/login">
                        <a
                          className="link"
                          style={{ color: "rgb(1, 67, 97)" }}
                          aria-label="login"
                        >
                          Sign in
                        </a>
                      </Link>{" "}
                      to you account to view more jobs that match with your
                      profiles.
                    </Alert>
                  )}
                  {nextPage && !isLoggedIn ? (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#989898",
                        marginBottom: "15px",
                      }}
                    >
                      Loading ...
                    </div>
                  ) : (
                    ""
                  )}
                  {data.length <= 0 && (
                    <div style={{ textAlign: "center", color: "#989898" }}>
                      No jobs based on your search
                    </div>
                  )}
                </>
              )}
            </div>
          </Grid>
        </Grid>
        <Dialog
          open={norole}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setnorole(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setnorole(false)}
            />
            <div className="popupTitle">
              Only Pilots are allowed to apply for jobs, login with pilot
              profile
            </div>
          </div>
        </Dialog>
        <Dialog
          TransitionComponent={Transition}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
          open={applyPopup}
          onClose={() => setApplyPopup(false)}
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setApplyPopup(false)}
            />
            <div className={DashCss.title}>
              Initialize a chat with the recruiter.
            </div>

            <div>
              <div>
                <textarea
                  type="text"
                  className="inputBox"
                  style={{ height: "80px", resize: "none", padding: "10px" }}
                  id="folderName"
                  value={message}
                  onChange={(e) => {
                    document.getElementById("message_error").style.display =
                      "none";
                    setMessage(e.target.value);
                  }}
                />

                <div className="input_error_msg" id="message_error">
                  Message is required
                </div>
              </div>
              <center>
                <button
                  className="popupLoginBtn"
                  onClick={sendMail}
                  type="button"
                  aria-label="start_chat"
                >
                  Start Chatting
                </button>
              </center>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={applyFailed}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setApplyFailed(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setApplyFailed(false)}
            />
            <div className={DashCss.title}>
              Something went wrong. Try after sometimes
            </div>
            <div>
              <div
                className="popupLoginBtn"
                onClick={() => setApplyFailed(false)}
              >
                Close
              </div>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={filterPopup}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setFilterPopup(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer" style={{ minWidth: "260px" }}>
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setFilterPopup(false)}
            />
            <div style={{ marginBottom: "10px" }}>
              <button
                className={job.jobBack}
                onClick={clearFilter}
                type="button"
                aria-label="clear"
              >
                Clear All
              </button>
              <label
                className={styles.hirePilotFilterTitle}
                htmlFor="keywords1"
              >
                Keywords
              </label>
              <input
                type="text"
                className={"filterInput"}
                placeholder="Search Keywords"
                value={filter.keywords}
                id="keywords1"
                onChange={(e) => changeHandler(e, "keywords")}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <div>
                <label
                  className={styles.hirePilotFilterTitle}
                  htmlFor="places1"
                >
                  Location
                </label>
                <input
                  type="text"
                  className={"filterInput"}
                  placeholder="Search Places..."
                  value={filter.places}
                  id="places1"
                  onChange={(e) => changeHandler(e, "place")}
                />
              </div>
              <div>
                <div>
                  <div className={styles.hirePilotFilterTitle}>Pilot Type</div>
                </div>
                <div>
                  <div>
                    <input
                      type="checkbox"
                      id="licensed1"
                      onChange={() => changePilotType("Licensed Pilot")}
                      checked={filter.pilotType.includes("Licensed Pilot")}
                    />
                    <label className="filterLabel" htmlFor="licensed1">
                      Licensed Pilot
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="unlicensed1"
                      onChange={() => changePilotType("Unlicensed Pilot")}
                      checked={filter.pilotType.includes("Unlicensed Pilot")}
                    />
                    <label className="filterLabel" htmlFor="unlicensed1">
                      Unlicensed Pilot
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className={styles.hirePilotFilterTitle}>Work</div>
                </div>
                <div>
                  <div>
                    <input
                      type="checkbox"
                      id="1"
                      onChange={() => workTypeChange("Full-time")}
                      checked={filter.workType.includes("Full-time")}
                    />

                    <label className="filterLabel" htmlFor="fullTime1">
                      Full Time
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="partTime1"
                      onChange={() => workTypeChange("Part-time")}
                      checked={filter.workType.includes("Part-time")}
                    />
                    <label className="filterLabel" htmlFor="partTime1">
                      Part Time
                    </label>
                  </div>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="salary1"
                    checked={filter.salary}
                    onChange={salaryChange}
                  />
                  <label
                    className={"inputLabel"}
                    style={{ marginLeft: "10px", fontFamily: "roboto-bold" }}
                    htmlFor="salary1"
                  >
                    Salary
                  </label>
                  <div className="filterLabel" style={{ display: "block", fontSize: "14px", color: "#374957", fontFamily: "roboto-bold" }}>
                    ${filter.salaryRange[0]} - $
                    {filter.salaryRange[1]}
                  </div>
                </div>
                <Box style={{ marginRight: "7px", marginLeft: "10px" }}>
                  <AirbnbSlider
                    getAriaLabel={(index) =>
                      index === 0 ? "Minimum price" : "Maximum price"
                    }
                    value={filter.salaryRange}
                    onChange={handlePriceRange}
                    min={1}
                    max={4000}
                  />
                </Box>
              </div>
              <div onClick={() => setFilterPopup(false)}>
                <button
                  className={job.search}
                  onClick={() => filterPage(filter)}
                  type="button"
                  aria-label="apply"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={share}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setShare(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="sharePopupContainer">
            <div className="sharePopupTitle">Share with social media</div>
            <div className={Ivcss.shareOptionsContainer}>
              <FacebookShareButton
                url={baseUrl + share}
                className={Ivcss.shareBtn}
              >
                <div className={Ivcss.shareOption}>
                  <FacebookIcon
                    size={35}
                    round={true}
                    style={{ marginRight: "5px" }}
                  />
                </div>
              </FacebookShareButton>
              <LinkedinShareButton
                url={baseUrl + share}
                className={Ivcss.shareBtn}
              >
                <div className={Ivcss.shareOption}>
                  <LinkedinIcon
                    size={35}
                    round={true}
                    style={{ marginRight: "5px" }}
                  />
                </div>
              </LinkedinShareButton>
              <TwitterShareButton
                url={baseUrl + share}
                className={Ivcss.shareBtn}
              >
                <div className={Ivcss.shareOption}>
                  <TwitterIcon
                    size={35}
                    round={true}
                    style={{ marginRight: "5px" }}
                  />
                </div>
              </TwitterShareButton>
              <WhatsappShareButton
                url={baseUrl + share}
                className={Ivcss.shareBtn}
              >
                <div className={Ivcss.shareOption}>
                  <WhatsappIcon
                    size={35}
                    round={true}
                    style={{ marginRight: "5px" }}
                  />
                </div>
              </WhatsappShareButton>
            </div>
          </div>
        </Dialog>
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
                <a aria-label="login">
                  <div className="popupLoginBtn">Login/Signup</div>
                </a>
              </Link>
            </center>
          </div>
        </Dialog>
        {/* {nextPage && <div className="loadingContainer">Loading ...</div>} */}
      </Container>
    </div>
  );
}

export default ApplyJob;
