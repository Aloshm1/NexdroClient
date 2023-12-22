import React, { useEffect, useState } from "react";
import PilotAccount from "../../../components/layouts/PilotAccount";
import DashCss from "../../../styles/pilotDashboard.module.css";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Grid, Box, Button, Slider, Radio } from "@mui/material";
import axios from "axios";
import CompanyAccount from "../../../components/layouts/CompanyAccount";
import Router from "next/router";
import Loader from "../../../components/loader";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Dialog from "@mui/material/Dialog";
import io from "socket.io-client";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Link from "next/link";
import CreatableSelect from "react-select/creatable";
import AvatarEditor from "react-avatar-editor";
var socket, selectedChatCompare;
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const allowedFormats = ["jpg", "jpeg", "png", "webp"];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Index() {
  let [industries, setIndustries] = useState([]);
  let [mainIndustries, setMainIndustries] = useState([]);
  let [coverUpdateLoading, setCoverUpdateLoading] = useState(false);
  const [formatError, setFormatError] = useState(false);
  let [emailChangePopup, setEmailChangePopup] = useState(false);
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
  useEffect(() => {
    setLoadingImage(true);
    if (localStorage.getItem("profileCreated") === "true") {
      document.getElementById("successalert").style.display = "flex";
      localStorage.removeItem("profileCreated");
    }
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/industry/getIndustries`).then((res) => {
      setIndustries(res.data);
      setMainIndustries(res.data);
    });
    axios
      .get(`${domain}/api/company/companyData`, config)
      .then((res) => {
        setData({
          ...data,
          name: res.data.userName,
          email: res.data.emailId,
          phone: res.data.phoneNo,
          companyType: res.data.company[0].companyType,
          companyName: res.data.company[0].companyName,
          companyPhone: res.data.company[0].phoneNo,
          companyEmail: res.data.company[0].emailId,
          contactPerson: res.data.company[0].contactPersonName,
          gstNo: res.data.company[0].gstNo ? res.data.company[0].gstNo : "",
          industry: res.data.company[0].industry,
          profilePic: res.data.profilePic,
          coverPic: res.data.coverPic,
        });
        setLoadingImage(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  let [edit, setEdit] = useState(false);
  let [data, setData] = useState({
    profilePic:
      "https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/54a633c4940cb24c80e710930d6aa6b7bf7fc48e610e148d2e353e38f6ee82e4jcwew",
    coverPic:
      "https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/721ef436c6f1a1a88a981694a68d01bcf36f8e5a69e0406af6b2b294c856a710sehgjisg",
    name: "",
    email: "",
    phone: "",
    companyType: "company",
    companyName: "",
    companyPhone: "",
    companyEmail: "",
    industry: "",
    contactPerson: "",
    gstNo: "",
  });
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
  let [infoSuccess, setInfoSuccess] = useState(false);
  let changeCompanyType = (type) => {
    if (edit) {
      setData({
        ...data,
        companyType: type,
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
        .post(`${domain}/api/user/updateCoverPicCompany`, formData, config)
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
            .get(`${domain}/api/company/companyData`, config)
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
        .post(`${domain}/api/user/updateProfilePicCompany`, formData, config)
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
          // setProfileSuccess(true);
          axios
            .get(`${domain}/api/company/companyData`, config)
            .then((response) => {
              console.log(response.data);
              socket = io(domain);
              console.log(response.data.company[0].userId);
              socket.emit("reloadMyData", response.data.company[0].userId);
              setData({
                ...data,
                profilePic: `${response.data.profilePic}`,
              });
            });
        })
        .catch((err) => {
          setCoverUpdateLoading(false);
          console.log(err);
        });
    }
  };
  let [loadingImage, setLoadingImage] = useState(false);

  const handleFileChange2 = (e) => {
    let file = e.target.files[0];
    var fileFormat = file.name
      .substring(file.name.lastIndexOf(".") + 1)
      .toLowerCase();
    console.log(fileFormat);
    if (allowedFormats.includes(fileFormat) && file.type.includes("image")) {
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        if (img.width >= 150 && img.height >= 150) {
          let url = URL.createObjectURL(file);
          console.log(url);
          setPicture2({
            ...picture,
            img: url,
            cropperOpen: true,
          });
        } else {
          alert("Profile Image size must be minimum 150x150");
        }
      };
      img.src = window.URL.createObjectURL(e.target.files[0]);
    } else {
      setFormatError(true);
    }
    document.getElementById(e.target.id).value = "";
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
  let changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    if (e.target.id === "industry") {
      let result = mainIndustries.filter((mainIndustries) =>
        mainIndustries.industry
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      );
      setIndustries(result);
    }
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };
  let submit = () => {
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
      const res = /^[a-zA-Z0-9_ -]+$/.exec(username);
      const valid = !!res;
      return valid;
    }
    var focusField = "";
    let fields = [
      "name",
      "email",
      "phone",
      "companyName",
      "companyPhone",
      "companyEmail",
      "industry",
      "contactPerson",
    ];
    for (let i = 0; i < fields.length; i++) {
      console.log(fields[i]);
      console.log(data[fields[i]]);
      if (data[fields[i]] === "") {
        if (focusField == "") {
          focusField = fields[i];
        }
        document.getElementById(
          `${fields[i]}_error`
        ).innerHTML = `${fields[i]} is required`;
        document.getElementById(`${fields[i]}_error`).style.display = "block";
      }
    }
    if (data.name !== "" && (data.name.length < 3 || data.name.length > 25)) {
      document.getElementById("name_error").innerHTML =
        "Characters should be between 3 - 25";
      document.getElementById("name_error").style.display = "block";
      if (focusField == "") {
        focusField = "name";
      }
    } else if (data.name !== "" && !isUserNameValid(data.name)) {
      document.getElementById("name_error").innerHTML =
        "Name is not valid. You can use only Alphabets, integers, '-', ' ' and '_'";
      document.getElementById("name_error").style.display = "block";
      if (focusField == "") {
        focusField = "name";
      }
    }
    if (data.email !== "" && !validateEmail(data.email)) {
      document.getElementById("email_error").innerHTML = "Invalid Email";
      document.getElementById("email_error").style.display = "block";
      if (focusField == "") {
        focusField = "email";
      }
    }
    if (
      data.phone !== "" &&
      (data.phone.length < 7 || data.phone.length > 14)
    ) {
      document.getElementById("phone_error").innerHTML = "Invalid Phone No";
      document.getElementById("phone_error").style.display = "block";
      if (focusField == "") {
        focusField = "phone";
      }
    }
    if (data.phone !== "" && Number(data.phone) < 0) {
      document.getElementById("phone_error").innerHTML =
        "Phone No is not valid";
      document.getElementById("phone_error").style.display = "block";
      if (focusField == "") {
        focusField = "phone";
      }
    }
    if (
      data.companyName !== "" &&
      (data.companyName.length < 3 || data.companyName.length > 25)
    ) {
      document.getElementById("companyName_error").innerHTML =
        "Characters should be between 3 - 25";
      document.getElementById("companyName_error").style.display = "block";
      if (focusField == "") {
        focusField = "companyName";
      }
    }
    if (
      data.companyPhone !== "" &&
      (data.companyPhone.length < 7 || data.companyPhone.length > 14)
    ) {
      console.log("Entered");
      document.getElementById("companyPhone_error").innerHTML =
        "Invalid Phone No";
      document.getElementById("companyPhone_error").style.display = "block";
      if (focusField == "") {
        focusField = "companyPhone";
      }
    }
    if (data.companyPhone !== "" && Number(data.companyPhone) <= 0) {
      console.log("Entered");
      document.getElementById("companyPhone_error").innerHTML =
        "Phone No is not valid";
      document.getElementById("companyPhone_error").style.display = "block";
      if (focusField == "") {
        focusField = "companyPhone";
      }
    }
    if (data.companyEmail !== "" && !validateEmail(data.companyEmail)) {
      document.getElementById("companyEmail_error").innerHTML = "Invalid Email";
      document.getElementById("companyEmail_error").style.display = "block";
      if (focusField == "") {
        focusField = "companyEmail";
      }
    }
    if (
      data.industry !== "" &&
      (data.industry.length < 3 || data.industry.length > 100)
    ) {
      document.getElementById("industry_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("industry_error").style.display = "block";
      if (focusField == "") {
        focusField = "industry";
      }
    }
    if (
      data.contactPerson !== "" &&
      (data.contactPerson.length < 3 || data.contactPerson.length > 25)
    ) {
      document.getElementById("contactPerson_error").innerHTML =
        "Characters should be between 3 - 25";
      document.getElementById("contactPerson_error").style.display = "block";
      if (focusField == "") {
        focusField = "contactPerson";
      }
    } else if (
      data.contactPerson !== "" &&
      !isUserNameValid(data.contactPerson)
    ) {
      document.getElementById("contactPerson_error").innerHTML =
        "contact person name is not valid. You can use only Alphabets, integers, '-', ' ' and '_'";
      document.getElementById("contactPerson_error").style.display = "block";
      if (focusField == "") {
        focusField = "name";
      }
    }
    if (
      data.gstNo !== "" &&
      (data.gstNo.length < 3 || data.gstNo.length > 100)
    ) {
      document.getElementById("gstNo_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("gstNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "gstNo";
      }
    }
    if (focusField !== "") {
      document.getElementById(focusField).focus();
    } else {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      let formData = {
        userName: data.name,
        userEmail: data.email,
        userPhoneNo: data.phone,
        organizationType: data.companyType,
        companyName: data.companyName,
        officialPhoneNo: data.companyPhone,
        officialEmail: data.companyEmail,
        contactPerson: data.contactPerson,
        gstNo: data.gstNo,
        industry: data.industry,
      };
      axios
        .post(`${domain}/api/company/editCompanyData`, { formData }, config)
        .then((res) => {
          axios.get(`${domain}/api/company/companyData`, config).then((res) => {
            setData({
              ...data,
              name: res.data.userName,
              email: res.data.emailId,
              phone: res.data.phoneNo,
              companyType: res.data.company[0].companyType,
              companyName: res.data.company[0].companyName,
              companyPhone: res.data.company[0].phoneNo,
              companyEmail: res.data.company[0].emailId,
              contactPerson: res.data.company[0].contactPersonName,
              gstNo: res.data.company[0].gstNo ? res.data.company[0].gstNo : "",
              industry: res.data.company[0].industry,
              profilePic: res.data.profilePic,
              coverPic: res.data.coverPic,
            });
          });
          window.scroll(0, 0);
          document.getElementById("alert").style.display = "flex";
          setTimeout(() => {
            if (document.getElementById("alert")) {
              document.getElementById("alert").style.display = "none";
            }
          }, 2000);
          setEdit(false);
        });
    }
  };
  let MouseIned = (id) => {
    document.getElementById(`options/${id}`).style.backgroundColor = "#e7e7e7";
  };
  let MouseOuted = (id) => {
    document.getElementById(`options/${id}`).style.backgroundColor = "#ffffff";
  };
  let clicked = () => {
    if (document.getElementById("dropDown")) {
      document.getElementById("dropDown").style.display = "none";
    }
  };
  let changeIndustry = (item) => {
    setData({
      ...data,
      industry: item,
    });
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
          document.getElementById("alert").style.display = "flex";
          setTimeout(() => {
            if (document.getElementById("alert")) {
              document.getElementById("alert").style.display = "none";
            }
          }, 4000);
          axios.get(`${domain}/api/company/companyData`, config).then((res) => {
            setData({
              ...data,
              name: res.data.userName,
              email: res.data.emailId,
              phone: res.data.phoneNo,
              companyType: res.data.company[0].companyType,
              companyName: res.data.company[0].companyName,
              companyPhone: res.data.company[0].phoneNo,
              companyEmail: res.data.company[0].emailId,
              contactPerson: res.data.company[0].contactPersonName,
              gstNo: res.data.company[0].gstNo ? res.data.company[0].gstNo : "",
              industry: res.data.company[0].industry,
              profilePic: res.data.profilePic,
              coverPic: res.data.coverPic,
            });
            setLoadingImage(false);
          });
        });
    } else {
      document.getElementById("otp_error").innerHTML = "OTP doesn't match";
      document.getElementById("otp_error").style.display = "block";
    }
  };
  return (
    <div onClick={clicked}>
      <Alert
        severity="success"
        style={{ display: "none", marginBottom: "10px" }}
        id="alert"
      >
        Successfully updated your profile information.
      </Alert>
      <Alert
        severity="success"
        style={{ display: "none", marginBottom: "10px" }}
        id="successalert"
      >
        Your dashboard has been successfully setup!! Thank you for completing.
        Create job using this{" "}
        <Link href="/job/create">
          <a className="link">link</a>
        </Link>
      </Alert>
      <div style={{ position: "relative" }}>
        <label>
          <EditIcon className={DashCss.coverEdit} />

          <input
            type="file"
            alt="profile-img"
            accept=".jpg, .jpeg, .png, .webp"
            style={{ display: "none" }}
            onChange={handleFileChange}
            id="cover_pic_input"
          />
        </label>
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
            style={{ background: "white" }}
            data-src=""
            loading="lazy"
          />
        )}
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
            <input
              type="file"
              alt="profile-img"
              accept=".jpg, .jpeg, .png, .webp"
              style={{ display: "none" }}
              onChange={handleFileChange2}
              id="profile_pic_input"
            />
            <EditIcon className={DashCss.profileEdit} />
          </label>
        </div>
      </div>

      <div className={DashCss.heading}>Basic Information</div>

      {!edit ? (
        <button className={DashCss.editButton} onClick={() => setEdit(true)}>
          Edit
        </button>
      ) : (
        <div style={{ height: "30px" }}></div>
      )}
      <Grid container rowSpacing={0} columnSpacing={3}>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <div>
            <label className="inputLabel" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              className="inputBox"
              value={data.name}
              onChange={changeHandler}
              id="name"
              disabled={!edit}
              placeholder="Use only Alphabets, Integers, '-', ' ' and '_'"
            />
            <div className="input_error_msg" id="name_error">
              Name is required
            </div>
          </div>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
          <div>
            {edit && (
              <div
                style={{ float: "right", cursor: "pointer", color: "#00e7fc" }}
                onClick={() => setEmailChangePopup(true)}
              >
                Change
              </div>
            )}

            <label className="inputLabel" htmlFor="email">
              Email ID
            </label>
            <input
              type="email"
              className="inputBox"
              value={data.email}
              onChange={changeHandler}
              id="email"
              disabled
            />
            <div className="input_error_msg" id="email_error">
              Email is required
            </div>
          </div>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
          <div>
            <label className="inputLabel" htmlFor="phone">
              Phone No
            </label>
            <input
              type="number"
              className="inputBox"
              value={data.phone}
              onChange={changeHandler}
              id="phone"
              disabled={!edit}
              onWheel={(e) => e.target.blur()}
            />
            <div className="input_error_msg" id="phone_error">
              Phone is required
            </div>
          </div>
        </Grid>
      </Grid>
      <div className={DashCss.heading}>Additional Information</div>
      <Grid container rowSpacing={0} columnSpacing={3}>
        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
          <div
            className={
              data.companyType == "company"
                ? "radioCompanyActive "
                : "radioCompany"
            }
            onClick={() => changeCompanyType("company")}
          >
            <Radio
              checked={data.companyType == "company"}
              value="b"
              name="radio-buttons"
            />{" "}
            Company
          </div>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
          <div
            className={
              data.companyType == "consultant"
                ? "radioCompanyActive "
                : "radioCompany"
            }
            onClick={() => changeCompanyType("consultant")}
          >
            <Radio
              checked={data.companyType == "consultant"}
              value="b"
              name="radio-buttons"
            />
            Consultant
          </div>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
          <div>
            <label className="inputLabel" htmlFor="companyName">
              Organisation Name
            </label>
            <input
              type="text"
              className="inputBox"
              value={data.companyName}
              onChange={changeHandler}
              id="companyName"
              disabled={!edit}
            />
            <div className="input_error_msg" id="companyName_error">
              CompanyName is required
            </div>
          </div>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
          <div style={{ position: "relative" }}>
            <label className="inputLabel" htmlFor="industry">
              Industry
            </label>
            <input
              type="text"
              className="inputBox"
              value={data.industry}
              onChange={changeHandler}
              id="industry"
              disabled={!edit}
              style={{ marginBottom: "0px" }}
              autoComplete="off"
            />
            {typeof window !== "undefined" &&
            document.getElementById("industry") === document.activeElement &&
            data.industry !== "" ? (
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e7e7e7",
                  width: "100%",
                  maxHeight: "150px",
                  overflow: "auto",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  borderRadius: "0px 0px 10px 10px",
                }}
                id="dropDown"
              >
                {industries.map((item, i) => {
                  return (
                    <div
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid gray",
                        cursor: "pointer",
                      }}
                      key={i}
                      id={`options/${item._id}`}
                      onMouseOver={() => MouseIned(item._id)}
                      onMouseOut={() => MouseOuted(item._id)}
                      onClick={() => changeIndustry(item.industry)}
                    >
                      {item.industry}
                    </div>
                  );
                })}
              </div>
            ) : (
              <></>
            )}
            <div className="input_error_msg" id="industry_error">
              Industry is required
            </div>
          </div>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
          <div>
            <label className="inputLabel" htmlFor="companyPhone">
              Official Contact No
            </label>
            <input
              type="number"
              className="inputBox"
              value={data.companyPhone}
              onChange={changeHandler}
              id="companyPhone"
              disabled={!edit}
              onWheel={(e) => e.target.blur()}
            />
            <div className="input_error_msg" id="companyPhone_error">
              companyPhone is required
            </div>
          </div>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
          <div>
            <label className="inputLabel" htmlFor="companyEmail">
              Official Email ID
            </label>
            <input
              type="email"
              className="inputBox"
              value={data.companyEmail}
              onChange={changeHandler}
              id="companyEmail"
              disabled={!edit}
            />
            <div className="input_error_msg" id="companyEmail_error">
              companyEmail is required
            </div>
          </div>
        </Grid>

        <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
          <div>
            <label className="inputLabel" htmlFor="contactPerson">
              Contact Person Name
            </label>
            <input
              type="text"
              className="inputBox"
              value={data.contactPerson}
              onChange={changeHandler}
              id="contactPerson"
              disabled={!edit}
              placeholder="Use only Alphabets, Integers, '-', ' ' and '_'"
            />
            <div className="input_error_msg" id="contactPerson_error">
              contact Person is required
            </div>
          </div>
        </Grid>
      </Grid>
      {edit ? (
        <button className={DashCss.saveBtn} onClick={submit}>
          Save Changes
        </button>
      ) : (
        <></>
      )}
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
Index.Layout = CompanyAccount;
export default Index;
