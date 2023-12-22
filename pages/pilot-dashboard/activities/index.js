import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import PilotActivities from "../../../components/layouts/PilotActivities";
import Pilot from "../../../styles/pilot.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Router from "next/router";
import Dialog from '@mui/material/Dialog';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert';
import RearrangeFiles from "../../../components/RearrangeFiles";
import Link from "next/link"
import Image from "next/image"
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Index() {
  const [open, setOpen] = React.useState(false);
  const [rearrange, setRearrange] = useState(false)
  const [rearrangedFiles, setRearrangedFiles] = useState([])

  const handleClickOpen = () => {
    setOpen(true);
  };
  const cancelRearrange = () => {
    setRearrange(false);
    window.scrollTo(0, 0);
  };

  const saveRearrange = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (rearrangedFiles.length > 0){
      let media = []
      for (var i = 0; i < rearrangedFiles.length; i++){
        media.push(rearrangedFiles[i]._id)
      }
    axios.post(`${domain}/api/rearrange/getRearrangedMedia`,{fileType: "image"}, config)
    .then((res) => {
      console.log(res)
      if (res.data === "No file available"){
        axios.post(`${domain}/api/rearrange/createRearrange`, {fileType: "image", media: media}, config)
        .then(res => {
          setApprovedImages(rearrangedFiles)
          cancelRearrange()
          console.log(res)
        })
      }else{
        axios.post(`${domain}/api/rearrange/updateRearrangeFiles`, {fileType: "image", media: media}, config)
        .then(res => {
          setApprovedImages(rearrangedFiles)
          cancelRearrange()
          console.log(res)
        })
      }
    })
    .catch(()=>{
      axios.post(`${domain}/api/rearrange/updateRearrangeFiles`, {fileType: "image", media: media}, config)
        .then(res => {
          setApprovedImages(rearrangedFiles)
          cancelRearrange()
          console.log(res)
        })
    })
    }
  }

  const handleClose = () => {
    setOpen(false);
  };
  let [tab, setTab] = useState("approved");
  let [approvedImages, setApprovedImages] = useState([]);
  let [pendingImages, setPendingImages] = useState([]);
  let [rejectedImages, setRejectedImages] = useState([])
  let [value, setValue] = useState([]);

  let getApprovedImages = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/rearrange/getRearrangedMedia`,{fileType: "image"}, config)
    .then((res) => {
      console.log(res)
      if (res.data === "No file available"){
        axios.post(`${domain}/api/image/getApprovedImages`, config).then((res) => {
          setApprovedImages(res.data);
        });
      }else{
        setApprovedImages(res.data[0].media);
      }
    })
    .catch(()=>{
      axios.post(`${domain}/api/image/getApprovedImages`, config).then((res) => {
        setApprovedImages(res.data);
      });
    })
  }

  let [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("published")){
      setUploadSuccess(true)
      localStorage.removeItem("published")
      setTimeout(()=>{
        setUploadSuccess(false)
      },4000)
    }
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    getApprovedImages()
    axios.post(`${domain}/api/image/getPendingImages`, config).then((res) => {
      setPendingImages(res.data);
    });
    axios.post(`${domain}/api/image/getRejectedImages`, config).then((res) => {
      setRejectedImages(res.data);
    });
  }, []);
  let [tempImage, setTempImage] = useState("");
  let [options, setOptions] = useState("");

  let mouseMovedIn = (id) => {
    setTempImage(id);
  };
  let showOptions = (id) => {
    setTempImage("");

    setOptions(id);
  };
  let editImage= (id) =>{
    Router.push(`/edit-file/${id}`)
  }
  let [deleteId, setDeleteId] = useState("")
  let confirmDelete = () =>{
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    console.log(tempImage)
    axios.post(`${domain}/api/image/deleteImage/${deleteId}`, config).then(res=>{
      getApprovedImages()
      axios.post(`${domain}/api/image/getPendingImages`, config).then((res) => {
        setPendingImages(res.data);
      });
      axios.post(`${domain}/api/image/getRejectedImages`, config).then((res) => {
        setRejectedImages(res.data);
      });
    })
    setOpen(false)
  }

  let sendToImageView = (id) => {
    window.open(`/image/${id}`, "_blank");
  };

  let testFunc = (items) => {
    setRearrangedFiles(items)
  }

  return (
    <div>
      {approvedImages.length > 1 && tab == "approved" && rearrange ==false && 
        <div style={{display: "flex", justifyContent: "right"}}>
          <button className="formBtn2" onClick={()=>setRearrange(true)}>Rearrange</button>
        </div>
      }
      <button
        className={Pilot.navBadge}
        onClick={() => setTab("approved")}
        style={{ backgroundColor: tab == "approved" ? "#4ffea3" : "" }}
      >
        Approved
      </button>
      <button
        className={Pilot.navBadge}
        onClick={() => setTab("pending")}
        style={{ backgroundColor: tab == "pending" ? "#4ffea3" : "" }}
      >
        Pending
      </button>
      <button
        className={Pilot.navBadge}
        onClick={() => setTab("rejected")}
        style={{ backgroundColor: tab == "rejected" ? "#4ffea3" : "" }}
      >
        Rejected
      </button>
      
      {tab == "approved" ? (
        <>
          {rearrange
            ?<div style = {{marginTop: "30px"}}><RearrangeFiles
            type="images"
            cancelButton={
              <button className="r_f_cancel_btn" onClick={cancelRearrange}>
                Cancel
              </button>
            }
            saveButton={
              <button className="r_f_save_btn" onClick={saveRearrange}>
                Save
              </button>
            }
            testBtn = {testFunc}
            changeValue={setValue}
          /></div>
            :<div style={{ marginTop: "20px" }}>
            {
              approvedImages.length === 0 ? 
              <Alert severity="info">No approved Images Yet</Alert>
              :<></>
            }
            {uploadSuccess &&
              <Alert severity = "success" style = {{marginBottom: "20px"}}>Files added successfully</Alert>
            }
          <Grid container spacing={2}>
            
            {approvedImages.map((item, i) => {
              return (
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12} key={i}>
                  <div
                    className = {Pilot.fileContainer}
                    onMouseLeave={() => setTempImage("")}
                  >
                    <Link href = {`/image/${item.slug}`}>
                      <a target="_blank">
                        <Image
                          className={Pilot.image}
                          src={`${imageLink}/1000x902/${item.file}`}
                          onMouseOver={() => mouseMovedIn(item._id)}
                          priority={true}
                          alt=""
                          width="100%"
                          height="100%"
                          layout="responsive"
                          objectFit="cover"
                        />
                      </a>
                    </Link>
                    
                    <MoreVertIcon
                      className={Pilot.more}
                      id={`more/${item._id}`}
                      sx={{ display: tempImage == item._id ? "block" : "none" }}
                      onClick={() => showOptions(item._id)}
                    />
                    <div
                      className={Pilot.editRemove}
                      id={`options/${item._id}`}
                      style={{
                        display: options == item._id ? "block" : "none",
                      }}
                      onMouseLeave={() => setOptions("")}
                    >
                      <div className={Pilot.editRemoveText} onClick={()=>editImage(item._id)}>Edit</div>
                      <div className={Pilot.editRemoveText} onClick={()=>{
                        setDeleteId(item._id),setOpen(true)}}>Remove</div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        // display: tempImage == item._id ? "flex" : "none",
                        background: "#fff",
                        position: "absolute",
                        width: "100%",
                        bottom: "0px",
                        padding: "10px 0px",
                        borderBottom: "1px solid #c5c5c5",
                        borderLeft: "1px solid #c5c5c5",
                        borderRight: "1px solid #c5c5c5",
                        borderRadius: "0px 0px 10px 10px"
                      }}
                      id={`likes/${item._id}`}
                    >
                      <FavoriteIcon /> &nbsp;{item.likes.length} &nbsp;&nbsp;
                      <RemoveRedEyeIcon /> &nbsp;{item.views} &nbsp;&nbsp;
                      <CloudDownloadIcon /> &nbsp;{item.downloads.length}{" "}
                      &nbsp;&nbsp;
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </div>
          }
        </>
        
      ) : (
        <></>
      )}
      {tab == "pending" ? (
        <div style={{ marginTop: "20px" }}>
          {
              pendingImages.length === 0 ? 
              <center>
              <Alert severity="info">No pending Images Yet</Alert>
              </center>
              :<></>
            }
          <Grid container spacing={2}>
          
            {pendingImages.map((item, i) => {
              return (
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12} key={i}>
                  <div
                    style={{ position: "relative", marginBottom:"10px", overflow: "hidden", borderRadius: "10px" }}
                    onMouseLeave={() => setTempImage("")}
                  >
                    <Image
                      className={Pilot.image}
                      src={`${imageLink}/1000x902/${item.file}`}
                      onMouseOver={() => mouseMovedIn(item._id)}
                      priority={true}
                      alt=""
                      width="100%"
                      height="100%"
                      layout="responsive"
                      objectFit="cover"
                    />
                    <MoreVertIcon
                      className={Pilot.more}
                      id={`more/${item._id}`}
                      sx={{ display: tempImage == item._id ? "block" : "none" }}
                      onClick={() => showOptions(item._id)}
                    />
                    <div
                      className={Pilot.editRemove}
                      id={`options/${item._id}`}
                      style={{
                        display: options == item._id ? "block" : "none",
                      }}
                      onMouseLeave={() => setOptions("")}
                    >
                      <div className={Pilot.editRemoveText} onClick={()=>editImage(item._id)}>Edit</div>
                      <div className={Pilot.editRemoveText}  onClick={()=>{
                        setDeleteId(item._id),setOpen(true)}}>Remove</div>
                    </div>
                    <div className={Pilot.industry}>{item.category}</div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </div>
      ) : (
        <></>
      )}
      {tab == "rejected" ? (
        <div style={{ marginTop: "20px" }}>
           {
              rejectedImages.length === 0 ? 
              <Alert severity="success">No rejected Images Yet</Alert>
              :<></>
            }
          <Grid container spacing={2}>
         
            {rejectedImages.map((item, i) => {
              return (
                <Grid item xl={3} lg={4} md={6} sm={6} xs={12} key={i}>
                  <div
                    style={{ position: "relative", marginBottom:"10px", overflow: "hidden", borderRadius: "10px" }}
                    onMouseLeave={() => setTempImage("")}
                  >
                    <Image
                      className={Pilot.image}
                      src={`${imageLink}/1000x902/${item.file}`}
                      onMouseOver={() => mouseMovedIn(item._id)}
                      priority={true}
                      alt=""
                      width="100%"
                      height="100%"
                      layout="responsive"
                      objectFit="cover"
                    />
                    <MoreVertIcon
                      className={Pilot.more}
                      id={`more/${item._id}`}
                      sx={{ display: tempImage == item._id ? "block" : "none" }}
                      onClick={() => showOptions(item._id)}
                    />
                    <div
                      className={Pilot.editRemove}
                      id={`options/${item._id}`}
                      style={{
                        display: options == item._id ? "block" : "none",
                      }}
                      onMouseLeave={() => setOptions("")}
                    >
                      <div className={Pilot.editRemoveText} onClick={()=>editImage(item._id)}>Edit</div>
                      <div className={Pilot.editRemoveText}  onClick={()=>{
                        setDeleteId(item._id),setOpen(true)}}>Remove</div>
                    </div>
                    <div className={Pilot.industry} style={{backgroundColor:"red"}}>{item.category}</div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
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
          <ClearRoundedIcon className="popupClose" onClick={handleClose}/>
          <div className="popupTitle">
          Are you sure you want to remove your Shot?
          </div>
          <center>
          <div className="popupLoginBtn" onClick={confirmDelete}>Yes, Continue</div>
          </center>
        </div>
      </Dialog>
    </div>
  );
}
Index.Layout = PilotActivities;

export default Index;
