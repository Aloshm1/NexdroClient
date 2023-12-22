import Container from "@mui/system/Container";
import React, { useEffect, useState } from "react";
import styles from "../../styles/hirePilot.module.css";
import DashCss from "../../styles/companyDashboard.module.css";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Button from "@mui/material/Button";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import job from "../../styles/job.module.css";
import { styled } from "@mui/material/styles";
import io from "socket.io-client";
import Slider from "@mui/material/Slider";
import Select from "react-select";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Router from "next/router";
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
import Link from "next/link";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import VerifiedIcon from "@mui/icons-material/Verified";
import Head from "next/head";
import Image from "next/image";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
var socket, selectedChatCompare;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    color: state.selectProps.menuColor,
  }),
};
const msg =
  "Hello, your profile and experience matches with the job requirements. Can we schedule a chat to learn more about the position?";
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
  var filterData = {
    keywords: "",
    address: "",
    workType: [],
    employeeType: [],
    drones: [],
  };
  let data;
  await axios
    .post(`${domain}/api/pilot/pilotFilters?page=1`, filterData)
    .then((res) => {
      data = res.data;
    });
  const drone_brands = await fetch(`${domain}/api/brand/getBrands`);
  const drone_brands_data = await drone_brands.json();
  let metaData = await fetch(`${domain}/api/seo/getSeo/pilots`);
  let metaDataObj = await metaData.json();
  if (data) {
    return {
      props: {
        pilots: data,
        drone_brands_data: drone_brands_data,
        metaData: metaDataObj,
      },
    };
  } else {
    return {
      props: {
        data: "noData",
      },
    };
  }
}
function HirePilot({ pilots, drone_brands_data, metaData }) {
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  let [login, setLogin] = useState(false);
  let [filterPopup, setFilterPopup] = useState(false);
  let [noCompany, setNoCompany] = useState(false);
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose1 = () => {
    setOpen1(false);
    setNewFolder({
      folderName: "",
      folderDesc: "",
    });
  };
  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsLoggedIn(true);
    }
    window.addEventListener("scroll", handleScroll);
    var temp_drones = [];
    for (var i = 0; i < drone_brands_data.length; i++) {
      let temp = {};
      temp.label = drone_brands_data[i].brand;
      temp.value = drone_brands_data[i].brand;
      temp_drones.push(temp);
    }
    setDrones(temp_drones);
    setCompany(localStorage.getItem("role") === "company");
    if (pilots.next) {
      setNextPage(true);
      setPage(pilots.next.page);
    } else {
      setNextPage(false);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      console.log("removed");
    };
  }, []);
  let [data1, setData1] = useState([]);
  let [mySavedPilots, setMySavedPilots] = useState([]);
  let [myId, setMyId] = useState("");
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("role")) {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setMyId(res.data._id);
      });
    }

    if (localStorage.getItem("role") === "company") {
      axios.get(`${domain}/api/folder/getMyFolders`, config).then((res) => {
        setData1(res.data);
        if (res.data.length !== 0) {
          setTempFolder(res.data[0]._id);
        }
      });
      axios
        .post(`${domain}/api/savePilot/getMySavedPilots`, config)
        .then((res) => {
          setMySavedPilots(res.data);
        });
      axios
        .get(`${domain}/api/company/getCompanySubscription`, config)
        .then((res) => {
          console.log(res.data);
          setSubscriptionData(res.data);
        });
    }
  }, []);
  let [subscriptionData, setSubscriptionData] = useState({});

  const [count, setCount] = useState(0);
  const handleScroll = () => {
    setCount(count++);
  };

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
          if (next_page) {
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
  let [tempFolder, setTempFolder] = useState("");
  let [data, setData] = useState(pilots.results);
  const [isCompany, setCompany] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    pilotType: [],
    work: [],
    filterSalary: false,
    salaryRange: [100, 4000],
    selectedDrones: [],
    industryInput: "",
    locationInput: "",
  });
  const [drones, setDrones] = useState([
    { value: "Drone1", label: "Drone1" },
    { value: "Drone2", label: "Drone2" },
    { value: "Drone3", label: "Drone3" },
    { value: "Drone4", label: "Drone4" },
    { value: "Drone5", label: "Drone5" },
  ]);
  const [showMoreSkill, setShowMoreSkill] = useState([]);
  const [page, setPage] = useState(2);
  const [next_page, setNextPage] = useState(false);
  const handleChangeDrone = (selectedOption) => {
    var temp_filter = filter;
    temp_filter.selectedDrones = selectedOption;
    setFilter({ ...temp_filter });
    searchFilter(temp_filter);
  };
  const handlePriceRange = (val) => {
    setFilter({
      ...filter,
      salaryRange: [val.target.value[0], val.target.value[1]],
    });
  };
  const typeChange = (field, type) => {
    var temp_filter = filter;
    if (temp_filter[field].includes(type)) {
      temp_filter[field].splice(temp_filter[field].indexOf(type), 1);
    } else {
      temp_filter[field].push(type);
    }
    console.log(temp_filter);
    setFilter({ ...temp_filter });
    searchFilter(temp_filter);
  };
  const salaryCheckboxChange = () => {
    setFilter({ ...filter, filterSalary: !filter.filterSalary });
  };
  const showMoreSkillChange = (index) => {
    var tempShowMoreSkills = showMoreSkill;
    if (tempShowMoreSkills.includes(index)) {
      tempShowMoreSkills.splice(tempShowMoreSkills.indexOf(index), 1);
    } else {
      tempShowMoreSkills.push(index);
    }
    setShowMoreSkill([...tempShowMoreSkills]);
  };
  const searchFilter = (filters) => {
    setLoading(true);
    var data = {
      keywords: filters.industryInput,
      address: filters.locationInput,
      workType: filters.pilotType,
      employeeType: filters.work,
      drones: filters.selectedDrones.map((x) => x.label),
    };
    if (filters.filterSalary) {
      data.price = filters.salaryRange;
    }
    console.log(data);
    axios
      .post(`${domain}/api/pilot/pilotFilters?page=1`, data)
      .then((res) => {
        console.log(res);
        if (res.data.next) {
          setNextPage(true);
          setPage(res.data.next.page);
        } else {
          setNextPage(false);
        }
        setData([...res.data.results]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const searchFilter2 = (filters) => {
    if (
      filter.pilotType.length !== 0 ||
      filter.work.length !== 0 ||
      filter.filterSalary !== false ||
      filter.selectedDrones.length !== 0 ||
      filter.industryInput !== "" ||
      filter.locationInput !== ""
    ) {
      setLoading(true);
      var data = {
        keywords: filters.industryInput,
        address: filters.locationInput,
        workType: filters.pilotType,
        employeeType: filters.work,
        drones: filters.selectedDrones.map((x) => x.label),
      };
      if (filters.filterSalary) {
        data.price = filters.salaryRange;
      }
      console.log(data);
      axios
        .post(`${domain}/api/pilot/pilotFilters?page=1`, data)
        .then((res) => {
          console.log(res);
          if (res.data.next) {
            setNextPage(true);
            setPage(res.data.next.page);
          } else {
            setNextPage(false);
          }
          setData([...res.data.results]);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };
  const changeHandler = (e, field) => {
    setData([]);
    let temp_filter = filter;
    temp_filter[field] = e.target.value;
    setFilter({ ...temp_filter });
    searchFilter(temp_filter);
  };
  const loadMore = () => {
    setNextPage(false);
    window.removeEventListener("scroll", handleScroll);
    console.log(page);
    var filters = filter;
    var filterData = {
      keywords: filters.industryInput,
      address: filters.locationInput,
      workType: filters.pilotType,
      employeeType: filters.work,
      drones: filters.selectedDrones.map((x) => x.label),
    };
    if (filters.filterSalary) {
      filterData.price = filters.salaryRange;
    }
    axios
      .post(`${domain}/api/pilot/pilotFilters?page=${page}`, filterData)
      .then((res) => {
        console.log(res.data);
        setData([...data, ...res.data.results]);
        setLoading(false);
        if (res.data.next) {
          setNextPage(true);
          setPage(page + 1);
          console.log(res.data.next.page);
          console.log(page);
          window.addEventListener("scroll", handleScroll);
        } else {
          setNextPage(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        window.removeEventListener("scroll", handleScroll);
      });
  };
  let [newFolder, setNewFolder] = useState({
    folderName: "",
    folderDesc: "",
  });

  let folderChangeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";

    setNewFolder({
      ...newFolder,
      [e.target.id]: e.target.value,
    });
  };
  let [tempPilot, setTempPilot] = useState("");

  let createNewFolder = () => {
    let focusField = "";
    let fields = ["folderName", "folderDesc"];
    for (let i = 0; i < fields.length; i++) {
      console.log(newFolder[fields[i]]);
      if (newFolder[fields[i]] === "") {
        if (focusField == "") {
          focusField = fields[i];
        }
        document.getElementById(
          `${fields[i]}_error`
        ).innerHTML = `${fields[i]} is required`;
        document.getElementById(`${fields[i]}_error`).style.display = "block";
      }
    }
    if (
      newFolder.folderName !== "" &&
      (newFolder.folderName.length < 3 || newFolder.folderName.length > 100)
    ) {
      document.getElementById("folderName_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("folderName_error").style.display = "block";
      focusField = "folderName";
    }
    if (
      newFolder.folderDesc !== "" &&
      (newFolder.folderDesc.length < 3 || newFolder.folderDesc.length > 100)
    ) {
      document.getElementById("folderDesc_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("folderDesc_error").style.display = "block";
      focusField = "folderDesc";
    }
    if (focusField !== "") {
      document.getElementById(focusField).focus();
    } else {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios
        .post(
          `${domain}/api/folder/createFolder`,
          {
            folderName: newFolder.folderName,
            description: newFolder.folderDesc,
          },
          config
        )
        .then((res) => {
          setNewFolder({
            folderName: "",
            folderDesc: "",
          });
          axios.get(`${domain}/api/folder/getMyFolders`, config).then((res) => {
            setData1(res.data);
            setTempFolder(res.data[0]._id);
          });
        });
      setOpen1(false);
      setOpen(true);
    }
  };
  let unsavePilot = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/savePilot/unsavePilot`, { pilotId: id }, config)
      .then((res) => {
        axios
          .post(`${domain}/api/savePilot/getMySavedPilots`, config)
          .then((res) => {
            setMySavedPilots(res.data);
          });
      });
  };
  let savePilot = () => {
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(
        `${domain}/api/savePilot/savePilot`,
        {
          pilotId: tempPilot,
          folderId: tempFolder,
        },
        config
      )
      .then((res) => {
        axios
          .post(`${domain}/api/savePilot/getMySavedPilots`, config)
          .then((res) => {
            setMySavedPilots(res.data);
          });
      });
    setOpen(false);
  };
  let [subscription, setSubscription] = useState(false);
  let savePilotToFolder = (id) => {
    if (!localStorage.getItem("access_token")) {
      //popup
      setLogin(true);
    } else if (localStorage.getItem("role") !== "company") {
      //popup
      setNoCompany(true);
    } else {
      if (subscriptionData.subscription.bookmarkPilots) {
        setTempPilot(id);
        setOpen(true);
      } else {
        setSubscription(true);
      }
    }
  };

  let hirePilot = (id) => {
    if (!localStorage.getItem("access_token")) {
      //popup
      setLogin(true);
    } else if (localStorage.getItem("role") !== "company") {
      //popup
      setNoCompany(true);
    } else {
      if (
        subscriptionData.subscription &&
        subscriptionData.proposals >= subscriptionData.subscription.directHires
      ) {
        setSubscription(true);
      } else {
        setTempPilot(id);
        setHire(true);
      }
    }
  };
  let sendMail = () => {
    if (message == "") {
      document.getElementById("message_error").innerHTML =
        "Message is required";
      document.getElementById("message_error").style.display = "block";
    } else if (message !== "" && (message.length < 3 || message.length > 250)) {
      document.getElementById("message_error").innerHTML =
        "Message should be between 3-250 words";
      document.getElementById("message_error").style.display = "block";
    } else {
      if (
        subscriptionData.subscription.proposals - subscriptionData.proposals <=
        0
      ) {
        // alert("Limit Exceeded")
        setSubscriptionOver(true);
      } else {
        let config = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        };
        axios
          .post(
            `${domain}/api/hireProposal/createProposal`,
            { pilotId: tempPilot, message: message },
            config
          )
          .then((res) => {
            console.log(res);
            let tempData = {
              data: res.data,
              id: myId,
            };
            socket = io(domain);
            setTimeout(() => {
              socket.emit("hello", tempData);
            }, 20);
            axios
              .get(`${domain}/api/company/getCompanySubscription`, config)
              .then((res) => {
                console.log(res.data);
                setSubscriptionData(res.data);
              });
          });
        document.getElementById("alert").style.display = "flex";
        setHire(false);
        setMessage(msg);
        setTimeout(() => {
          if (document.getElementById("alert")) {
            document.getElementById("alert").style.display = "none";
          }
        }, 4000);
      }
    }
  };
  let [message, setMessage] = useState(msg);
  let [hire, setHire] = useState(false);
  let [subscriptionOver, setSubscriptionOver] = useState(false);

  const clearFilter = () => {
    var temp_filter = {
      pilotType: [],
      work: [],
      filterSalary: false,
      salaryRange: [100, 4000],
      selectedDrones: [],
      industryInput: "",
      locationInput: "",
    };
    if (
      filter.pilotType.length !== 0 ||
      filter.work.length !== 0 ||
      filter.filterSalary !== false ||
      filter.selectedDrones.length !== 0 ||
      filter.industryInput !== "" ||
      filter.locationInput !== ""
    ) {
      console.log(filter);
      setFilter({
        ...temp_filter,
      });
      searchFilter(temp_filter);
    }
  };

  let handleChange1 = (address) => {
    console.log(address);
    setData([]);
    setFilter({
      ...filter,
      locationInput: address,
    });
    let temp_filter = filter;
    temp_filter[address] = address;
    setFilter({ ...temp_filter });
    searchFilter(temp_filter);
  };

  let handleSelect = (address) => {
    console.log(address);

    setData([]);
    setFilter({
      ...filter,
      locationInput: address,
    });
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

      <Container maxWidth="xxl">
        <Alert
          severity="success"
          id="alert"
          style={{
            display: "none",
            position: "sticky",
            top: "70px",
            border: "1px solid green",
            zIndex: "1000",
          }}
        >
          Mail is successfully sent. Pilot will contact You!!!
        </Alert>
        <Grid container rowSpacing={0} columnSpacing={5}>
          <Grid item xxl={3.5} xl={3.3} lg={3.3} md={3} sm={12} xs={12}>
            <div id="hirePilotFilter">
              <Box>
                {typeof window !== "undefined" &&
                localStorage.getItem("role") !== "service_center" ? (
                  <div
                    className={job.jobShowTalentContainer}
                    style={{ marginBottom: "10px" }}
                  >
                    <div className={job.jobListingleftTitle}>
                      {isCompany ? "Create Job Alert" : "Show your talent"}
                    </div>
                    <div className={job.jobboxLightDesc}>
                      {isCompany
                        ? "Create a job alert now, Click below button"
                        : "Upload your Aerial shots and get promoted"}
                    </div>
                    {isCompany ? (
                      <button
                        className={job.jobboxBtn}
                        onClick={() => Router.push("/job/create")}
                        aria-label="create_job"
                      >
                        Create a job
                      </button>
                    ) : (
                      <button
                        className={job.jobboxBtn}
                        onClick={() => Router.push("/upload-files")}
                        aria-label="upload_file"
                      >
                        Upload Now
                      </button>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </Box>
              <Box sx={{ marginBottom: "20px" }}>
                <div className={styles.hirepilotFilterHeaderTitle}>
                  Filters
                  <button
                    className={styles.hirepilotFilterClearLink}
                    onClick={clearFilter}
                    aria-label="clear_filter"
                  >
                    Clear All
                  </button>
                </div>
                <div className={styles.hirepilotFilterInputContainer}>
                  <div className={styles.hirePilotFilterTitle}>Pilot type</div>
                  <label className={styles.hirepilotFilterInputField}>
                    <input
                      className={styles.hirepilotFilterRadio}
                      type="checkbox"
                      name=""
                      id=""
                      onChange={() => typeChange("pilotType", "licensed")}
                      checked={filter.pilotType.includes("licensed")}
                    />
                    <span className={styles.hirepilotFilterInputFieldLabel}>
                      Licensed Pilots
                    </span>
                  </label>
                  <label className={styles.hirepilotFilterInputField}>
                    <input
                      className={styles.hirepilotFilterRadio}
                      type="checkbox"
                      name=""
                      id=""
                      onChange={() => typeChange("pilotType", "unlicensed")}
                      checked={filter.pilotType.includes("unlicensed")}
                    />
                    <span className={styles.hirepilotFilterInputFieldLabel}>
                      Unlicensed Pilots
                    </span>
                  </label>
                </div>
                <div className={styles.hirepilotFilterInputContainer}>
                  <div className={styles.hirePilotFilterTitle}>Work</div>
                  <label className={styles.hirepilotFilterInputField}>
                    <input
                      className={styles.hirepilotFilterRadio}
                      type="checkbox"
                      name=""
                      id=""
                      onChange={() => typeChange("work", "full_time")}
                      checked={filter.work.includes("full_time")}
                    />
                    <span className={styles.hirepilotFilterInputFieldLabel}>
                      Full Time
                    </span>
                  </label>
                  <label className={styles.hirepilotFilterInputField}>
                    <input
                      className={styles.hirepilotFilterRadio}
                      type="checkbox"
                      name=""
                      id=""
                      onChange={() => typeChange("work", "part_time")}
                      checked={filter.work.includes("part_time")}
                    />
                    <span className={styles.hirepilotFilterInputFieldLabel}>
                      Part Time
                    </span>
                  </label>
                </div>
                {/* <div className={styles.hirepilotFilterInputContainer}>
                    <div className={styles.hirePilotFilterTitle}>
                      Salary Range
                    </div>
                    <label className={styles.hirepilotFilterInputField}>
                      <input
                        className={styles.hirepilotFilterRadio}
                        type="checkbox"
                        name=""
                        id=""
                        onChange={salaryCheckboxChange}
                        checked={filter.filterSalary}
                      />
                      <span className={styles.hirepilotFilterInputFieldLabel}>
                        Filter salary
                      </span>
                    </label>
                    <div className={styles.hirepilotFilterInputField}>
                      <div className={styles.hirepilotFilterInputFieldLabel}>
                        Price Range ${filter.salaryRange[0]} - $
                        {filter.salaryRange[1]}
                      </div>
                    </div>
                    <div className={styles.hirepilotFilterInputField}>
                      <Box style={{ marginRight: "7px", marginLeft: "10px" }}>
                        <AirbnbSlider
                          getAriaLabel={(index) =>
                            index === 0 ? "Minimum price" : "Maximum price"
                          }
                          value={filter.salaryRange}
                          onChange={handlePriceRange}
                          min={1}
                          max={10000}
                        />
                      </Box>
                    </div>
                  </div> */}
                <div
                  className={styles.hirepilotFilterInputContainer}
                  style={{ marginBottom: "20px" }}
                >
                  <div className={styles.hirePilotFilterTitle}>
                    Type of Drones that Pilot has
                  </div>
                  <div className={styles.hirepilotFilterInputField}>
                    <div className={styles.hirepilotFilterInputFieldLabel}>
                      <Select
                        value={filter.selectedDrones}
                        onChange={handleChangeDrone}
                        options={drones}
                        styles={customStyles}
                        isMulti
                        id="industry1"
                        aria-labelledby="select"
                        aria-label="select"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  className={`filterBtn`}
                  onClick={() => searchFilter2(filter)}
                >
                  Search
                </Button>
              </Box>
            </div>
          </Grid>
          <Grid item xxl={8.5} xl={8.7} lg={8.7} md={9} sm={12} xs={12}>
            <div
              className={job.fBtn2}
              id="fbtn"
              onClick={() => setFilterPopup(true)}
            >
              <FilterAltIcon />
              Filter
            </div>
            <div className={styles.hirepilotRightContainer}>
              <div className={styles.hirepilotRightTitleContainer}>
                <h2 style={{ marginBottom: "7px" }}>
                  Hire Drone Pilots Globally
                </h2>
                <div className={styles.hirepilotRightSubTitle}>
                  Share your hire proposal with Drone experts, Get connected
                  with them.
                </div>
              </div>
              <div id="hirePilotFilter">
                <div className={styles.hirepilotRightFilterContainer}>
                  <Grid container columnSpacing={2}>
                    <Grid item xs={12} md={4}>
                      <input
                        type="text"
                        className={`inputBox1`}
                        placeholder="Search Industry / Skills / Name"
                        value={filter.industryInput}
                        id="industryInput"
                        onChange={(e) => changeHandler(e, "industryInput")}
                        style={{ flex: "1" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <input
                        type="text"
                        className={`inputBox1`}
                        placeholder="Search City / Country"
                        value={filter.locationInput}
                        id="locationInput"
                        onChange={(e) => changeHandler(e, "locationInput")}
                      />
                    </Grid>
                    {/* <PlacesAutocomplete
                            value={filter.locationInput}
                            onChange={handleChange1}
                            onSelect={handleSelect}
                            className="inputBox"
                            style = {{flex: "1"}}
                          >
                            {({
                              getInputProps,
                              suggestions,
                              getSuggestionItemProps,
                              loading,
                            }) => (
                              <div style={{ position: "relative", flex: "1" }}>
                                <input
                                  {...getInputProps({
                                    placeholder: "Enter Places",
                                    className:
                                      "location-search-input c_j_form_input ",
                                  })}
                                  style={{
                                    marginBottom: "0px",
                                    width: "100%"
                                  }}
                                  className={`inputBox1 ${styles.hirepilotRightFilterInput2}`}
                                  id="location"
                                />
                                <div
                                  className="autocomplete-dropdown-container"
                                  style={{
                                    width: "calc(100%)",

                                    position: "absolute",
                                    top: "calc(100%)",
                                    zIndex: 1000,
                                    fontFamily: "roboto-regular",
                                    fontSize: "16px",
                                    border:
                                      suggestions.length === 0
                                        ? ""
                                        : "1px solid grey",
                                    overflow: "hidden",
                                    borderEndStartRadius: "10px",
                                    borderEndEndRadius: "10px",
                                    background: "white",
                                  }}
                                >
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map((suggestion, i) => {
                                    const className = suggestion.active
                                      ? "suggestion-item--active"
                                      : "suggestion-item";
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                      ? {
                                          backgroundColor: "#e1e1e1",
                                          cursor: "pointer",
                                          padding: "10px 20px",
                                        }
                                      : {
                                          backgroundColor: "#ffffff",
                                          cursor: "pointer",
                                          padding: "10px 20px",
                                        };
                                    return (
                                      <div
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                        })}
                                        key={i}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete> */}
                    <Grid item xs={12} md={4}>
                      <Button
                        className={`filterBtn ${styles.hirepilotRightFilterBtn}`}
                        onClick={() => searchFilter2(filter)}
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </div>
              {isLoading && (
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
              )}
              <div style={{ position: "relative" }} id="Container">
                {data.length ? (
                  <>
                    {data.map((user, index) => {
                      return (
                        <div
                          key={index}
                          className={styles.hirepilotItemMainContainer}
                        >
                          <div className={styles.hirepilotItemContainer}>
                            <div
                              className={styles.hirepilotUserDetailsContainer}
                            >
                              <div className={styles.hirepilotUserImg}>
                                <Link href={`/pilot/${user.userName}`}>
                                  <a aria-label={user.userName}>
                                    <Image
                                      src={`${imageLink}/${user.profilePic}`}
                                      alt=""
                                      height="100%"
                                      width="100%"
                                      style={{
                                        objectFit: "cover",
                                        cursor: "pointer",
                                      }}
                                      data-src=""
                                      priority={index < 2}
                                    />
                                    {/* Image */}
                                  </a>
                                </Link>
                              </div>
                              <div className={styles.hirepilotUserdata}>
                                <h5
                                  style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    textAlign: "left",
                                  }}
                                >
                                  <Link href={`/hire-pilot/pol/${user.userName}`}>
                                    <a aria-label={user.userName}>
                                      {user.name}{" "}
                                      {user.pilotPro ? (
                                        <VerifiedIcon
                                          style={{
                                            color: "#00e7fc",
                                            marginLeft: "5px",
                                          }}
                                        />
                                      ) : (
                                        ""
                                      )}
                                    </a>
                                  </Link>
                                </h5>
                                <p className={styles.hirepilotUserProfession}>
                                  {user.pilotType === "unlicensed"
                                    ? "Professional Drone pilot"
                                    : "Passionate Drone pilot"}
                                </p>
                                <p className={styles.hirepilotUserLocation}>
                                  <FmdGoodOutlinedIcon
                                    style={{
                                      fontSize: "16px",
                                      color: "#00e7fc",
                                      marginRight: "5px",
                                    }}
                                  />{" "}
                                  {user.city}
                                </p>
                              </div>
                            </div>
                            <div
                              className={styles.hirepilotSalaryDetailsContainer}
                            >
                              <div>
                                <div className={styles.hirepilotSalaryDetails}>
                                  {user.hourlyPayment ? (
                                    <>
                                      <h4 className={styles.hirepilotSalary}>
                                        ${user.hourlyPayment}
                                      </h4>
                                      <p className={styles.hirepilotSalaryType}>
                                        /hour
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <h4 className={styles.hirepilotSalary}>
                                        {user.monthlyPayment === 500
                                          ? "$0 - $500"
                                          : user.monthlyPayment === 1000
                                          ? "$500 - $1000"
                                          : user.monthlyPayment === 5000
                                          ? "$1000 - $5000"
                                          : user.monthlyPayment === 10000
                                          ? "$5000 - $10000"
                                          : user.monthlyPayment === 10001
                                          ? "$10000 Above"
                                          : ""}
                                      </h4>
                                      <p className={styles.hirepilotSalaryType}>
                                        {user.monthlyPayment ? "/month" : ""}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div
                                className={styles.hirepilotSalaryBtnContainer}
                              >
                                {true ? (
                                  <>
                                    <Button
                                      className={styles.hirePitonBtn}
                                      style={{
                                        marginRight: "5px",
                                        height: "fit-content",
                                        opacity: user.status ? "1" : "0.3",
                                        pointerEvents: user.status
                                          ? "initial"
                                          : "none",
                                      }}
                                      onClick={() => hirePilot(user._id)}
                                    >
                                      Direct Hire
                                    </Button>
                                    {/* //company work */}
                                    {mySavedPilots.includes(user._id) ? (
                                      <button
                                        style={{
                                          background:
                                            "transparent linear-gradient(323deg,#4ffea3,#00e7fc)",
                                          borderRadius: "30px",
                                          padding: "7px 6px 1px 6px",
                                          height: "fit-content",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => unsavePilot(user._id)}
                                        aria-label="unsave"
                                      >
                                        <FavoriteIcon
                                          style={{ color: "#000" }}
                                        />
                                      </button>
                                    ) : (
                                      <button
                                        style={{
                                          background:
                                            "transparent linear-gradient(323deg,#4ffea3,#00e7fc)",
                                          borderRadius: "30px",
                                          padding: "7px 6px 1px 6px",
                                          height: "fit-content",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          savePilotToFolder(user._id)
                                        }
                                        aria-label="save_pilot"
                                      >
                                        <FavoriteIcon
                                          style={{ color: "#fff" }}
                                        />
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <Link href={`/pilot/${user.userName}`}>
                                    <a
                                      className={styles.hirePitonBtn}
                                      aria-label={user.userName}
                                    >
                                      View Profile
                                    </a>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                          <div
                            className={styles.hirepilotUserSkillsContainer}
                            style={{ paddingTop: "10px" }}
                          >
                            <div className={styles.skillsDronesTitle}>
                              Skills :{" "}
                            </div>
                            <div>
                              {user.skills &&
                                user.skills
                                  .slice(
                                    0,
                                    showMoreSkill.includes(index)
                                      ? user.skills.length
                                      : 3
                                  )
                                  .map((skill, index) => {
                                    return (
                                      <div
                                        className={styles.hirepilotUserSkill}
                                        key={index}
                                      >
                                        {skill}
                                      </div>
                                    );
                                  })}
                              {user.skills && user.skills.length > 3 && (
                                <div
                                  className={styles.hirepilotUserSkill}
                                  style={{
                                    background: "#4ffea3",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => showMoreSkillChange(index)}
                                >
                                  {showMoreSkill.includes(index)
                                    ? "- Show less"
                                    : `+ ${user.skills.length - 3} more`}
                                </div>
                              )}
                            </div>
                          </div>
                          {user.droneType.length > 0 &&
                            user.droneType[0] !== "" && (
                              <div
                                className={styles.hirepilotUserSkillsContainer}
                                style={{ borderTop: "0px" }}
                              >
                                <div className={styles.skillsDronesTitle}>
                                  Drones :{" "}
                                </div>
                                <div>
                                  {user.droneType.map((drone, index) => {
                                    return (
                                      <div
                                        className={styles.hirepilotUserSkill}
                                        key={index}
                                      >
                                        {drone}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                        </div>
                      );
                    })}
                    {!isLoggedIn && next_page && (
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
                        to you account to view more pilots that match with your
                        profiles.
                      </Alert>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: "center", color: "#989898" }}>
                    No data based on your search
                  </div>
                )}
              </div>
              {next_page && isLoggedIn && (
                <div className="loadingContainer">Loading ...</div>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon className="popupClose" onClick={handleClose} />
          <div className={DashCss.title}>
            Select a folder to save pilots or create a new folder below
          </div>
          <div>
            <Grid container spacing={2}>
              {data1.map((item, i) => {
                return (
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12} key={i}>
                    <div
                      style={{ position: "relative" }}
                      onClick={() => setTempFolder(item._id)}
                    >
                      <Card
                        style={{
                          cursor: "pointer",
                          marginBottom: "15px",
                          border:
                            tempFolder == item._id
                              ? "2px solid #4ffea3"
                              : "none",
                        }}
                        className={tempFolder == item._id ? "tempFolder" : ""}
                      >
                        <CardContent>
                          <div className={DashCss.subTitle}>
                            {item.folderName.length < 15
                              ? item.folderName
                              : item.folderName.slice(0, 15) + "..."}
                          </div>
                          <div className={DashCss.folderDesc}>
                            {item.description.length < 40
                              ? item.description
                              : item.description.slice(0, 38) + "..."}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </Grid>
                );
              })}

              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <Card>
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "160px",
                        width: "100%",
                      }}
                      onClick={() => {
                        setOpen(false);
                        setOpen1(true);
                      }}
                    >
                      <AddCircleOutlineRoundedIcon
                        style={{
                          fontSize: "80px",
                          borderRadius: "40px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
          <center>
            <button
              className="popupLoginBtn"
              onClick={savePilot}
              aria-label="save_pilot"
            >
              Save Pilot
            </button>
          </center>
        </div>
      </Dialog>
      <Dialog
        open={open1}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose1}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon className="popupClose" onClick={handleClose1} />
          <div className={DashCss.title}>Create New Folder to save pilots</div>
          <div>
            <label className="inputLabel" htmlFor="folderName">
              Folder Name
            </label>
            <div>
              <input
                type="text"
                className="inputBox"
                id="folderName"
                value={newFolder.folderName}
                onChange={folderChangeHandler}
              />
            </div>
            <div className="input_error_msg" id="folderName_error">
              Folder Name is required
            </div>
          </div>
          <div>
            <label className="inputLabel" htmlFor="folderDesc">
              Folder Description
            </label>
            <div>
              <input
                type="text"
                className="inputBox"
                id="folderDesc"
                value={newFolder.folderDesc}
                onChange={folderChangeHandler}
              />
            </div>
            <div className="input_error_msg" id="folderDesc_error">
              FolderDesc is required
            </div>
          </div>
          <center>
            <button
              className="popupLoginBtn"
              onClick={createNewFolder}
              aria-label="create"
            >
              Create
            </button>
          </center>
        </div>
      </Dialog>
      <Dialog
        open={subscription}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setSubscription(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setSubscription(false)}
          />
          <div className="popupTitle">
            You have exceeded your limits, Please upgrade?{" "}
          </div>
          <center>
            <Link href={"/company-pro"}>
              <a aria-label="company_pro">
                <button className="popupLoginBtn" aria-label="upgrade">
                  Upgrade
                </button>
              </a>
            </Link>
          </center>
        </div>
      </Dialog>
      <Dialog
        open={hire}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          setHire(false);
          setMessage(msg);
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => {
              setHire(false);
              setMessage(msg);
            }}
          />
          <div className={DashCss.title}>
            Initiate chat and get connected with drone pilots directly
          </div>
          <div>
            <label className="inputLabel" htmlFor="message">
              Message:
            </label>
            <div>
              <textarea
                type="text"
                className="inputBox"
                style={{ height: "150px", resize: "none", padding: "10px" }}
                id="message"
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
                aria-label="start_chat"
              >
                Start Chat
              </button>
            </center>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={subscriptionOver}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setSubscriptionOver(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setSubscriptionOver(false)}
          />
          <div className="popupTitle">
            Limit Exceeded !! Upgrade to continue{" "}
          </div>
          <center>
            <Link href={"/company-pro"}>
              <a aria-label="compnany_pro">
                <button className="popupLoginBtn" aria-label="upgrade">
                  Upgrade
                </button>
              </a>
            </Link>
          </center>
        </div>
      </Dialog>
      <Dialog
        open={filterPopup}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setFilterPopup(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer" style={{ minWidth: "270px" }}>
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setFilterPopup(false)}
          />
          <div style={{ marginBottom: "10px" }}>
            <div>
              <Box>
                <div className={styles.hirepilotFilterHeaderTitle}>
                  Filters
                  <button
                    className={styles.hirepilotFilterClearLink}
                    onClick={clearFilter}
                    aria-label="clear_filter"
                  >
                    Clear All
                  </button>
                </div>

                <div className={styles.hirepilotFilterInputContainer}>
                  <div className={styles.hirepilotRightFilterContainer}>
                    <input
                      type="text"
                      className={`inputBox1 ${styles.hirepilotRightFilterInput1}`}
                      placeholder="Search Industry / Skills "
                      value={filter.industryInput}
                      id="industryInput1"
                      onChange={(e) => changeHandler(e, "industryInput")}
                    />
                    <input
                      type="text"
                      className={`inputBox1 ${styles.hirepilotRightFilterInput1}`}
                      placeholder="Search City / Country"
                      value={filter.locationInput}
                      id="locationInput"
                      onChange={(e) => changeHandler(e, "locationInput")}
                    />
                  </div>
                  <div className={styles.hirePilotFilterTitle}>Pilot type</div>
                  <label className={styles.hirepilotFilterInputField}>
                    <input
                      className={styles.hirepilotFilterRadio}
                      type="checkbox"
                      name=""
                      id=""
                      onChange={() => typeChange("pilotType", "licensed")}
                      checked={filter.pilotType.includes("licensed")}
                    />
                    <span className={styles.hirepilotFilterInputFieldLabel}>
                      Licensed Pilots
                    </span>
                  </label>
                  <label className={styles.hirepilotFilterInputField}>
                    <input
                      className={styles.hirepilotFilterRadio}
                      type="checkbox"
                      name=""
                      id=""
                      onChange={() => typeChange("pilotType", "unlicensed")}
                      checked={filter.pilotType.includes("unlicensed")}
                    />
                    <span className={styles.hirepilotFilterInputFieldLabel}>
                      Unlicensed Pilots
                    </span>
                  </label>
                </div>
                <div className={styles.hirepilotFilterInputContainer}>
                  <div className={styles.hirePilotFilterTitle}>Work</div>
                  <label className={styles.hirepilotFilterInputField}>
                    <input
                      className={styles.hirepilotFilterRadio}
                      type="checkbox"
                      name=""
                      id=""
                      onChange={() => typeChange("work", "full_time")}
                      checked={filter.work.includes("full_time")}
                    />
                    <span className={styles.hirepilotFilterInputFieldLabel}>
                      Full Time
                    </span>
                  </label>
                  <label className={styles.hirepilotFilterInputField}>
                    <input
                      className={styles.hirepilotFilterRadio}
                      type="checkbox"
                      name=""
                      id=""
                      onChange={() => typeChange("work", "part_time")}
                      checked={filter.work.includes("part_time")}
                    />
                    <span className={styles.hirepilotFilterInputFieldLabel}>
                      Part Time
                    </span>
                  </label>
                </div>
                {/* <div className={styles.hirepilotFilterInputContainer}>
                    <div className={styles.hirePilotFilterTitle}>
                      Salary Range
                    </div>
                    <label className={styles.hirepilotFilterInputField}>
                      <input
                        className={styles.hirepilotFilterRadio}
                        type="checkbox"
                        name=""
                        id=""
                        onChange={salaryCheckboxChange}
                        checked={filter.filterSalary}
                      />
                      <span className={styles.hirepilotFilterInputFieldLabel}>
                        Filter salary
                      </span>
                    </label>
                    <div className={styles.hirepilotFilterInputField}>
                      <div className={styles.hirepilotFilterInputFieldLabel}>
                        Price Range ${filter.salaryRange[0]} - $
                        {filter.salaryRange[1]}
                      </div>
                    </div>
                    <div className={styles.hirepilotFilterInputField}>
                      <Box style={{ marginRight: "7px", marginLeft: "10px" }}>
                        <AirbnbSlider
                          getAriaLabel={(index) =>
                            index === 0 ? "Minimum price" : "Maximum price"
                          }
                          value={filter.salaryRange}
                          onChange={handlePriceRange}
                          min={1}
                          max={10000}
                        />
                      </Box>
                    </div>
                  </div> */}
                <div
                  className={styles.hirepilotFilterInputContainer}
                  style={{ marginBottom: "20px" }}
                >
                  <div className={styles.hirePilotFilterTitle}>
                    Type of Drone
                  </div>
                  <div className={styles.hirepilotFilterInputField}>
                    <div className={styles.hirepilotFilterInputFieldLabel}>
                      <Select
                        value={filter.selectedDrones}
                        onChange={handleChangeDrone}
                        options={drones}
                        styles={customStyles}
                        isMulti
                        id="industry"
                        aria-labelledby="select"
                        aria-label="select"
                      />
                    </div>
                  </div>
                </div>
                <div onClick={() => setFilterPopup(false)}>
                  <Button
                    className={`filterBtn`}
                    onClick={() => searchFilter2(filter)}
                  >
                    Apply
                  </Button>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={login}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setLogin(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setLogin(false)}
          />
          <div className="popupTitle">
            You have not logined into Nexdro Account ? Login Now.
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
      <Dialog
        open={noCompany}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setNoCompany(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setNoCompany(false)}
          />
          <div className="popupTitle">
            Only Companies can access this feature for now. Please login as a
            company account.
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default HirePilot;
