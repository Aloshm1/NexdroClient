import React, { useState, useEffect } from "react";
import CenterAccount from "../../../components/layouts/CenterAccount";
import DashCss from "../../../styles/pilotDashboard.module.css";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneIcon from '@mui/icons-material/Done';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-autocomplete-places";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import io from "socket.io-client";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AvatarEditor from "react-avatar-editor";
import { Alert, Grid, Box, Button, Slider } from "@mui/material";
import Router from "next/router";
var socket, selectedChatCompare;
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const localhost = process.env.NEXT_PUBLIC_LOCALHOST;
const allowedFormats = ["jpg", "jpeg", "png", "webp"];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Index() {
  let [loadingImage, setLoadingImage] = useState(false)
  const [formatError, setFormatError] = useState(false);
  const [formatError2, setFormatError2] = useState(false);
  let [slug, setSlug] = useState("")
  const currentYear = new Date().getFullYear()
  useEffect(() => {
    setLoadingImage(true)
    if (localStorage.getItem("profileCreated") == "true") {
      document.getElementById("successalert").style.display = "flex";
     
    }
    if (localStorage.getItem("profileCreated")) {
      localStorage.removeItem("profileCreated");
    }
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/brand/getBrands`).then((res) => {
      setBrands(res.data);
    });
    axios.post(`${domain}/api/center/getCenterData`, config).then((res) => {
      let center_data = res.data;
      console.log(res.data);
      setSlug(res?.data?.centerData?.slug)
      console.log("Profilepic: ", res?.data?.centerData?.profilePic);
      console.log("Coverpic: ", res?.data?.centerData?.coverPic);
      setData({
        name: center_data.userName,
        email: center_data.userEmail,
        centerEmailId: center_data?.centerData?.email,
        phoneNo: center_data?.userPhoneNo,
        centerPhoneNo: center_data?.centerData?.phoneNo,
        secondaryPhoneNo: center_data?.centerData?.secondaryNumber
          ? center_data?.centerData?.secondaryNumber
          : "",
        whatsappNo: center_data?.centerData?.whatsappNo
          ? center_data?.centerData?.whatsappNo
          : "",
        website: center_data?.centerData?.website
          ? center_data?.centerData?.website
          : "",
        location: center_data?.centerData?.address,
        description: center_data?.centerData?.description,
        profilePic: `${center_data?.centerData?.profilePic}`,
        coverPic: `${center_data?.centerData?.coverPic}`,
        // holidays: center_data.centerData.holidays,
        // brands: center_data.centerData.brandOfDrones,
        centerName: center_data?.centerData?.centerName,
        street: center_data?.centerData?.streetName,
        establishedYear: center_data?.centerData?.establishedYear,
        workingFrom: center_data?.centerData?.workingHours.slice(0, 5),
        workingTill: center_data?.centerData?.workingHours.slice(8, 13),
      });
      setLoadingImage(false)
      setOldPhotos(center_data?.centerData?.images);
      setHolidays(center_data?.centerData?.holidays);
      setSelectedBrands(center_data?.centerData?.brandOfDrones);
    });
  }, []);
  let [oldPhotos, setOldPhotos] = useState([]);
  let [allBrands, setAllBrands] = useState(false);
  let [coverUpdateLoading, setCoverUpdateLoading] = useState(false);
  let [edit, setEdit] = useState(false);

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
        .post(
          `${domain}/api/user/updateCoverPupdateCoverPicServiceCenteric`,
          formData,
          config
        )
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
            .post(`${domain}/api/center/getCenterData`, config)
            .then((response) => {
              console.log(
                "Updated CoverPic : ",
                response.data.centerData.coverPic
              );
              setData({
                ...data,
                coverPic: `${response.data.centerData.coverPic}`,
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
        .post(
          `${domain}/api/user/updateProfilePicServiceCenter`,
          formData,
          config
        )
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
          localStorage.setItem("profileChanged", "changed")
          axios
            .post(`${domain}/api/center/getCenterData`, config)
            .then((response) => {
              socket = io(localhost);
              socket.emit("reloadMyData", response.data.centerData.userId);
              console.log(
                "Updated profilepic : ",
                response.data.centerData.profilePic
              );
              setData({
                ...data,
                profilePic: `${response.data.centerData.profilePic}`,
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
    var fileFormat = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase()
    console.log(fileFormat)
    if (
      allowedFormats.includes(fileFormat) && (file.type.includes("image"))
    ){
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
  }else{
    setFormatError(true)
  }
  document.getElementById(e.target.id).value = "";
  };
  const handleFileChange = (e) => {
    let file = e.target.files[0];
    var fileFormat = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase()
    console.log(fileFormat)
    if (
      allowedFormats.includes(fileFormat) && (file.type.includes("image"))
    ){
    console.log("Cover pic");
    const img = new Image();
    img.onload = function () {
      if (img.width >= 1200 && img.height >= 350) {
        let url = URL.createObjectURL(file);
        console.log(url);
        setPicture({
          ...picture,
          img: url,
          cropperOpen: true,
        });
      } else {
        alert("Cover Image size must be minimum 1200x350");
      }
    };
    img.src = window.URL.createObjectURL(e.target.files[0]);
  }else{
    setFormatError(true)
  }
    document.getElementById(e.target.id).value = "";
  };

  let [data, setData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    centerName: "",
    centerPhoneNo: "",
    centerEmailId: "",
    location: "",
    street: "",
    establishedYear: "",
    workingFrom: "",
    workingTill: "",
    description: "",
    secondaryPhoneNo: "",
    whatsappNo: "",
    website: "",
  });
  let handleChange1 = (address) => {
    document.getElementById("location_error").style.display = "none";
    if (edit) {
      setData({
        ...data,
        location: address,
      });
    }
  };

  let handleSelect = (address) => {
    if (edit) {
      setData({
        ...data,
        location: address,
      });
    }
  };
  let changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";

    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };
  let totalDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let [holidays, setHolidays] = useState(["Saturday", "Sunday"]);
  let [selectedPhotos, setSelectedPhotos] = useState([]);
  let addPhoto = (e) => {
    document.getElementById("photos_error").style.display = "none";
    let selectFiles = selectedPhotos.length + oldPhotos.length;
    let tempArr = [];
    let otherFiles = e.target.files.length;
    if (selectFiles + otherFiles > 6) {
      document.getElementById("photos_error").innerHTML =
        "Cannot upload more than 6 images";
      document.getElementById("photos_error").style.display = "block";
    } else {
      for (let i = 0; i < e.target.files.length; i++) {
        if (e.target.files[i].size / 1000000 <= 2) {
          var fileFormat = e.target.files[i].name.substring(e.target.files[i].name.lastIndexOf(".") + 1).toLowerCase()
      console.log(fileFormat)
        if (
          allowedFormats.includes(fileFormat) && (e.target.files[i].type.includes("image"))
        ){
            tempArr.push(e.target.files[i]);
        }else{
          setFormatError2(true)
        }
        } else {
          document.getElementById("photos_error").innerHTML =
            "File Size exceeded 2MB";
          document.getElementById("photos_error").style.display = "block";
          setTimeout(()=>{
            document.getElementById("photos_error").style.display = "none";
          },3000)
        }
      }
      document.getElementById(e.target.id).value = ""
    }

    setSelectedPhotos([...selectedPhotos, ...tempArr]);
  };
  let removeImage = (index) => {
    if (edit) {
      let arr = selectedPhotos;
      arr.splice(index, 1);
      setSelectedPhotos([...arr]);
    }
  };
  let changeHoliday = (day) => {
    if (edit) {
      let arr = holidays;
      if (!holidays.includes(day)) {
        arr.push(day);
      } else {
        arr = arr.filter((item) => item !== day);
      }
      console.log(arr);
      setHolidays([...arr]);
    }
  };
  let [selectedBrands, setSelectedBrands] = useState([]);
  let [brands, setBrands] = useState([]);
  let addToBrand = (brand, id) => {
    if (edit) {
      document.getElementById("brands_error").style.display = "none";
      let arr = selectedBrands;
      arr.push(brand);

      setSelectedBrands([...arr]);
      //removing
      brands.splice(
        brands.findIndex((e) => e.brand === brand),
        1
      );
      setBrands([...brands]);
    }
  };
  let removeFromMyBrands = (brand) => {
    if (edit) {
      selectedBrands.splice(
        selectedBrands.findIndex((e) => e === brand),
        1
      );
      setSelectedBrands([...selectedBrands]);
    }
  };
  let addBrand = (e) => {
    if (edit) {
      document.getElementById("brands_error").style.display = "none";
      if (e.key == "Enter" && e.target.value.trim() !== "") {
        if (!selectedBrands.includes(e.target.value)) {
          let arr = selectedBrands;
          arr.push(e.target.value);
          document.getElementById("brands").value = "";
          setSelectedBrands([...arr]);
        } else {
          document.getElementById("brands").value = "";
        }
      }
    }
  };
  let removeOldImages = (item) => {
    if (edit) {
      let arr = oldPhotos;
      arr = arr.filter((e) => e !== item);
      setOldPhotos([...arr]);
    }
  };
  let submit = () => {
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    const validateURL = (url) => {
      return String(url)
        .toLowerCase()
        .match(
          /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm
        );
    };
    var focusField = "";
    let fields = [
      "name",
      "email",
      "phoneNo",
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
    if (selectedBrands.length === 0) {
      document.getElementById("brands_error").innerHTML =
        "Select atleast one brand";
      document.getElementById("brands_error").style.display = "block";
      if (focusField == "") {
        focusField = "brands";
      }
    }
    if (selectedPhotos.length + oldPhotos.length === 0) {
      document.getElementById("photos_error").innerHTML =
        "Select atleast one Photo";
      document.getElementById("photos_error").style.display = "block";
      if (focusField == "") {
        focusField = "photos";
      }
    }
    if (data.name !== "" && (data.name.length < 3 || data.name.length > 25)) {
      document.getElementById("name_error").innerHTML =
        "Characters should be between 3 - 25";
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
      data.email !== "" &&
      validateEmail(data.email) &&
      data.email.length > 100
    ) {
      document.getElementById("email_error").innerHTML =
        "Email should be maximum 100";
      document.getElementById("email_error").style.display = "block";
      if (focusField == "") {
        focusField = "email";
      }
    }
    if (data.phoneNo !== "" && data.phoneNo.length < 7 || data.phoneNo.length > 14) {
      document.getElementById("phoneNo_error").innerHTML =
        "Phone No is not valid";
      document.getElementById("phoneNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "phoneNo";
      }
    }
    if (data.phoneNo !== "" && Number(data.phoneNo <= 0)) {
      document.getElementById("phoneNo_error").innerHTML =
        "Phone No is not valid";
      document.getElementById("phoneNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "phoneNo";
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
    if (data.centerPhoneNo !== "" && data.centerPhoneNo.length < 7 || data.centerPhoneNo.length > 14) {
      document.getElementById("centerPhoneNo_error").innerHTML =
        "Center Phone No is not valid";
      document.getElementById("centerPhoneNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "centerPhoneNo";
      }
    }
    if (data.centerPhoneNo !== "" && Number(data.centerPhoneNo) <= 0) {
      document.getElementById("centerPhoneNo_error").innerHTML =
        "Center Phone No is not valid";
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
        "Center Email ID should be maximum 100";
      document.getElementById("centerEmailId_error").style.display = "block";
      if (focusField == "") {
        focusField = "centerEmailId";
      }
    }
    if (
      data.location !== "" &&
      (data.location.length > 100 || data.location.length < 3)
    ) {
      document.getElementById("location_error").innerHTML =
        "Characters should be between 3 - 100";
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
      data.establishedYear !== "" &&
      (Number(data.establishedYear) < 1900 || Number( data.establishedYear )> currentYear)
    ) {
      document.getElementById("establishedYear_error").innerHTML =
        ` year shuld be between 1900 - ${currentYear}`;
      document.getElementById("establishedYear_error").style.display = "block";
      if (focusField == "") {
        focusField = "establishedYear";
      }
    }
    if (
      data.workingFrom !== "" &&
      data.workingTill !== "" &&
      data.workingFrom >= data.workingTill
    ) {
      document.getElementById("workingFrom_error").innerHTML =
        "Working From should be lesser then working till";
      document.getElementById("workingFrom_error").style.display = "block";
      if (focusField == "") {
        focusField = "workingFrom";
      }
    }
    if (
      data.description !== "" &&
      (data.description.length < 100 || data.description.length > 1500)
    ) {
      document.getElementById("description_error").innerHTML =
        "Characters should be between 100 - 1500";
      document.getElementById("description_error").style.display = "block";
      if (focusField == "") {
        focusField = "description";
      }
    }
    if (data.secondaryPhoneNo !== "" && data.secondaryPhoneNo.length !== 10) {
      document.getElementById("secondaryPhoneNo_error").innerHTML =
        "Secondary Phone No should be of 10 digits";
      document.getElementById("secondaryPhoneNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "secondaryPhoneNo";
      }
    }
    if (data.secondaryPhoneNo !== "" && Number(data.secondaryPhoneNo) <= 0) {
      document.getElementById("secondaryPhoneNo_error").innerHTML =
        "Secondary Phone No is not valid";
      document.getElementById("secondaryPhoneNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "secondaryPhoneNo";
      }
    }
    if (data.whatsappNo !== "" && data.whatsappNo.length !== 10) {
      document.getElementById("whatsappNo_error").innerHTML =
        "Whatsapp No should be of 10 digits";
      document.getElementById("whatsappNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "whatsappNo";
      }
    }
    if (data.whatsappNo !== "" && Number(data.whatsappNo) <= 0) {
      document.getElementById("whatsappNo_error").innerHTML =
        "Whatsapp No is not valid";
      document.getElementById("whatsappNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "whatsappNo";
      }
    }
    if (data.website !== "" && !validateURL(data.website)) {
      document.getElementById("website_error").innerHTML =
        "Website is not valid";
      document.getElementById("website_error").style.display = "block";
      if (focusField == "") {
        focusField = "website";
      }
    }
    if (
      data.website !== "" &&
      (data.website.length < 3 || data.website.length > 100)
    ) {
      document.getElementById("website_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("website_error").style.display = "block";
      if (focusField == "") {
        focusField = "website";
      }
    }

    if (focusField !== "") {
      console.log(focusField);
      if (focusField == "photos") {
      } else {
        document.getElementById(focusField).focus();
      }
    } else {
      if (focusField == "photos") {
      } else {
        var formData = new FormData();
        formData.append("userName", data.name);
        formData.append("userEmail", data.email);
        formData.append("email", data.centerEmailId);
        formData.append("userPhone", data.phoneNo);
        formData.append("phoneNo", data.centerPhoneNo);
        formData.append("secondaryNumber", data.secondaryPhoneNo);
        formData.append("whatsappNo", data.whatsappNo);
        formData.append("website", data.website);
        formData.append("address", data.location);
        formData.append("description", data.description);
        formData.append("holidays", holidays);
        formData.append("brandOfDrones", selectedBrands);
        formData.append("oldImages", oldPhotos);
        selectedPhotos.forEach((file) => {
          formData.append("file", file);
        });
        formData.append("centerName", data.centerName);
        formData.append("streetName", data.street);
        formData.append("establishedYear", data.establishedYear);
        formData.append(
          "workingHours",
          data.workingFrom + " - " + data.workingTill
        );
      }
      //
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      window.scroll(0, 0);

      axios
        .post(`${domain}/api/center/updateData`, formData, config)
        .then((res) => {
          document.getElementById("alert").style.display = "flex";
          console.log(res);
          setTimeout(() => {
            setEdit(false);
            if (document.getElementById("alert")) {
              document.getElementById("alert").style.display = "none";
            }
          }, 4000);
        });
    }
  };
  let redirectSlug = ()=>{
    Router.push(`/service-center/${slug}`)
  }
  return (
    <>
      <div>
        <Alert
          severity="success"
          style={{ display: "none", marginBottom: "10px" }}
          id="alert"
        >
          successfully updated your information!
        </Alert>
        <Alert
          severity="success"
          style={{display:"none", marginBottom: "10px" }}
          id="successalert"
        >
          Your dashboard has been successfully setup!! CLick <span style={{textDecoration:"underline", cursor:"pointer"}} onClick={redirectSlug}>here</span>  to see your center.
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
            {
          loadingImage ? 
          <Skeleton
                    style={{
                    width: "100%",
                    height: "220px",
                    }}
                  />  : <img
                  src={`${imageLink}/${data.coverPic}`}
                  className={DashCss.coverImage}
                  style={{ background: "white" }}
                  data-src=""
                  loading="lazy"
                /> 
        }
       
          <div style={{ position: "relative" }}>
          <div className={DashCss.imageLoderDIv}>
          {
            loadingImage ? 
            <Skeleton
                    style={{
                    width: "150px",
                    height: "150px",
                      borderRadius: "75px",
                      marginBottom: "20px",
                    }}
                  /> :  <img
                  src={`${imageLink}/${data.profilePic}`}
                  className={DashCss.profileImage}
                  data-src=""
                  loading="lazy"
                  style = {{background: 'white'}}
                />
          }
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
          <div style = {{height: "30px"}}></div>
        )}
        <div>
          <Grid container rowSpacing={0} columnSpacing={2}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
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
              />
              <div className="input_error_msg" id="name_error">
                Name is required
              </div>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <label className="inputLabel" htmlFor="email">
                Email Id
              </label>
              <input
                type="email"
                className="inputBox"
                value={data.email}
                onChange={changeHandler}
                id="email"
                disabled={!edit}
              />
              <div className="input_error_msg" id="email_error">
                Email is required
              </div>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <label className="inputLabel" htmlFor="phoneNo">
                Phone No
              </label>
              <input
                type="number"
                className="inputBox"
                value={data.phoneNo}
                onChange={changeHandler}
                id="phoneNo"
                disabled={!edit}
                onWheel={(e) => e.target.blur()}
              />
              <div className="input_error_msg" id="phoneNo_error">
                PhoneNo is required
              </div>
            </Grid>
          </Grid>
        </div>
        <div className={DashCss.heading}>Center Information</div>
        <div>
          <Grid container rowSpacing={0} columnSpacing={2}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <label className="inputLabel" htmlFor="centerName">
                Service Center Name
              </label>
              <input
                type="text"
                className="inputBox"
                id="centerName"
                value={data.centerName}
                onChange={changeHandler}
                disabled={!edit}
              />
              <div className="input_error_msg" id="centerName_error">
                CenterName is required
              </div>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <label className="inputLabel" htmlFor="centerPhoneNo">
                Business Phone No
              </label>
              <input
                type="number"
                className="inputBox"
                id="centerPhoneNo"
                value={data.centerPhoneNo}
                onChange={changeHandler}
                disabled={!edit}
                onWheel={(e) => e.target.blur()}
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
                    <div style={{ position: "relative", height: "100%" }}>
                      <input
                        {...getInputProps({
                          placeholder: "Search Places ...",
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
                disabled={!edit}
                onWheel={(e) => e.target.blur()}
              />
              <div className="input_error_msg" id="establishedYear_error">
                establishedYear is required
              </div>
            </Grid>
           
          </Grid>
          <label className="inputLabel">Working Hours</label>
                <Grid container columnSpacing={2}>
                  <Grid item xl={5.5} lg={5.5} md={5.5} sm={5.5} xs={5.5}>
                  <input
                      type="time"
                      className="inputBox"
                      id="workingFrom"
                      value={data.workingFrom}
                      onChange={changeHandler}
                    />
                    <div className="input_error_msg" id="workingFrom_error">
                      workingFrom is required
                    </div>
                  </Grid>
                  <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                  <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"8px"}}>to</div>
                  </Grid>
                  <Grid item xl={5.5} lg={5.5} md={5.5} sm={5.5} xs={5.5}>
                  <input
                      type="time"
                      className="inputBox"
                      id="workingTill"
                      value={data.workingTill}
                      onChange={changeHandler}
                    />
                    <div className="input_error_msg" id="workingTill_error">
                      workingTill is required
                    </div>
                  </Grid>
                </Grid>

          <div>
            <label className="inputLabel">
              Working days
            </label>
            <div style={{ display: "inline" }}>
              <div>
                {totalDays.map((day, i) => {
                  return (
                    <div
                      className={
                        holidays.includes(day) ? "dayBadgeActive" : "dayBadge"
                      }
                      key={i}
                      onClick={() => changeHoliday(day)}
                    >
                      {day}&nbsp;
                            {
                              holidays.includes(day) ? <CloseRoundedIcon sx={{fontSize:"16px"}} /> : <DoneIcon sx={{fontSize:"16px"}} />
                            }
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Grid container rowSpacing={0} columnSpacing={2}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <label className="inputLabel" htmlFor="brands">
                Drone Brands you service
              </label>
              <input
                type="text"
                className="inputBox"
                onKeyUp={addBrand}
                id="brands"
                disabled={!edit}
                placeholder="Type and press enter to add"
              />
              <div className="input_error_msg" id="brands_error">
                Brands is required
              </div>
              <div style={{ display: "inline" }}>
                {selectedBrands.map((brand, i) => {
                  return (
                    <div
                      key={i}
                      className="dayBadge"
                      style={{ backgroundColor: "#eee" }}
                      onClick={() => removeFromMyBrands(brand)}
                    >
                      <RemoveCircleIcon  sx={{color:"#ff000080", cursor:"pointer", fontSize:"20px"}} onClick={() => removeFromMyBrands(brand)}/>&nbsp;
                      {brand}
                    </div>
                  );
                })}
              </div>
             
              
            </Grid>
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
                id="description"
                value={data.description}
                onChange={changeHandler}
                disabled={!edit}
              />
              <div className="input_error_msg" id="description_error">
                description is required
              </div>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <label className="inputLabel" htmlFor="secondaryPhoneNo">
                Secondary Phone No
              </label>
              <input
                type="text"
                className="inputBox"
                value={data.secondaryPhoneNo}
                onChange={changeHandler}
                id="secondaryPhoneNo"
                disabled={!edit}
              />
              <div className="input_error_msg" id="secondaryPhoneNo_error">
                secondaryPhoneNo is required
              </div>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <label className="inputLabel" htmlFor="whatsappNo">
                Whatsapp No
              </label>
              <input
                type="number"
                className="inputBox"
                id="whatsappNo"
                value={data.whatsappNo}
                onChange={changeHandler}
                disabled={!edit}
                onWheel={(e) => e.target.blur()}
              />
              <div className="input_error_msg" id="whatsappNo_error">
                whatsappNo is required
              </div>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <label className="inputLabel" htmlFor="website">
                Website
              </label>
              <input
                type="text"
                className="inputBox"
                id="website"
                value={data.website}
                onChange={changeHandler}
                disabled={!edit}
              />
              <div className="input_error_msg" id="website_error">
                website is required
              </div>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <label className="inputLabel">Photos</label>
              <input
                type="file"
                name=""
                id="photoInput"
                style={{ display: "none" }}
                onChange={addPhoto}
                accept=".jpg, .jpeg, .png, .webp"
                multiple
                disabled={!edit}
              />
              <div>
                <Grid container spacing={2}>
                  {oldPhotos.map((item, i) => {
                    return (
                      <Grid item xl={2} lg={2} md={2} sm={4} xs={4} key={i}>
                        <div style={{ position: "relative", height: "100%" }}>
                          <img
                            src={`${imageLink}/500x500/${item}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "5px",
                              objectFit: "cover"
                            }}
                            data-src=""
                            loading="lazy"
                          />
                          <DeleteOutlineIcon
                            style={{
                              position: "absolute",
                              right: "0px",
                              backgroundColor: "#ffffff80",
                              color: "rgb(255, 68, 68)",
                              borderRadius: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() => removeOldImages(item)}
                          />
                        </div>
                      </Grid>
                    );
                  })}
                  {selectedPhotos &&
                    selectedPhotos.map((item, i) => {
                      return (
                        <Grid item xl={2} lg={2} md={2} sm={4} xs={4} key={i}>
                          <div style={{ position: "relative", height: "100%" }}>
                            
                            <img
                              src={URL.createObjectURL(item)}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "5px",
                                objectFit: "cover"
                              }}
                              data-src=""
                              loading="lazy"
                            />
                            <DeleteOutlineIcon
                              style={{
                                position: "absolute",
                                right: "0px",
                                backgroundColor: "#ffffff80",
                                color: "rgb(255, 68, 68)",
                                borderRadius: "20px",
                                cursor: "pointer",
                              }}
                              onClick={() => removeImage(i)}
                            />
                          </div>
                        </Grid>
                      );
                    })}
                  {selectedPhotos.length + oldPhotos.length < 6 ? (
                    <Grid item xl={2} lg={2} md={2} sm={4} xs={4}>
                      <label htmlFor="photoInput" className="s_c_a_photo_add">
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#4ffea3",
                            cursor: "pointer",
                          }}
                        >
                          <AddIcon />
                        </div>
                      </label>
                    </Grid>
                  ) : (
                    <></>
                  )}
                </Grid>
                <div className="input_error_msg" id="photos_error">
                  Photos is required
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      {edit ? (
        <button
          className={DashCss.saveBtn}
          style={{ marginTop: "20px" }}
          onClick={submit}
        >
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
                  // 1200x350
                  width={900}
                  height={262}
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
          style: { width: "820px", borderRadius: "10px"},
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
          open={formatError2}
          TransitionComponent={Transition}
          onClose={() => setFormatError2(false)}
        >
          <div className="popupContainer">
            <h3 style={{ textAlign: "center" }}>
              We are removing some files due to invalid format.
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
    </>
  );
}
Index.Layout = CenterAccount;
export default Index;
