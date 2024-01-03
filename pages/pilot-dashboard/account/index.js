import React, { useEffect, useState } from "react";
import PilotAccount from "../../../components/layouts/PilotAccount";
import DashCss from "../../../styles/pilotDashboard.module.css";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Box, Grid, Link, Slider } from "@mui/material";
import axios from "axios";
import Router from "next/router";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import styles from "../../../styles/createPilot.module.css";
import Skeleton from "react-loading-skeleton";
import css from "../../../styles/experience.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import AddIcon from "@mui/icons-material/Add";
import Select from "react-select";
import io from "socket.io-client";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-autocomplete-places";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AvatarEditor from "react-avatar-editor";
import Countries from "../../api/country.json";
import Loader from "../../../components/loader";
import ShareIcon from "@mui/icons-material/Share";
import Ivcss from "../../../styles/imageView.module.css";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import DeleteIcon from "@mui/icons-material/Delete";
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
import DoneIcon from "@mui/icons-material/Done";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

var socket, selectedChatCompare;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const frontendDomain = process.env.NEXT_PUBLIC_BASE_URL;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const localhost = process.env.NEXT_PUBLIC_LOCALHOST;
const allowedFormats = ["jpg", "jpeg", "png", "webp"];
const allowedDocFormats = ["pdf", "jpg", "png"];
const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#f5f5f7",
    borderRadius: "5px",
    borderColor: "#f5f5f7",
    marginBottom: "15px",
    boxShadow: state.isFocused ? null : null,
    cursor: "pointer",
    "&:hover": {
      borderColor: "#4ffea3",
    },
  }),
  menu: (provided, state) => ({
    ...provided,
    color: state.selectProps.menuColor,
  }),
};

