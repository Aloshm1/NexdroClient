import { Alert, Container, Grid, Box, Slider, Radio } from "@mui/material";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/createPilot.module.css";
import Button from "@mui/material/Button";
import css from "../../../styles/center.module.css";
import DroneImage from "../../../images/drone_image.png";
import image from "../../../images/drone_image.png";
import Link from "next/link";
import Head from "next/head";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Script from "next/script";
import Loader from "../../../components/loader";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-autocomplete-places";
import { Wrapper } from "@googlemaps/react-wrapper";
import axios from "axios";
import Router from "next/router";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Dropdown from "../../../components/Dropdown";
import Dropdown1 from "../../../components/Dropdown1";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import TrainingCenterAccount from "../../../components/layouts/TrainingCenterAccount";
import DashCss from "../../../styles/pilotDashboard.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DialogContent from "@mui/material/DialogContent";
import AvatarEditor from "react-avatar-editor";
import io from "socket.io-client";
import Skeleton from "react-loading-skeleton";
const imageLink = process.env.NEXT_PUBLIC_CDN;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const services = [
  "Drone repair",
  "Drone Reattach",
  "Drone modifiations",
  "Camera change",
];
function Index() {
  var socket, selectedChatCompare;
  const allowedFormats = ["jpg", "jpeg", "png", "webp"];
  let [loadingImage, setLoadingImage] = useState(false);

  const [isLoading, setLoading] = useState(false);

  let [brands, setBrands] = useState([]);
  let [allBrands, setAllBrands] = useState(false);
  const [formatError, setFormatError] = useState(false);
  let [selectedBrands1, setSelectedBrands1] = useState([]);
  let [showSuggestedBrands, setShowSuggestedBrands] = useState(false);
  let [edit, setEdit] = useState(false);
  let [coverUpdateLoading, setCoverUpdateLoading] = useState(false);
  let [infoSuccess, setInfoSuccess] = useState(false);
  let [data, setData] = useState({
    centerName: "",
    centerPhoneNo: "",
    centerEmailId: "",
    location: "",
    street: "",
    establishedYear: "",
    workingFrom: "09:00",
    workingTill: "19:00",
    description: "",
  });

  const handleFileChange = (e) => {
    let file = e.target.files[0];
    console.log("Cover pic");
    var fileFormat = file.name
      .substring(file.name.lastIndexOf(".") + 1)
      .toLowerCase();
    console.log(fileFormat);
    if (allowedFormats.includes(fileFormat) && file.type.includes("image")) {
      let img = new Image();
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
  var editor = "";
  var editor2 = "";
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
      axios.post(`${domain}/api/user/updateProfilePicCompany`, formData, config)
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
            .post(`${domain}/api/user/checkUser`, config)
            .then((response) => {
              console.log(response.data);
              socket = io(domain);
              console.log(response.data._id);
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

  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .get(`${domain}/api/trainingCenter/getTrainingCenterData`, config)
      .then((res) => {
        console.log(res);
        setData({
          ...data,
          centerName: res.data.trainingCenterData.centerName,
          centerPhoneNo: res.data.trainingCenterData.centerPhoneNo,
          centerEmailId: res.data.trainingCenterData.centerEmailId,
          location: res.data.trainingCenterData.location,
          street: res.data.trainingCenterData.street,
          establishedYear: res.data.trainingCenterData.establishedYear,
          description: res.data.trainingCenterData.description,
          profilePic: res.data.profilePic,
          coverPic: res.data.coverPic,
        });
      });
  }, []);

  let handleChange1 = (address) => {
    document.getElementById("location_error").style.display = "none";
    setData({
      ...data,
      location: address,
    });
  };

  let handleSelect = (address) => {
    console.log(address);
    setData({
      ...data,
      location: address,
    });

    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log("Success", latLng))
      .catch((error) => console.error("Error", error));
  };
  let [holidays, setHolidays] = useState(["Saturday", "Sunday"]);
  let [selectedPhotos, setSelectedPhotos] = useState([]);
  let addPhoto = (e) => {
    document.getElementById("photos_error").style.display = "none";
    let selectFiles = selectedPhotos.length;
    let tempArr = [];
    let otherFiles = e.target.files.length;
    if (selectFiles + otherFiles > 6) {
      document.getElementById("photos_error").innerHTML =
        "Cannot upload more than 6 images";
      document.getElementById("photos_error").style.display = "block";
    } else {
      for (let i = 0; i < e.target.files.length; i++) {
        if (e.target.files[i].size / 1000000 <= 2) {
          var fileFormat = e.target.files[i].name
            .substring(e.target.files[i].name.lastIndexOf(".") + 1)
            .toLowerCase();
          console.log(fileFormat);
          if (
            allowedFormats.includes(fileFormat) &&
            e.target.files[i].type.includes("image")
          ) {
            tempArr.push(e.target.files[i]);
          } else {
            setFormatError(true);
          }
        } else {
          document.getElementById("photos_error").innerHTML =
            "File Size exceeded 2MB";
          document.getElementById("photos_error").style.display = "block";
        }
      }
    }

    setSelectedPhotos([...selectedPhotos, ...tempArr]);
  };
  let removeImage = (index) => {
    let arr = selectedPhotos;
    arr.splice(index, 1);
    setSelectedPhotos([...arr]);
  };
  let changeHoliday = (day) => {
    let arr = holidays;
    if (!holidays.includes(day)) {
      arr.push(day);
    } else {
      arr = arr.filter((item) => item !== day);
    }
    console.log(arr);
    setHolidays([...arr]);
  };
  let [selectedBrands, setSelectedBrands] = useState([]);
  let [selectedServices, setSelectedServices] = useState([]);
  let changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };
  let submitData = () => {
    setLoading(true);

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    var focusField = "";
    let fields = [
      "centerName",
      "centerPhoneNo",
      "centerEmailId",
      "location",
      "street",
      "establishedYear",
      "workingFrom",
      "workingTill",
      "description",
    ];
    for (let i = 0; i < fields.length; i++) {
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

    if (
      data.centerName !== "" &&
      (data.centerName.length < 3 || data.centerName.length > 25)
    ) {
      document.getElementById("centerName_error").innerHTML =
        "Characters should be between 3 - 25";
      document.getElementById("centerName_error").style.display = "block";
      if (focusField == "") {
        focusField = "centerName";
      }
    }
    if (data.centerPhoneNo !== "" && data.centerPhoneNo.length !== 10) {
      document.getElementById("centerPhoneNo_error").innerHTML =
        "Phone No should be of 10 digits";
      document.getElementById("centerPhoneNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "centerPhoneNo";
      }
    }
    if (
      data.centerPhoneNo !== "" &&
      data.centerPhoneNo.length === 10 &&
      Number(data.centerPhoneNo) <= 0
    ) {
      document.getElementById("centerPhoneNo_error").innerHTML =
        "Phone No is not valid";
      document.getElementById("centerPhoneNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "centerPhoneNo";
      }
    }

    if (data.centerEmailId !== "" && !validateEmail(data.centerEmailId)) {
      document.getElementById("centerEmailId_error").innerHTML =
        "Invalid Email";
      document.getElementById("centerEmailId_error").style.display = "block";
      if (focusField == "") {
        focusField = "centerEmailId";
      }
    }
    if (data.centerEmailId !== "" && data.centerEmailId.length > 100) {
      document.getElementById("centerEmailId_error").innerHTML =
        "Email cannot exceed 100 characters";
      document.getElementById("centerEmailId_error").style.display = "block";
      if (focusField == "") {
        focusField = "centerEmailId";
      }
    }
    if (data.location !== "" && data.location.length > 100) {
      document.getElementById("location_error").innerHTML =
        "Location cannot exceed 100 characters";
      document.getElementById("location_error").style.display = "block";
      if (focusField == "") {
        focusField = "location";
      }
    }
    if (
      data.street !== "" &&
      (data.street.length < 3 || data.street.length > 100)
    ) {
      document.getElementById("street_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("street_error").style.display = "block";
      if (focusField == "") {
        focusField = "street";
      }
    }
    if (
      data.description !== "" &&
      (data.description.length < 100 || data.description.length > 1500)
    ) {
      document.getElementById("description_error").innerHTML =
        "Characters should be between 100 - 1500 characters";
      document.getElementById("description_error").style.display = "block";
      if (focusField == "") {
        focusField = "description";
      }
    }
    if (focusField !== "") {
      setLoading(false);
      console.log(focusField);
      if (focusField == "photos") {
      } else {
        document.getElementById(focusField).focus();
      }
    } else {
      if (focusField == "photos") {
      } else {
        const config = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        };

        var validated_data = {
          userId: data.userId,
          centerName: data.centerName,
          centerPhoneNo: data.centerPhoneNo,
          centerEmailId: data.centerEmailId,
          location: data.location,
          street: data.street,
          establishedYear: data.establishedYear,
          description: data.description,
        };
        axios
          .post(
            `${domain}/api/trainingCenter/updateTrainingCenters`,
            validated_data,
            config
          )
          .then((res) => {
            console.log(res.data);
            setLoading(false);
            setEdit(false);
            setData({
              ...data,
              centerName: res.data.trainingCenterData.centerName,
              centerPhoneNo: res.data.trainingCenterData.centerPhoneNo,
              centerEmailId: res.data.trainingCenterData.centerEmailId,
              location: res.data.trainingCenterData.location,
              street: res.data.trainingCenterData.street,
              establishedYear: res.data.trainingCenterData.establishedYear,
              description: res.data.trainingCenterData.description,
            });
            window.scrollTo(0, 0);
          })
          .catch((err) => {
            setLoading(false);
            alert("Error");
          });
      }
    }
  };
  let goBack = () => {
    Router.push("/choose-categories");
  };

  return (
    <>
      <Head></Head>
      <Container
        className="Container"
        maxWidth="xxl"
        onClick={() => setShowSuggestedBrands(false)}
      >
        <div className="rightBox mb-10" style={{ marginTop: "20px" }}>
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
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <label className="inputLabel" htmlFor="centerName">
                  Training Center Name
                </label>
                <input
                  type="text"
                  className="inputBox"
                  id="centerName"
                  value={data.centerName}
                  onChange={changeHandler}
                  placeholder="Enter your training center name"
                  disabled={!edit}
                />
                <div className="input_error_msg" id="centerName_error">
                  CenterName is required
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <label className="inputLabel" htmlFor="centerPhoneNo">
                  Business Contact No
                </label>
                <input
                  type="number"
                  className="inputBox"
                  id="centerPhoneNo"
                  value={data.centerPhoneNo}
                  onChange={changeHandler}
                  onWheel={(e) => e.target.blur()}
                  disabled={!edit}
                />
                <div className="input_error_msg" id="centerPhoneNo_error">
                  CenterPhoneNo is required
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <label className="inputLabel" htmlFor="centerEmailId">
                  Business Email Id
                </label>
                <input
                  type="email"
                  className="inputBox"
                  id="centerEmailId"
                  value={data.centerEmailId}
                  onChange={changeHandler}
                  disabled={!edit}
                />
                <div className="input_error_msg" id="centerEmailId_error">
                  CenterEmailId is required
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <label className="inputLabel" htmlFor="street">
                  Address line1
                </label>
                <input
                  type="text"
                  className="inputBox"
                  value={data.street}
                  onChange={changeHandler}
                  id="street"
                  placeholder="Enter street name, area"
                  disabled={!edit}
                />
                <div className="input_error_msg" id="street_error">
                  Street is required
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <div>
                  <label className="inputLabel" htmlFor="location">
                    Address line2
                  </label>
                  <PlacesAutocomplete
                    value={data.location}
                    onChange={handleChange1}
                    onSelect={handleSelect}
                    className="inputBox"
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div style={{ position: "relative" }}>
                        <input
                          {...getInputProps({
                            placeholder: "Enter city/country",
                            className: "location-search-input c_j_form_input ",
                          })}
                          style={{
                            marginBottom: "0px",
                          }}
                          className="inputBox"
                          id="location"
                          disabled={!edit}
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
                              suggestions.length === 0 ? "" : "1px solid grey",
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
                  </PlacesAutocomplete>
                </div>
                <div className="input_error_msg" id="location_error">
                  Location is required
                </div>
              </Grid>

              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <label className="inputLabel" htmlFor="establishedYear">
                  Established Year
                </label>
                <input
                  type="number"
                  className="inputBox"
                  id="establishedYear"
                  value={data.establishedYear}
                  onChange={changeHandler}
                  min="0"
                  placeholder="Year of center establishment"
                  onWheel={(e) => e.target.blur()}
                  disabled={!edit}
                />
                <div className="input_error_msg" id="establishedYear_error">
                  establishedYear is required
                </div>
              </Grid>
            </Grid>

            <Grid container rowSpacing={0} columnSpacing={2}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <label className="inputLabel" htmlFor="description">
                  Description
                </label>
                <textarea
                  type="text"
                  className="inputBox"
                  style={{
                    height: "150px",
                    resize: "none",
                    paddingTop: "10px",
                  }}
                  placeholder="Short description about your training center"
                  id="description"
                  value={data.description}
                  onChange={changeHandler}
                  disabled={!edit}
                />
                <div className="input_error_msg" id="description_error">
                  description is required
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
        {edit ? (
          <>
            {isLoading ? (
              <Button
                className="formBtn9 mb-10 mt-10"
                style={{ textTransform: "capitalize" }}
              >
                <Loader />
                Save Changes
              </Button>
            ) : (
              <Button
                className="formBtn9 mb-10 mt-10"
                style={{ textTransform: "capitalize" }}
                onClick={submitData}
              >
                Save Changes
              </Button>
            )}
          </>
        ) : (
          ""
        )}
        <Dialog
          open={formatError}
          TransitionComponent={Transition}
          onClose={() => setFormatError(false)}
        >
          <div className="popupContainer">
            <h3 style={{ textAlign: "center" }}>
              We are removing some files due to invalid format. You can choose
              jpg, jpeg, png and webp.
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                className="formBtn2"
                onClick={() => setFormatError(false)}
              >
                Close
              </button>
            </div>
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
      </Container>
    </>
  );
}

Index.Layout = TrainingCenterAccount;
export default Index;
