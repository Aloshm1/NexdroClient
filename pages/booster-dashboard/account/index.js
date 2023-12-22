import React, { useEffect, useState } from "react";
import BoosterAccount from "../../../components/layouts/BoosterAccount";
import DashCss from "../../../styles/pilotDashboard.module.css";
import DashCss1 from "../../../styles/companyDashboard.module.css";
import io from "socket.io-client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Grid, Box, Button, Slider } from "@mui/material";
import axios from "axios";
import Router from "next/router";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Link from "next/link";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AvatarEditor from "react-avatar-editor";
var socket, selectedChatCompare;
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const localhost = process.env.NEXT_PUBLIC_LOCALHOST;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Index() {
  let [loadingImage, setLoadingImage] = useState(false);
  const allowedFormats = ["jpg", "jpeg", "png", "webp"];
  const [open, setOpen] = React.useState(true);
  const [formatError, setFormatError] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    setLoadingImage(true);
    if (localStorage.getItem("profileCreated") == "true") {
      document.getElementById("successalert").style.display = "flex";
      setTimeout(() => {
        if (document.getElementById("successalert")) {
          document.getElementById("successalert").style.display = "none";
        }
      }, 5000);
    }
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/user/getBooster`, config).then((response) => {
      console.log(response);
      let data = response.data;
      setData({
        name: data.name,
        email: data.email,
        phoneNo: data.phoneNo,
        profilePic: data.profilePic,
        coverPic: data.coverPic,
        userName: "",
        dob: data.dob,
        gender: "",
        city: data.city || "",
        country: data.country,
        bio: data.bio || "",
      });
      setLoadingImage(false);
    });
  }, []);
  let [edit, setEdit] = useState(false);
  let [coverUpdateLoading, setCoverUpdateLoading] = useState(false);
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
          console.log(res.data);
          // setProfileSuccess(true);
          localStorage.setItem("profileChanged", "changed");
          axios
            .get(`${domain}/api/company/companyData`, config)
            .then((response) => {
              console.log(response.data);
              socket = io(localhost);
              socket.emit("reloadMyData", response.data._id);
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
  let [data, setData] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNo: "",
    dob: "",
    gender: "",
    city: "",
    country: "",
    bio: "",
    profilePic: "",
    coverPic: "",
  });
  let changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };
  let submit = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    let fields = ["name", "email", "phoneNo", "dob", "city", "country", "bio"];
    var focusField = "";
    for (let i = 0; i < fields.length; i++) {
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
        "Characters should be 3 to 25";
      document.getElementById("name_error").style.display = "block";
      if (focusField == "") {
        focusField = "name";
      }
    }

    if (data.email !== "" && !validateEmail(data.email)) {
      document.getElementById("email_error").innerHTML = "Invalid Email Id";
      document.getElementById("email_error").style.display = "block";
      if (focusField == "") {
        focusField = "email";
      }
    }
    if (
      data.phoneNo !== "" &&
      (data.phoneNo.length < 7 || data.phoneNo.length > 14)
    ) {
      document.getElementById("phoneNo_error").innerHTML = "Invalid Phone No";
      document.getElementById("phoneNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "phoneNo";
      }
    }
    if (data.city !== "" && (data.city.length < 3 || data.city.length > 100)) {
      document.getElementById("city_error").innerHTML =
        "Characters should be 3 to 100";
      document.getElementById("city_error").style.display = "block";
      if (focusField == "") {
        focusField = "city";
      }
    }
    if (
      data.country !== "" &&
      (data.country.length < 3 || data.country.length > 100)
    ) {
      document.getElementById("country_error").innerHTML =
        "Characters should be 3 to 100";
      document.getElementById("country_error").style.display = "block";
      if (focusField == "") {
        focusField = "country";
      }
    }
    if (data.bio !== "" && (data.bio.length < 50 || data.bio.length > 1000)) {
      document.getElementById("bio_error").innerHTML =
        "Characters should be 50 to 1000";
      document.getElementById("bio_error").style.display = "block";
      if (focusField == "") {
        focusField = "bio";
      }
    }
    if (focusField !== "") {
      document.getElementById(focusField).focus();
    } else {
      axios
        .post(
          `${domain}/api/user/updateBasicInfo`,
          {
            name: data.name,
            emailId: data.email,
            phoneNo: data.phoneNo,
            dob: data.dob,
            city: data.city,
            bio: data.bio,
          },
          config
        )
        .then((res) => {
          console.log(res);
          window.scrollTo(0, 0);
          setEdit(false);
          document.getElementById("alert1").style.display = "flex";
          setTimeout(() => {
            if (document.getElementById("alert1")) {
              document.getElementById("alert1").style.display = "none";
            }
          }, 4000);
        });
    }
  };

  return (
    <div>
      <Alert
        severity="success"
        id="alert"
        sx={{ margin: "20px 0px", display: "none" }}
      >
        Your dashboard has been successfully created!! Enjoy ! :)
      </Alert>
      <Alert
        severity="success"
        id="alert1"
        sx={{ margin: "20px 0px", display: "none" }}
      >
        Your data has been succcessfully submitted
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
        <div className={DashCss.editButton} onClick={() => setEdit(true)}>
          Edit
        </div>
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
              <label className="inputLabel" htmlFor="email">
                Email Id
              </label>
              <input
                type="email"
                className="inputBox"
                id="email"
                value={data.email}
                onChange={changeHandler}
                disabled={!edit}
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
                type="number"
                className="inputBox"
                id="phoneNo"
                value={data.phoneNo}
                onChange={changeHandler}
                disabled={!edit}
                onWheel={(e) => e.target.blur()}
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
              />
              <div className="input_error_msg" id="dob_error">
                dob is required
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
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <div>
              <label className="inputLabel" htmlFor="bio">
                Bio
              </label>
              <textarea
                type="text"
                className="inputBox"
                style={{ height: "150px", resize: "none", paddingTop: "10px" }}
                id="bio"
                value={data.bio}
                onChange={changeHandler}
                disabled={!edit}
              />
              <div className="input_error_msg" id="bio_error">
                Bio is required
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
      {edit ? (
        <div className={DashCss.saveBtn} onClick={submit}>
          Save Changes
        </div>
      ) : (
        <></>
      )}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon className="popupClose" onClick={handleClose} />
          <div className={DashCss1.title}>
            Upgrade to any role to access more
          </div>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <div
                className={DashCss.popupBorderBox}
                style={{ height: "100%" }}
              >
                <div className={DashCss.popupFreeBooster}>Free</div>
                <div
                  className={DashCss.popupTitleBooster}
                  style={{ height: "initial" }}
                >
                  Want to show your talent by uploading Creatives?
                </div>
                <Link href="/create-pilot">
                  <div className={DashCss.popupBtnBooster}>Become a Pilot</div>
                </Link>
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <div
                className={DashCss.popupBorderBox}
                style={{ height: "100%" }}
              >
                <div className={DashCss.popupFreeBooster}>Free</div>
                <div
                  className={DashCss.popupTitleBooster}
                  style={{ height: "initial" }}
                >
                  Want to list your service center?
                </div>
                <Link href="/create-center">
                  <div className={DashCss.popupBtnBooster}>Register Now</div>
                </Link>
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <div
                className={DashCss.popupBorderBox}
                style={{ height: "100%" }}
              >
                <div className={DashCss.popupFreeBooster}>Free</div>
                <div
                  className={DashCss.popupTitleBooster}
                  style={{ height: "initial" }}
                >
                  Want to post Jobs and hire Droner Pilots?
                </div>
                <Link href="/create-company">
                  <div className={DashCss.popupBtnBooster}>Register Now</div>
                </Link>
              </div>
            </Grid>
          </Grid>
        </div>
      </Dialog>
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
    </div>
  );
}
Index.Layout = BoosterAccount;
export default Index;