function Index() {
  const [id,setId]=useState('')
  let [edit, setEdit] = useState(false);
  var year = new Date().getFullYear();
  let month = new Date().getMonth();
  const [share, setShare] = useState(false);
  const [newEducation, setNewEducation] = useState(false);
  const [formatError, setFormatError] = useState(false);
  const [formatError2, setFormatError2] = useState(false);
  const [deactivate, setDeactivate] = useState(false);
  let [emailChangePopup, setEmailChangePopup] = useState(false);
  let [verify, setVerify] = useState(false);
  let [data, setData] = useState({
    name: "",
    userName: "",
    userLink: "",
    email: "",
    phoneNo: "",
    verifyPhoneNo: "",
    dob: "",
    gender: "",
    city: "",
    country: "",
    bio: "",
    profilePic: "",
    coverPic: "",
    droneType: [],
    pilotType: "licensed",
    certificate: {},
    certificateLink: "",
    trainingCenter: "",
    completedYear: "",
    industry: [],
    experienceYear: "",
    experienceMonth: "",
    skills: [],
    status: false,
    workType: "full_time",
    monthlyPayment: "",
    hourlyPayment: "",
    delete: false,
  });
  let [options, setOptions] = useState([]);
  let [deleteEducation, setDeleteEducation] = useState(false);
  let [copy, setCopy] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  let [profileSuccess, setProfileSuccess] = useState(false);
  let [coverUpdateLoading, setCoverUpdateLoading] = useState(false);
  let [infoSuccess, setInfoSuccess] = useState(false);
  let [changesSavedSuccess, setChangesSavedSuccess] = useState(true);
  let [saveLoading, setSaveLoading] = useState(false);
  let [step1, setStep1] = useState(true);
  let [loading, setLoading] = useState(false);
  let [newEmail, setNewEmail] = useState("");
  let [step2, setStep2] = useState(false);
  let [otp, setOtp] = useState("");
  let [otpData, setOtpData] = useState(0);
  let changeOtp = (e) => {
    document.getElementById("otp_error").style.display = "none";
    if (Number(e.target.value.length <= 4)) {
      setOtp(e.target.value);
    }
  };
  let sendChangeEmail = () => {
    setStep1(false);
    setLoading(true);
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    if (newEmail == "") {
      document.getElementById("newEmail_error").innerHTML =
        "New Email Id is required";
      document.getElementById("newEmail_error").style.display = "block";
      setLoading(false);
      setStep1(true);
    } else if (
      newEmail !== "" &&
      (newEmail.length < 3 || newEmail.length > 100 || !validateEmail(newEmail))
    ) {
      document.getElementById("newEmail_error").innerHTML = "Invalid Email Id";
      document.getElementById("newEmail_error").style.display = "block";
      setLoading(false);
      setStep1(true);
    } else {
      axios
        .post(`${domain}/api/user/newEmailRequest`, { email: newEmail })
        .then((res) => {
          console.log(res);
          if (res.data == "Email not available") {
            document.getElementById("newEmail_error").innerHTML =
              "Email Id Already taken";
            document.getElementById("newEmail_error").style.display = "block";
            setLoading(false);
            setStep1(true);
          } else {
            setOtpData(res.data);
            document.getElementById("newEmail_error").innerHTML =
              "OTP has sent to your new email id";
            document.getElementById("newEmail_error").style.display = "block";
            setLoading(false);
            setStep2(true);
          }
        });
    }
  };
  let checkOtp = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (Number(otp) === otpData) {
      axios
        .post(`${domain}/api/user/changeEmailId`, { email: newEmail }, config)
        .then((res) => {
          console.log(res);
          setEmailChangePopup(false);
          setStep1(false);
          setStep2(false);
          setOtp("");
          setNewEmail("");
          window.scrollTo(0, 0);
          setEdit(false);
          document.getElementById("saveSuccess").style.display = "flex";
          setTimeout(() => {
            if (document.getElementById("saveSuccess")) {
              document.getElementById("saveSuccess").style.display = "none";
            }
          }, 4000);
          getPilotDetails();
          setLoadingImage(false);
        });
    } else {
      document.getElementById("otp_error").innerHTML = "OTP doesn't match";
      document.getElementById("otp_error").style.display = "block";
    }
  };
  const [picture2, setPicture2] = useState({
    cropperOpen: false,
    img: null,
    zoom: 1,
    croppedImg:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png",
  });
  var editor2 = "";
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 1,
    croppedImg:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png",
  });

  const getPilotDetails = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/user/pilotDetails`, config).then((res) => {
      console.log(res.data,'pppppppppppppppppppppppppp');
      setId(res?.data?.userId)
      var temp_industry = [];
      for (var i = 0; i < res.data.industry.length; i++) {
        temp_industry.push({
          label: res.data.industry[i],
          value: res.data.industry[i],
        });
      }
      let dial_code = "";
      let savedCountry = Countries.find(
        (x) => x.name === res.data.country || x.code === res.data.country
      );
      if (savedCountry && savedCountry.dial_code) {
        dial_code = savedCountry.dial_code;
      }
      console.log(savedCountry);

      setData({
        ...data,
        name: res.data.name,
        userName: res.data.userName,
        userLink: res.data.userName,
        email: res.data.emailId,
        dial_code: dial_code,
        phoneNo: res.data.phoneNo,
        verifyPhoneNo: res.data.phoneNo,
        dob: res.data.dob,
        gender: res.data.gender,
        city: res.data.city,
        country: res.data.country,
        bio: res.data.bio ? res.data.bio : "",
        profilePic: res.data.profilePic,
        coverPic: res.data.coverPic,
        droneType: res.data.droneType,
        pilotType: res.data.pilotType,
        droneId: res.data.droneId,
        industry: [...temp_industry],
        completedYear: res.data.completedYear,
        completedYear: res.data.completedYear,
        certificate: res.data.certificates ? res.data.certificates[0] : "",
        certificateLink: res.data.certificates ? res.data.certificates[0] : "",
        trainingCenter: res.data.trainingCenter,
        skills: res.data.skills,
        status: res.data.status,
        workType: res.data.workType,

        monthlyPayment: res.data.monthlyPayment ? res.data.monthlyPayment : "",
        hourlyPayment: res.data.hourlyPayment ? res.data.hourlyPayment : "",
        delete: res.data.delete ? res.data.delete : false,
      });
      setLoadingImage(false);
    });
  };
  let [loadingImage, setLoadingImage] = useState(false);
  let [educationDetails, setEducationDetails] = useState([]);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    setLoadingImage(true);
    

    getPilotDetails();
    axios.get(`${domain}/api/industry/getIndustries`).then((res) => {
      const options = res.data.map((d) => ({
        value: d.industry,
        label: d.industry,
      }));
      setOptions([...options]);
    });
    axios.get(`${domain}/api/skill/getSkills`).then((res) => {
      if (res.data) {
        const skills = res.data.map((skill) => skill.skill);
        setSuggestedSkills([...skills]);
      }
    });
    axios.get(`${domain}/api/education/getMyEducation`, config).then((res) => {
      console.log(res);
      setEducationDetails(res.data);
    });
  }, []);
  let changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    if (e.target.id !== "skills") {
      setData({
        ...data,
        [e.target.id]: e.target.value,
      });
    } else {
      setData({
        ...data,
        skill: e.target.value,
      });
    }
  };
  var editor = "";
  const setEditorRef = (ed) => {
    editor = ed;
  };
  const setEditorRef2 = (ed) => {
    editor2 = ed;
  };
  const handleSlider = (event, value) => {
    setPicture({
      ...picture,
      zoom: value,
    });
  };
  const handleSlider2 = (event, value) => {
    setPicture2({
      ...picture2,
      zoom: value,
    });
  };
  const handleCancel = () => {
    setPicture({
      ...picture,
      cropperOpen: false,
    });
  };
  const handleCancel2 = () => {
    setPicture2({
      ...picture,
      cropperOpen: false,
    });
  };

  let submit = () => {
    let flag = true;
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };

    if (!saveLoading) {
      const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };
      function isUserNameValid(username) {
        /* 
            Usernames can only have: 
            - Lowercase Letters (a-z)
            - Numbers (0-9)
            - Underscores (_)
            - Hyphen (-)
          */
        const res = /^[a-z0-9_-]+$/.exec(username);
        const valid = !!res;
        return valid;
      }
      function isDroneIdValid(DroneId) {
        const res = /^[a-zA-Z0-9]{1,30}$/.exec(DroneId);
        const valid = !!res;
        return valid;
      }
      let fields = [];
      if (data.pilotType === "licensed") {
        fields = [
          "name",
          "userName",
          "email",
          "phoneNo",
          "dob",
          "city",
          "industry",
          "skills",
          "bio",
        ];
      } else {
        fields = [
          "name",
          "userName",
          "email",
          "phoneNo",
          "dob",
          "city",
          // "droneId",
          "industry",
          "skills",
          "bio",
        ];
      }

      var focusField = "";
      var error = false;
      for (let i = 0; i < fields.length; i++) {
        if (
          fields[i] !== "certificate" &&
          fields[i] !== "bio" &&
          data[fields[i]].length <= 0 &&
          fields[i] !== "experienceYear" &&
          fields[i] !== "experienceMonth"
        ) {
          document.getElementById(
            `${fields[i]}_error`
          ).innerText = `${fields[i]} is required.`;
          document.getElementById(`${fields[i]}_error`).style.display = "block";
          if (focusField === "") {
            focusField = fields[i];
          }
          error = true;
        }
        if (fields[i] === "name") {
          if (data[fields[i]].length === 0) {
            document.getElementById("name_error").innerText =
              "Name is required";
            error = true;
            if (focusField === "") {
              focusField = fields[i];
            }
            document.getElementById(`${fields[i]}_error`).style.display =
              "block";
          } else if (data[fields[i]].length < 3) {
            document.getElementById("userName_error").innerText =
              "Name should have atleast 3 characters";
            error = true;
            if (focusField === "") {
              focusField = fields[i];
            }
            document.getElementById(`${fields[i]}_error`).style.display =
              "block";
          } else if (data[fields[i]].length > 25 || !/^[A-Za-z]+$/.test(data[fields[i]])) {
            document.getElementById("name_error").innerText =
            "Name should not exceed 25 characters and must contain only alphabetic characters";
            error = true;
            if (focusField === "") {
              focusField = fields[i];
            }
            document.getElementById(`${fields[i]}_error`).style.display =
              "block";
          }
         
        }
        if (fields[i] === "userName") {
          if (data[fields[i]].length === 0) {
            document.getElementById("userName_error").innerText =
              "Username is required";
            error = true;
            if (focusField === "") {
              focusField = fields[i];
            }
            document.getElementById(`${fields[i]}_error`).style.display =
              "block";
          } else if (data[fields[i]].length < 3) {
            document.getElementById("userName_error").innerText =
              "Username should have atleast 3 characters";
            error = true;
            if (focusField === "") {
              focusField = fields[i];
            }
            document.getElementById(`${fields[i]}_error`).style.display =
              "block";
          } else if (data[fields[i]].length > 25) {
            document.getElementById("userName_error").innerText =
              "Username should not exceed 25 characters";
            error = true;
            if (focusField === "") {
              focusField = fields[i];
            }
            document.getElementById(`${fields[i]}_error`).style.display =
              "block";
          } else if (!isUserNameValid(data.userName)) {
            document.getElementById("userName_error").innerText =
              "Username is not valid. You can use only integers, characters(small letters), '-' and '_'";
            error = true;
            if (focusField === "") {
              focusField = fields[i];
            }
            document.getElementById(`${fields[i]}_error`).style.display =
              "block";
          }
        }
        if (fields[i] === "email" && !validateEmail(data.email)) {
          error = true;
          if (focusField === "") {
            focusField = fields[i];
          }
          document.getElementById("email_error").innerText =
            "Email ID is not valid";
          document.getElementById("email_error").style.display = "block";
        }
        if (fields[i] === "phoneNo" && String(data.phoneNo).length < 7) {
          error = true;
          if (focusField === "") {
            focusField = fields[i];
          }
          document.getElementById("phoneNo_error").innerText =
            "Invalid Phone Number";
          document.getElementById("phoneNo_error").style.display = "block";
        }
        if (fields[i] === "dob" && data[fields[i]].slice(0, 4) > year - 13) {
          error = true;
          if (focusField === "") {
            focusField = fields[i];
          }
          document.getElementById("dob_error").innerText =
            "Age must be minimum 13 years.";
          document.getElementById("dob_error").style.display = "block";
        }
        if (
          fields[i] === "city" &&
          (data[fields[i]].length > 100 || data[fields[i]].length < 3)
        ) {
          error = true;
          if (focusField === "") {
            focusField = fields[i];
          }
          document.getElementById("city_error").innerText =
            "City should be between 3 - 100 characters.";
          document.getElementById("city_error").style.display = "block";
        }

        console.log(data.certificate);
        console.log(data.certificateLink);
        if (
          fields[i] === "certificate" &&
          !data.certificate &&
          !data.certificateLink
        ) {
          document.getElementById(`${fields[i]}_error`).style.display = "block";
          document.getElementById(`${fields[i]}_error`).InnerText =
            "Certificate is required";
          if (focusField === "") {
            focusField = fields[i];
          }
          error = true;
        }
        if (
          fields[i] === "hourlyPayment" &&
          (data.hourlyPayment <= 0 || String(data.hourlyPayment).length > 20)
        ) {
          document.getElementById(`${fields[i]}_error`).style.display = "block";
          document.getElementById(`${fields[i]}_error`).innerHTML =
            "Hourly payment is not valid";
          if (focusField === "") {
            focusField = fields[i];
          }
          error = true;
        }
        if (
          fields[i] === "monthlyPayment" &&
          (data.monthlyPayment <= 0 || String(data.monthlyPayment).length > 20)
        ) {
          document.getElementById(`${fields[i]}_error`).style.display = "block";
          document.getElementById(`${fields[i]}_error`).innerHTML =
            "Monthly payment is not valid";
          if (focusField === "") {
            focusField = fields[i];
          }
          error = true;
        }
        if (
          fields[i] === "bio" &&
          data.bio.length !== 0 &&
          (data.bio.length > 1500 || data.bio.length < 3 ||  data.bio.split(/\b[\s,\.-:;]*/).length < 50 || data.bio.split(/\b[\s,\.-:;]*/).length > 200)
        ) {
          document.getElementById(`${fields[i]}_error`).style.display = "block";
          if (focusField === "") {
            focusField = fields[i];
          }
          error = true;
        }
      }
      console.log(data);
      if (error) {
        document.getElementById(focusField).focus();
      } else {
        axios
          .post(
            `${domain}/api/user/checkuserNameProfile`,
            { userName: data.userName },
            config
          )
          .then((res) => {
            console.log(res.data);
            if (res.data === "available") {
              if (!(data.phoneNo == data.verifyPhoneNo)) {
                console.log(data.phoneNo);
                console.log(data.verifyPhoneNo);
                axios
                  .post(`${domain}/api/user/checkPhoneNo`, {
                    phoneNo: data.phoneNo,
                    country: data.country,
                  })
                  .then((res) => {
                    console.log(res.data);
                    if (res.data === "User phoneNo available") {
                      setSaveLoading(true);
                      if (data.certificate && data.certificate.size) {
                        var formData = new FormData();
                        var tempIndustries = data.industry.map((x) => x.label);
                        console.log(tempIndustries);
                        formData.append("name", data.name);
                        formData.append("userName", data.userName);
                        formData.append("email", data.email);
                        formData.append("phoneNo", data.phoneNo);
                        formData.append("dob", data.dob);
                        formData.append("file", data.certificate);
                        formData.append("gender", data.gender);
                        formData.append("city", data.city);
                        formData.append("country", data.country);
                        formData.append("droneType", data.droneType);
                        formData.append("pilotType", data.pilotType);
                        formData.append("droneId", data.droneId);
                        formData.append("industry", tempIndustries);
                        formData.append("completedYear", data.completedYear);
                        formData.append("trainingCenter", data.trainingCenter);
                        formData.append("skills", data.skills);

                        axios
                          .post(
                            `${domain}/api/pilot/updatePilotInfo1`,
                            formData,
                            config
                          )
                          .then((res) => {
                            getPilotDetails();
                            console.log(res);
                            setSaveLoading(false);
                            window.scrollTo(0, 0);
                            setEdit(false);
                            document.getElementById(
                              "saveSuccess"
                            ).style.display = "flex";
                            setTimeout(() => {
                              document.getElementById(
                                "saveSuccess"
                              ).style.display = "none";
                            }, 4000);
                          })
                          .catch((err) => {
                            console.log(err);
                            setSaveLoading(false);
                          });
                      } else {
                        console.log({
                          ...data,
                          industry: data.industry.map((x) => x.label),
                        });
                        axios
                          .post(
                            `${domain}/api/pilot/updatePilotInfo`,
                            {
                              ...data,
                              industry: data.industry.map((x) => x.label),
                            },
                            config
                          )
                          .then((res) => {
                            getPilotDetails();

                            console.log(res);
                            setEdit(false);
                            window.scrollTo(0, 0);
                            document.getElementById(
                              "saveSuccess"
                            ).style.display = "flex";
                            setTimeout(() => {
                              document.getElementById(
                                "saveSuccess"
                              ).style.display = "none";
                            }, 4000);
                            setSaveLoading(false);
                          })
                          .catch((err) => {
                            console.log(err);
                            setSaveLoading(false);
                          });
                      }
                    } else {
                      document.getElementById("phoneNo_error").innerText =
                        "Phone number already taken";
                      document.getElementById("phoneNo").focus();
                      document.getElementById(`phoneNo_error`).style.display =
                        "block";
                    }
                  })
                  .catch((err) => {
                    document.getElementById("phoneNo_error").innerText =
                      "Phone number already taken";
                    document.getElementById("phoneNo").focus();
                    document.getElementById(`phoneNo_error`).style.display =
                      "block";
                    console.log(err.response);
                  });
              } else {
                setSaveLoading(true);
                if (data.certificate && data.certificate.size) {
                  var formData = new FormData();
                  var tempIndustries = data.industry.map((x) => x.label);
                  console.log(tempIndustries);
                  formData.append("name", data.name);
                  formData.append("userName", data.userName);
                  formData.append("email", data.email);
                  formData.append("phoneNo", data.phoneNo);
                  formData.append("dob", data.dob);
                  formData.append("file", data.certificate);
                  formData.append("gender", data.gender);
                  formData.append("city", data.city);
                  formData.append("country", data.country);
                  formData.append("droneType", data.droneType);
                  formData.append("pilotType", data.pilotType);
                  formData.append("droneId", data.droneId);
                  formData.append("industry", tempIndustries);
                  formData.append("completedYear", data.completedYear);
                  formData.append("trainingCenter", data.trainingCenter);
                  formData.append("skills", data.skills);

                  axios
                    .post(
                      `${domain}/api/pilot/updatePilotInfo1`,
                      formData,
                      config
                    )
                    .then((res) => {
                      getPilotDetails();
                      console.log(res);
                      setSaveLoading(false);
                      window.scrollTo(0, 0);
                      setEdit(false);
                      document.getElementById("saveSuccess").style.display =
                        "flex";
                      setTimeout(() => {
                        document.getElementById("saveSuccess").style.display =
                          "none";
                      }, 4000);
                    })
                    .catch((err) => {
                      console.log(err);
                      setSaveLoading(false);
                    });
                } else {
                  console.log({
                    ...data,
                    industry: data.industry.map((x) => x.label),
                  });
                  axios
                    .post(
                      `${domain}/api/pilot/updatePilotInfo`,
                      {
                        ...data,
                        industry: data.industry.map((x) => x.label),
                      },
                      config
                    )
                    .then((res) => {
                      getPilotDetails();

                      console.log(res);
                      setEdit(false);
                      window.scrollTo(0, 0);
                      document.getElementById("saveSuccess").style.display =
                        "flex";
                      setTimeout(() => {
                        document.getElementById("saveSuccess").style.display =
                          "none";
                      }, 4000);
                      setSaveLoading(false);
                    })
                    .catch((err) => {
                      console.log(err);
                      setSaveLoading(false);
                    });
                }
              }
            } else {
              document.getElementById("userName_error").innerText =
                "Username already taken";
              document.getElementById("userName").focus();
              document.getElementById(`userName_error`).style.display = "block";
            }
          });
      }
    }
  };
  const handleSave = (e) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (setEditorRef) {
      setCoverUpdateLoading(true);
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();
      console.log(croppedImg);
      let formData = new FormData();
      formData.append("file", croppedImg);
      formData.append("test", "Hello");
      axios
        .post(`${domain}/api/user/updateCoverPic`, formData, config)
        .then((res) => {
          setCoverUpdateLoading(false);
          setPicture({
            ...picture,
            img: null,
            cropperOpen: false,
            croppedImg: croppedImg,
          });
          console.log(res.data);
          axios
            .post(`${domain}/api/user/pilotDetails`, config)
            .then((response) => {
              console.log(response.data.coverPic);
              setData({
                ...data,
                coverPic: `${response.data.coverPic}`,
              });
            });
        })
        .catch((err) => {
          setCoverUpdateLoading(false);
          console.log(err.response);
        });
    }
  };
  const handleSave2 = (e) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (setEditorRef2) {
      setCoverUpdateLoading(true);
      const canvasScaled = editor2.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();
      console.log(croppedImg);
      let formData = new FormData();
      formData.append("file", croppedImg);
      axios
        .post(`${domain}/api/user/updateProfilePic`, formData, config)
        .then((res) => {
          setCoverUpdateLoading(false);
          setPicture2({
            ...picture2,
            img: null,
            cropperOpen: false,
            croppedImg: croppedImg,
          });
          localStorage.setItem("profileChanged", "changed");
          console.log(res.data);
          setProfileSuccess(true);
          axios
            .post(`${domain}/api/user/pilotDetails`, config)
            .then((response) => {
              socket = io(localhost);
              socket.emit("reloadMyData", response.data.userId);
              console.log(response.data);
              setData({
                ...data,
                profilePic: `${response.data.profilePic}`,
              });
            });
        })
        .catch((err) => {
          setCoverUpdateLoading(false);
          console.log(err.response);
        });
    }
  };

  const addDrone = (e) => {
    if (e.key === "Enter") {
      if (
        !data.droneType.includes(e.target.value) &&
        data.droneType.length < 5 &&
        e.target.value.trim().length > 0
      ) {
        setData({
          ...data,
          droneType: [...data.droneType, e.target.value],
        });
      }
      document.getElementById(e.target.id).value = "";
    }
  };

  const removeDrone = (index) => {
    if(edit){
      var temp_drones = data.droneType;
      temp_drones.splice(index, 1);
      setData({ ...data, droneType: [...temp_drones] });
    }

  };

  const pilotTypeChangeHandler = (e) => {
    console.log(data);
    setData({ ...data, pilotType: e.target.value });
  };

  const enterFormSubmit = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  const certificateChangeHandler = (e) => {
    if (e.target.files[0].size / 1000000 > 2) {
      document.getElementById("certificate_error").innerText =
        "File size should not exceed 2MB";
      document.getElementById("certificate_error").style.display = "block";
      setTimeout(() => {
        document.getElementById("certificate_error").style.display = "none";
      }, 4000);
    } else {
      var file = e.target.files[0];
      var fileFormat = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      console.log(fileFormat);
      if (allowedDocFormats.includes(fileFormat)) {
        setData({ ...data, certificate: e.target.files[0] });
        document.getElementById("certificate_error").style.display = "none";
      } else {
        setFormatError2(true);
      }
    }
    document.getElementById(e.target.id).value = "";
  };

  const handleChange = (selectedOption) => {
    setData({ ...data, industry: [...selectedOption] });
    document.getElementById("industry_error").style.display = "none";
  };

  const addSkillInput = (e) => {
    if (e.key === "Enter") {
      if (
        !data.skills.includes(e.target.value) &&
        !suggestedSkills.includes(e.target.value) &&
        e.target.value.trim().length > 0
      ) {
        setData({
          ...data,
          skills: [...data.skills, e.target.value],
        });
      } else if (suggestedSkills.includes(e.target.value)) {
        addSkillSuggested(suggestedSkills.indexOf(e.target.value));
      }
      document.getElementById(e.target.id).value = "";
    }
  };

  const removeSkill = (index) => {
    if (edit) {
      var temp_skills = data.skills;
      setSuggestedSkills([temp_skills[index], ...suggestedSkills]);
      temp_skills.splice(index, 1);
      setData({ ...data, skills: [...temp_skills] });
    }
  };
  const addSkillSuggested = (index) => {
    if (edit) {
      var temp_skill = suggestedSkills[index];
      var temp_suggested_skills = suggestedSkills;
      temp_suggested_skills.splice(index, 1);
      setSuggestedSkills(temp_suggested_skills);
      setData({
        ...data,
        skills: [...data.skills, temp_skill],
      });
    }
  };
  const handleChangeWillWork = (e) => {
    setData({
      ...data,
      status: !data.status,
    });
  };

  const workTypeChangeHandler = (e) => {
    setData({
      ...data,
      workType: e.target.value,
    });
  };

  let handleChange1 = (address) => {
    setData({
      ...data,
      location: address,
    });
  };
  let handleSelect = (address) => {
    console.log(address);
    if (address && address.trim().length > 0) {
      setData({
        ...data,
        location: address,
      });
      let tempAddress = address.split(",")[0];
      if (data.preferredLocation.includes(tempAddress)) {
        setData({
          ...data,
          location: "",
        });
      } else if (data.preferredLocation.length >= 5) {
        setData({
          ...data,
          location: "",
        });
      } else {
        setData({
          ...data,
          preferredLocation: [...data.preferredLocation, tempAddress],
          location: "",
        });
      }
    }
  };
  const removePreferedLocation = (index) => {
    if (edit) {
      var temp_locations = data.preferredLocation;
      temp_locations.splice(index, 1);
      setData({ ...data, preferredLocation: [...temp_locations] });
    }
  };
  const copyClipBoard = (link) => {
    navigator.clipboard.writeText(link);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 3000);
  };
  const handleFileChange2 = (e) => {
    let file = e.target.files[0];
    console.log(file.type);
    var fileFormat = file.name
      .substring(file.name.lastIndexOf(".") + 1)
      .toLowerCase();
    console.log(fileFormat);
    if (allowedFormats.includes(fileFormat) && file.type.includes("image")) {
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        if (img.width >= 180 && img.height >= 180) {
          let url = URL.createObjectURL(file);
          console.log(url);
          setPicture2({
            ...picture,
            img: url,
            cropperOpen: true,
          });
        } else {
          alert("Profile Image size must be minimum 180x180");
        }
      };
      img.src = window.URL.createObjectURL(e.target.files[0]);
    } else {
      setFormatError(true);
    }
    document.getElementById(e.target.id).value = "";
  };
  const phoneChangeHandler = (e) => {
    document.getElementById("phoneNo_error").style.display = "none";
    console.log(e.target.value);
    console.log(
      e.target.value.slice(
        data.dial_code.length + 1,
        14 + data.dial_code.length
      )
    );
    try {
      if (
        (Number(
          e.target.value.slice(
            data.dial_code.length + 1,
            15 + data.dial_code.length
          )
        ) &&
          Number(
            e.target.value.slice(
              data.dial_code.length + 1,
              15 + data.dial_code.length
            )
          ) > 0) ||
        e.target.value.slice(
          data.dial_code.length + 1,
          15 + data.dial_code.length
        ) === ""
      ) {
        setData({
          ...data,
          phoneNo:
            Number(
              e.target.value.slice(
                data.dial_code.length + 1,
                15 + data.dial_code.length
              )
            ) || "",
        });
      }
    } catch {
      console.log("Not a number");
    }
  };
  const handleFileChange = (e) => {
    let file = e.target.files[0];
    console.log("Cover pic");
    var fileFormat = file.name
      .substring(file.name.lastIndexOf(".") + 1)
      .toLowerCase();
    console.log(fileFormat);
    if (allowedFormats.includes(fileFormat) && file.type.includes("image")) {
      const img = new Image();
      img.onload = function () {
        if (img.width >= 900 && img.height >= 220) {
          let url = URL.createObjectURL(file);
          console.log(url);
          setPicture({
            ...picture,
            img: url,
            cropperOpen: true,
          });
        } else {
          alert("Cover Image size must be minimum 900x220");
        }
      };
      img.src = window.URL.createObjectURL(e.target.files[0]);
    } else {
      setFormatError(true);
    }
    document.getElementById(e.target.id).value = "";
  };

  //educationData
  let [educationData, setEducationData] = useState({
    instituteName: "",
    courseName: "",
    startDate: "",
    endDate: "",
  });
  let educationHandler = (e) => {
    if (document.getElementById(`${e.target.id}_error`)) {
      document.getElementById(`${e.target.id}_error`).style.display = "none";
    }
    setEducationData({
      ...educationData,
      [e.target.id]: e.target.value,
    });
  };
  let createEducation = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    let focusField = "";
    let fields = ["instituteName", "courseName", "startDate", "endDate"];

    for (let i = 0; i < fields.length; i++) {
      if (educationData[fields[i]] === "") {
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
      educationData.instituteName !== "" &&
      (educationData.instituteName.length < 3 ||
        educationData.instituteName.length > 100)
    ) {
      document.getElementById("instituteName_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("instituteName_error").style.display = "block";
      focusField = "instituteName";
    }
    if (
      educationData.courseName !== "" &&
      (educationData.courseName.length < 3 ||
        educationData.courseName.length > 100)
    ) {
      document.getElementById("courseName_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("courseName_error").style.display = "block";
      focusField = "courseName";
    }
    if (
      educationData.startDate !== "" &&
      educationData.endDate !== "" &&
      !educationData.present &&
      educationData.startDate > educationData.endDate
    ) {
      document.getElementById("startDate_error").innerHTML =
        "Start Date should be lesser than end Date";
      document.getElementById("startDate_error").style.display = "block";
      focusField = "startDate";
    }
    if (focusField !== "") {
      document.getElementById(focusField).focus();
    } else {
      axios
        .post(
          `${domain}/api/education/createEducation`,
          {
            courseName: educationData.courseName,
            instituteName: educationData.instituteName,
            startDate: educationData.startDate,
            endDate: educationData.endDate,
          },
          config
        )
        .then((res) => {
          console.log(res);
          axios
            .get(`${domain}/api/education/getMyEducation`, config)
            .then((res) => {
              console.log(res);
              setEducationDetails(res.data);
            });
          setNewEducation(false);
          setEducationData({
            instituteName: "",
            courseName: "",
            startDate: "",
            endDate: "",
          });
        });
    }
  };
  let [tempId, setTempId] = useState("");
  let deleteThisEducation = (id) => {
    setTempId(id);
    setDeleteEducation(true);
  };
  let confirmDelete = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/education/deleteEducation/${tempId}`)
      .then((res) => {
        axios
          .get(`${domain}/api/education/getMyEducation`, config)
          .then((res) => {
            console.log(res);
            setEducationDetails(res.data);
          });
        setDeleteEducation(false);
      });
  };
  let [editEducation, setEditEducation] = useState(false);
  let [editEducationData, setEditEducationData] = useState({
    instituteName: "",
    courseName: "",
    startDate: "",
    endDate: "",
  });
  let educationHandler1 = (e) => {
    if (document.getElementById(`${e.target.id}_error1`)) {
      document.getElementById(`${e.target.id}_error1`).style.display = "none";
    }
    setEditEducationData({
      ...editEducationData,
      [e.target.id]: e.target.value,
    });
  };
  let editThisEducation = (id) => {
    axios.get(`${domain}/api/education/getEducationById/${id}`).then((res) => {
      setEditEducationData({
        instituteName: res.data.instituteName,
        courseName: res.data.courseName,
        startDate: res.data.startDate,
        endDate: res.data.endDate,
      });
    });
    setTempId(id);
    setEditEducation(true);
  };
  let confirmEdit = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    let focusField = "";
    let fields = ["instituteName", "courseName", "startDate", "endDate"];

    for (let i = 0; i < fields.length; i++) {
      if (editEducationData[fields[i]] === "") {
        if (focusField == "") {
          focusField = fields[i];
        }
        document.getElementById(
          `${fields[i]}_error1`
        ).innerHTML = `${fields[i]} is required`;
        document.getElementById(`${fields[i]}_error1`).style.display = "block";
      }
    }
    if (
      editEducationData.instituteName !== "" &&
      (editEducationData.instituteName.length < 3 ||
        editEducationData.instituteName.length > 100)
    ) {
      document.getElementById("instituteName_error1").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("instituteName_error1").style.display = "block";
      focusField = "instituteName";
    }
    if (
      editEducationData.courseName !== "" &&
      (editEducationData.courseName.length < 3 ||
        editEducationData.courseName.length > 100)
    ) {
      document.getElementById("courseName_error1").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("courseName_error1").style.display = "block";
      focusField = "courseName";
    }
    if (
      editEducationData.startDate !== "" &&
      editEducationData.endDate !== "" &&
      !editEducationData.present &&
      editEducationData.startDate > editEducationData.endDate
    ) {
      document.getElementById("startDate_error1").innerHTML =
        "Start Date should be lesser than end Date";
      document.getElementById("startDate_error1").style.display = "block";
      focusField = "startDate";
    }
    if (focusField !== "") {
      document.getElementById(focusField).focus();
    } else {
      axios
        .post(`${domain}/api/education/editEducation/${tempId}`, {
          courseName: editEducationData.courseName,
          instituteName: editEducationData.instituteName,
          startDate: editEducationData.startDate,
          endDate: editEducationData.endDate,
        })
        .then((res) => {
          axios
            .get(`${domain}/api/education/getMyEducation`, config)
            .then((res) => {
              console.log(res);
              setEducationDetails(res.data);
              setEditEducation(false);
            });
        });
    }
  };

  const deactivateAccount = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/pilot/deactivatePilot/${id}`, config)
      .then((res) => {
        localStorage.clear();
        Router.push("/login");
      })
      .catch((err) => {
        alert("Failed");
      });
  };

  const reactivateAccount = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/pilot/reactivateMyAccount`, config)
      .then((res) => {
        localStorage.clear();
        localStorage.setItem("reactivate", "true")
        Router.push("/login");
      })
      .catch((err) => {
        alert("Failed");
      });
  };

  return (
    <div>
      <Alert
        severity="success"
        id="alert"
        style={{ margin: "20px 0px", display: "none" }}
      >
        Your dashboard has been successfully created!! Enjoy ! :)
      </Alert>
      <Alert
        severity="success"
        id="saveSuccess"
        style={{ margin: "20px 0px", display: "none" }}
      >
        Changes saved successfully.
      </Alert>
      <div style={{ position: "relative" }}>
        {loadingImage ? (
          <Skeleton
            style={{
              width: "100%",
              height: "220px",
            }}
          />
        ) : (
          <img
            src={`${imageLink}/${data.coverPic}`}
            className={DashCss.coverImage}
            style={{ objectFit: "cover", background: "white" }}
            data-src=""
            loading="lazy"
          />
        )}

        <label>
          <EditIcon className={DashCss.coverEdit} />
          <input
            type="file"
            alt="cover-img"
            accept=".jpg, .jpeg, .png, .webp"
            style={{ display: "none" }}
            onChange={handleFileChange}
            id="cover_pic_input"
          />
        </label>
        <div style={{ position: "relative" }}>
          <div className={DashCss.imageLoderDIv}>
            {loadingImage ? (
              <Skeleton
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "75px",
                  marginBottom: "20px",
                }}
              />
            ) : (
              <img
                src={`${imageLink}/${data.profilePic}`}
                className={DashCss.profileImage}
                data-src=""
                loading="lazy"
                style={{ background: "white" }}
              />
            )}
          </div>
          <label>
            <EditIcon className={DashCss.profileEdit} />
            <input
              type="file"
              alt="profile-img"
              accept=".jpg, .jpeg, .png, .webp"
              style={{ display: "none" }}
              onChange={handleFileChange2}
              id="profile_pic_input"
            />
          </label>
        </div>
      </div>
      <div className={DashCss.heading}>Basic Information</div>

      <div className={DashCss.subHead}>
        <div>
          <span style={{ width: "fit-content", fontFamily: "roboto-bold" }}>
            Your Profile Url :
          </span>{" "}
          <Link href={`/pilot/${data.userLink}`} target="_blank">
            {frontendDomain}/pilot/{data.userLink}
          </Link>
        </div>
        <button
          className={DashCss.shareBtn}
          onClick={() => setShare(`/pilot/${data.userLink}`)}
        >
          Share &nbsp;
          <ShareIcon />
        </button>
        <button
          className={DashCss.shareBtn}
          onClick={() =>
            copyClipBoard(`${frontendDomain}/pilot/${data.userLink}`)
          }
        >
          {copy ? <DoneIcon style={{ fontSize: "16px" }} /> : ""}
          {copy ? `Copied` : "Copy"} &nbsp;
          <ContentCopyIcon />
        </button>
      </div>

      {!edit ? (
        <button
          className={DashCss.editButton}
          onClick={() => setEdit(true)}
          style={{ margin: "10px 0px" }}
        >
          Edit
        </button>
      ) : (
        <div style={{ height: "30px" }}></div>
      )}

      <div>
        <Grid container rowSpacing={0} columnSpacing={2}>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <div>
              <label className="inputLabel" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                className="inputBox"
                id="name"
                value={data.name}
                onChange={changeHandler}
                disabled={!edit}
              />
              <div className="input_error_msg" id="name_error">
                Name is required
              </div>
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <div>
              <label className="inputLabel" htmlFor="userName">
                UserName
              </label>
              <input
                type="text"
                className="inputBox"
                id="userName"
                value={data.userName}
                onChange={changeHandler}
                disabled={!edit}
              />
              <div className="input_error_msg" id="userName_error">
                UserName is required
              </div>
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <div>
              {edit && (
                <div
                  className="verify"
                  onClick={() => setEmailChangePopup(true)}
                >
                  Change
                </div>
              )}

              <label className="inputLabel" htmlFor="email">
                Email Id
              </label>
              <input
                type="email"
                className="inputBox"
                id="email"
                value={data.email}
                onChange={changeHandler}
                disabled={true}
              />
              <div className="input_error_msg" id="email_error">
                Email is required
              </div>
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <div>
              <label className="inputLabel" htmlFor="phoneNo">
                Phone No
              </label>
              <input
                type="text"
                className="inputBox"
                id="phoneNo"
                value={data.dial_code + " " + data.phoneNo}
                onChange={phoneChangeHandler}
                disabled={!edit}
              />
              <div className="input_error_msg" id="phoneNo_error">
                PhoneNo is required
              </div>
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <div>
              <label className="inputLabel" htmlFor="dob">
                DOB
              </label>
              <input
                type="date"
                className="inputBox"
                id="dob"
                value={data.dob}
                onChange={changeHandler}
                disabled={!edit}
                max={
                  new Date(
                    new Date().getFullYear() - 13,
                    new Date().getMonth(),
                    new Date().getDate()
                  )
                    .toISOString()
                    .split("T")[0]
                }
              />
              <div className="input_error_msg" id="dob_error">
                dob is required
              </div>
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <div>
              <label className="inputLabel" htmlFor="gender">
                Gender
              </label>

              <select
                className="inputBox"
                id="gender"
                value={data.gender}
                onChange={changeHandler}
                disabled={!edit}
              >
                <option value={""}>Select gender</option>
                <option value={"Male"}>Male</option>
                <option value={"Female"}>Female</option>
                <option value={"Others"}>Others</option>
              </select>
              <div className="input_error_msg" id="gender_error">
                gender is required
              </div>
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <div>
              <label className="inputLabel" htmlFor="city">
                City
              </label>
              <input
                type="text"
                className="inputBox"
                id="city"
                value={data.city}
                onChange={changeHandler}
                disabled={!edit}
              />
              <div className="input_error_msg" id="city_error">
                City is required
              </div>
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <div>
              <label className="inputLabel" htmlFor="country">
                Country
              </label>
              <input
                type="text"
                className="inputBox"
                id="country"
                value={data.country}
                onChange={changeHandler}
                disabled
                style={{ opacity: "0.7" }}
              />
              <div className="input_error_msg" id="country_error">
                Country is required
              </div>
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <label htmlFor="drone">
              <div className="inputLabel">
                Drones (if Yes, Specify the drone models maximum 5):
              </div>
            </label>
            <input
              type="text"
              id="drone"
              className="inputBox"
              name="drone"
              onKeyUp={addDrone}
              placeholder="Type and press enter to add."
              disabled={!edit}
            />
            <div
              className={styles.createPilotSuggestedSkillsContainer}
              style={{ marginBottom: data.droneType.length > 0 && "15px" }}
            >
              {data.droneType.map((drone, index) => {
                return (
                  <>
                    {drone.length > 0 ? (
                      <div
                        className={styles.createPilotSuggestedSkill}
                        key={index}
                        onClick={() => removeDrone(index)}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <RemoveCircleIcon
                            sx={{
                              color: "#ff000080",
                              cursor: "pointer",
                              fontSize: "20px",
                            }}
                            onClick={() => removeDrone(index)}
                          />
                          &nbsp;
                          {drone}{" "}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                );
              })}
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <div style={{ marginBottom: "15px" }}>
              <div>
                <label>
                  <div className="inputLabel">Do you own a license?</div>
                </label>
                <div
                  className={styles.createPilotPilotTypeContainer}
                  style={{ marginTop: "10px" }}
                >
                  <label className={styles.createPilotRadioLabel}>
                    <input
                      type="radio"
                      value={"licensed"}
                      name="pilotType"
                      onChange={pilotTypeChangeHandler}
                      // onKeyUp={enterFormSubmit}
                      className={styles.CreatePilotRadio}
                      checked={data.pilotType === "licensed"}
                      disabled={!edit}
                    />
                    <div className={styles.createPilotRadioLabelContent}>
                      Yes
                    </div>
                  </label>
                  <label
                    className={styles.createPilotRadioLabel}
                    style={{ marginLeft: "20px" }}
                  >
                    <input
                      type="radio"
                      value={"unlicensed"}
                      name="pilotType"
                      onChange={pilotTypeChangeHandler}
                      // onKeyUp={enterFormSubmit}
                      className={styles.CreatePilotRadio}
                      checked={data.pilotType === "unlicensed"}
                      disabled={!edit}
                    />
                    <div className={styles.createPilotRadioLabelContent}>
                      No
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </Grid>
          {data.pilotType === "licensed" ? (
            <>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <label htmlFor="certificate">
                  <div className="inputLabel" style={{ display: "block" }}>
                    Pilot License Certificate
                  </div>
                </label>
                <input
                  type="file"
                  id="certificate"
                  accept=".pdf, .jpg, .png"
                  onChange={certificateChangeHandler}
                  style={{ display: "none" }}
                  disabled={!edit}
                />
                <label
                  htmlFor="certificate"
                  className={styles.createPilotCertificateContainer}
                >
                  <div
                    className={styles.createPilotCertificateAttachment}
                    style={{ opacity: edit ? 1 : 0.7 }}
                  >
                    Attachments
                  </div>
                  <div className={styles.createPilotCertificateAttachmentName}>
                    {data.certificate
                      ? data.certificate.name
                        ? data.certificate.name.slice(0, 20) + " . . ."
                        : data.certificateLink
                        ? data.certificateLink.slice(0, 20) + " . . ."
                        : "Attach your certificate"
                      : "Attach your certificate"}
                  </div>
                </label>
                <div className="input_error_msg" id="certificate_error">
                  Certificate is required
                </div>
              </Grid>
            </>
          ) : (
            // <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            //   <label htmlFor="droneId">
            //     <div className="inputLabel">Drone ID:</div>
            //   </label>
            //   <input
            //     type="text"
            //     id="droneId"
            //     className="inputBox"
            //     value={data.droneId}
            //     name="droneId"
            //     onChange={changeHandler}
            //     onKeyUp={enterFormSubmit}
            //     disabled={!edit}
            //   />
            //   <div className="input_error_msg" id="droneId_error">
            //     Drone Id is required
            //   </div>
            // </Grid>
            <></>
          )}
          <Grid
            item
            xl={data.pilotType === "licensed" ? 6 : 12}
            lg={data.pilotType === "licensed" ? 6 : 12}
            md={data.pilotType === "licensed" ? 6 : 12}
            sm={12}
            xs={12}
          >
            <label htmlFor="industry">
              <div className="inputLabel">Industry:</div>
            </label>
            <Select
              value={data.industry}
              onChange={handleChange}
              options={options}
              styles={{ ...customStyles }}
              isMulti
              id="industry"
              isDisabled={!edit}
              isOptionDisabled={() => data.industry.length >= 5}
            />
            <div className="input_error_msg" id="industry_error">
              Industry is required
            </div>
          </Grid>
          {/* <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <label htmlFor="experienceYear">
              <div className="inputLabel">Experience (if any)</div>
            </label>
            <Grid container spacing={2}>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <input
                  type="number"
                  id="experienceYear"
                  className="inputBox"
                  value={data.experienceYear}
                  name="experienceYear"
                  onChange={changeHandler}
                  onKeyUp={enterFormSubmit}
                  placeholder="Year"
                />
                <div className="input_error_msg" id="experienceYear_error">
                  Error
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <input
                  type="number"
                  id="experienceMonth"
                  className="inputBox"
                  value={data.exp_month}
                  name="experienceMonth"
                  onChange={changeHandler}
                  onKeyUp={enterFormSubmit}
                  placeholder="Month"
                />
                <div className="input_error_msg" id="experienceMonth_error">
                  Error
                </div>
              </Grid>
            </Grid>
          </Grid> */}
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <label htmlFor="skills">
              <div className="inputLabel">Add your Skill:</div>
            </label>
            <input
              type="text"
              id="skills"
              className="inputBox"
              name="skill"
              onChange={changeHandler}
              onKeyUp={addSkillInput}
              placeholder="Type and press enter to add."
              disabled={!edit}
            />
            <div
              className={styles.createPilotSuggestedSkillsContainer}
              style={{ marginBottom: data.skills.length > 0 && "15px" }}
            >
              {data.skills.map((skill, index) => {
                return (
                  <div
                    className={styles.createPilotSuggestedSkill}
                    key={index}
                    onClick={() => removeSkill(index)}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <RemoveCircleIcon
                        sx={{
                          color: "#ff000080",
                          cursor: "pointer",
                          fontSize: "20px",
                        }}
                        onClick={() => removeSkill(index)}
                      />
                      &nbsp;
                      {skill}{" "}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="input_error_msg" id="skills_error">
              Skills is required
            </div>
          </Grid>

          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <label htmlFor="bio">
              <div className="inputLabel">Bio:</div>
            </label>
            <textarea
              id="bio"
              className="inputBox"
              name="bio"
              onChange={changeHandler}
              disabled={!edit}
              style={{ resize: "none", height: "200px", padding: "10px 20px" }}
              value={data.bio}
            ></textarea>
            <div className="input_error_msg" id="bio_error">
              Bio should be between 3 to 500 characters & between 50 and 200 words
            </div>
          </Grid>
          <div className="input_error_msg" id="credentials_error">
            Something went wrong. Try again.
          </div>
        </Grid>
      </div>
      {edit ? (
        <div style={{ textAlign: "right" }}>
          <button
            className={DashCss.saveBtn}
            onClick={submit}
            style={{ display: "inline-block" }}
          >
            {saveLoading ? (
              <>
                <Loader />
                Saving
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      ) : (
        <></>
      )}
      <div>
        <div
          style={{
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #a5a5a5",
          }}
        >
          <div className={css.addNew} onClick={() => setNewEducation(true)}>
            Add new
          </div>
          <div className={css.mainTitle}>Educational Details:</div>
          {educationDetails.length == 0 ? (
            <Alert severity="info">
              You have not added any education details yet!
            </Alert>
          ) : (
            <></>
          )}
          <Grid container columnSpacing={2}>
            {educationDetails.map((item, i) => {
              return (
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  sx={{ marginBottom: "10px" }}
                  key={i}
                >
                  <div className={css.expDiv}>
                    <div className={css.editDelete}>
                      <EditIcon
                        className={css.edit}
                        onClick={() => editThisEducation(item._id)}
                      />
                      <DeleteIcon
                        className={css.delete}
                        onClick={() => deleteThisEducation(item._id)}
                      />
                    </div>
                    <div className={css.role}>{item.courseName}</div>
                    <div className={css.companyName}>{item.instituteName}</div>
                    <div className={css.description}>
                      {months[item.startDate.slice(6, 7)]}-
                      {item.startDate.slice(0, 4)} to{" "}
                      {item.endDate === "Present"
                        ? item.endDate
                        : months[item.endDate.slice(6, 7)] +
                          "-" +
                          item.endDate.slice(0, 4)}
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </div>
        {data.delete ? (
          <p className="reactivate_link" onClick={() => reactivateAccount(true)}>
            Reactivate account
          </p>
        ) : (
          <p className="deactivate_link" onClick={() => setDeactivate(true)}>
            Deactivate account
          </p>
        )}
      </div>
      <Dialog
        open={picture.cropperOpen}
        onClose={() => setInfoSuccess(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"md"}
        fullWidth={true}
        PaperProps={{
          style: { width: "820px", borderRadius: "10px", paddingTop: "50px" },
        }}
      >
        <DialogContent style={{ marginBottom: "50px" }}>
          {picture.cropperOpen && (
            <Box display="block">
              <center>
                <AvatarEditor
                  ref={setEditorRef}
                  image={picture.img}
                  width={900}
                  height={220}
                  border={50}
                  color={[0, 0, 0, 0.7]} // RGBA
                  rotate={0}
                  scale={picture.zoom}
                  style={{ width: "100%", height: "100%" }}
                />
              </center>
              <Slider
                aria-label="raceSlider"
                value={picture.zoom}
                min={1}
                max={10}
                step={0.1}
                onChange={handleSlider}
              ></Slider>
              <Box>
                <Button
                  style={{ marginRight: "10px" }}
                  variant="contained"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                {coverUpdateLoading ? (
                  <Button>Saving</Button>
                ) : (
                  <Button onClick={handleSave}>Save</Button>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={picture2.cropperOpen}
        onClose={() => setInfoSuccess(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"md"}
        fullWidth={true}
        PaperProps={{
          style: { width: "820px", borderRadius: "10px" },
        }}
      >
        <DialogContent>
          {picture2.cropperOpen && (
            <Box display="block">
              <center>
                <AvatarEditor
                  ref={setEditorRef2}
                  image={picture2.img}
                  width={150}
                  height={150}
                  border={50}
                  borderRadius={150}
                  color={[0, 0, 0, 0.7]} // RGBA
                  rotate={0}
                  scale={picture2.zoom}
                  style={{ width: "50%", height: "50%" }}
                />
              </center>
              <Slider
                aria-label="raceSlider"
                value={picture2.zoom}
                min={1}
                max={10}
                step={0.1}
                onChange={handleSlider2}
              ></Slider>
              <Box>
                <Button
                  style={{ marginRight: "10px" }}
                  variant="contained"
                  onClick={handleCancel2}
                >
                  Cancel
                </Button>
                {coverUpdateLoading ? (
                  <Button>Saving</Button>
                ) : (
                  <Button onClick={handleSave2}>Save</Button>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
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
                  style={{ marginRight: "10px" }}
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
                  style={{ marginRight: "10px" }}
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
                  style={{ marginRight: "10px" }}
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
                  style={{ marginRight: "10px" }}
                />
              </div>
            </WhatsappShareButton>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={newEducation}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setNewEducation(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setNewEducation(false)}
          />
          <div className={css.popupTitle}>
            Enter below details to create new education details
          </div>
          <label className="inputLabel">Institute Name</label>
          <input
            type="text"
            className="inputBox"
            value={educationData.instituteName}
            onChange={educationHandler}
            id="instituteName"
          />
          <div className="input_error_msg" id="instituteName_error">
            is required
          </div>
          <label className="inputLabel">Course Name</label>
          <input
            type="text"
            className="inputBox"
            placeholder="Ex: BSc in Tourism"
            value={educationData.courseName}
            onChange={educationHandler}
            id="courseName"
          />
          <div className="input_error_msg" id="courseName_error">
            is required
          </div>

          {/* <input
            type="checkbox"
            value={experienceData.present}
            onChange={experienceHandler}
            id="present"
          />{" "}
          <span>Still working here</span> <br /> */}
          <label className="inputLabel">Duration</label>
          <Grid container spacing={0}>
            <Grid item xl={5.5} lg={5.5} md={5.5} sm={5.5} xs={12}>
              <input
                type="month"
                className="inputBox"
                max={`${new Date().getFullYear()}-${
                  new Date().getMonth() + 1 < 10 ? "0" : ""
                }${new Date().getMonth() + 1}`}
                value={educationData.startDate}
                onChange={educationHandler}
                id="startDate"
              />
              <div className="input_error_msg" id="startDate_error">
                is required
              </div>
            </Grid>
            <Grid item xl={1} lg={1} md={1} sm={1} xs={12}>
              <div className={css.to}>to</div>
            </Grid>
            <Grid item xl={5.5} lg={5.5} md={5.5} sm={5.5} xs={12}>
              <>
                <input
                  type="month"
                  className="inputBox"
                  max={`${new Date().getFullYear()}-${
                    new Date().getMonth() + 1 < 10 ? "0" : ""
                  }${new Date().getMonth() + 1}`}
                  id="endDate"
                  value={educationData.endDate}
                  onChange={educationHandler}
                />
                <div className="input_error_msg" id="endDate_error">
                  is required
                </div>
              </>

              {/* <div className={css.present}>
                Present
                </div> */}
            </Grid>
          </Grid>
          <center>
            <button
              className={css.submit}
              style={{ marginLeft: "0px" }}
              onClick={createEducation}
            >
              Create Education
            </button>
          </center>
        </div>
      </Dialog>
      <Dialog
        open={deleteEducation}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setDeleteEducation(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setDeleteEducation(false)}
          />
          <div className="popupTitle">Are you sure you want to delete?</div>
          <center>
            <button className="popupLoginBtn" onClick={confirmDelete}>
              Yes, Continue
            </button>
          </center>
        </div>
      </Dialog>
      <Dialog
        open={editEducation}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setEditEducation(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setEditEducation(false)}
          />
          <div className={css.popupTitle}>
            Change below details to edit education details:
          </div>
          <label className="inputLabel">Institute Name</label>
          <input
            type="text"
            className="inputBox"
            value={editEducationData.instituteName}
            onChange={educationHandler1}
            id="instituteName"
          />
          <div className="input_error_msg" id="instituteName_error1">
            is required
          </div>
          <label className="inputLabel">Course Name</label>
          <input
            type="text"
            className="inputBox"
            placeholder="Ex: BSc in Tourism"
            value={editEducationData.courseName}
            onChange={educationHandler1}
            id="courseName"
          />
          <div className="input_error_msg" id="courseName_error1">
            is required
          </div>

          {/* <input
            type="checkbox"
            value={experienceData.present}
            onChange={experienceHandler}
            id="present"
          />{" "}
          <span>Still working here</span> <br /> */}
          <label className="inputLabel">Duration</label>
          <Grid container spacing={0}>
            <Grid item xl={5.5} lg={5.5} md={5.5} sm={5.5} xs={12}>
              <input
                type="month"
                className="inputBox"
                max={`${new Date().getFullYear()}-${
                  new Date().getMonth() + 1 < 10 ? "0" : ""
                }${new Date().getMonth() + 1}`}
                value={editEducationData.startDate}
                onChange={educationHandler1}
                id="startDate"
              />
              <div className="input_error_msg" id="startDate_error1">
                is required
              </div>
            </Grid>
            <Grid item xl={1} lg={1} md={1} sm={1} xs={12}>
              <div className={css.to}>to</div>
            </Grid>
            <Grid item xl={5.5} lg={5.5} md={5.5} sm={5.5} xs={12}>
              <>
                <input
                  type="month"
                  className="inputBox"
                  max={`${new Date().getFullYear()}-${
                    new Date().getMonth() + 1 < 10 ? "0" : ""
                  }${new Date().getMonth() + 1}`}
                  id="endDate"
                  value={editEducationData.endDate}
                  onChange={educationHandler1}
                />
                <div className="input_error_msg" id="endDate_error1">
                  is required
                </div>
              </>

              {/* <div className={css.present}>
                Present
                </div> */}
            </Grid>
          </Grid>
          <center>
            <button
              className={css.submit}
              style={{ marginLeft: "0px" }}
              onClick={confirmEdit}
            >
              Edit Education
            </button>
          </center>
        </div>
      </Dialog>
      <Dialog
        open={formatError}
        TransitionComponent={Transition}
        onClose={() => setFormatError(false)}
      >
        <div className="popupContainer">
          <h3 style={{ textAlign: "center" }}>
            Invalid file format. You can choose jpg, jpeg, png and webp.
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button className="formBtn2" onClick={() => setFormatError(false)}>
              Close
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={formatError2}
        TransitionComponent={Transition}
        onClose={() => setFormatError2(false)}
      >
        <div className="popupContainer">
          <h3 style={{ textAlign: "center" }}>
            Invalid file format. You can choose pdf, jpg, png.
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button className="formBtn2" onClick={() => setFormatError2(false)}>
              Close
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={deactivate}
        TransitionComponent={Transition}
        onClose={() => setDeactivate(false)}
      >
        <div className="popupContainer">
          <h4 style={{ textAlign: "center", marginBottom: "20px" }}>
            Are you sure! You want to deactivate your account
          </h4>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              className="formBtn2 mx-10"
              onClick={() => setDeactivate(false)}
            >
              Cancel
            </button>
            <button className="formBtn10" onClick={deactivateAccount}>
              Confirm
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={emailChangePopup}
        TransitionComponent={Transition}
        onClose={() => setEmailChangePopup(false)}
      >
        <div className="popupContainer">
          <h5 style={{ textAlign: "center" }}>Please enter new Email ID</h5>
          <div style={{ marginTop: "10px" }}>
            <input
              type="email"
              className="inputBox"
              disabled={!step1}
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value),
                  (document.getElementById("newEmail_error").style.display =
                    "none");
              }}
            />
            <div className="input_error_msg" id="newEmail_error">
              companyPhone is required
            </div>
          </div>
          {!step2 && (
            <center>
              {loading ? (
                <button className="popupLoginBtn">
                  <Loader /> Submit
                </button>
              ) : (
                <button className="popupLoginBtn" onClick={sendChangeEmail}>
                  Submit
                </button>
              )}
            </center>
          )}

          {step2 && (
            <>
              <h5 style={{ margin: "5px 0px" }}>Please enter OTP below</h5>
              <input
                className="inputBox"
                type="number"
                value={otp}
                onChange={changeOtp}
              />
              <div className="input_error_msg" id="otp_error">
                companyPhone is required
              </div>
              <center>
                {loading ? (
                  <button className="popupLoginBtn">
                    <Loader /> Submit
                  </button>
                ) : (
                  <button className="popupLoginBtn" onClick={checkOtp}>
                    Confirm
                  </button>
                )}
              </center>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
}
Index.Layout = PilotAccount;
export default Index;