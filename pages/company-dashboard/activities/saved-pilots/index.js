import React, { useEffect, useState } from "react";
import CompanyActivities from "../../../../components/layouts/CompanyActivities";
import DashCss from "../../../../styles/companyDashboard.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Card, CardContent } from "@mui/material";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
const domain = process.env.NEXT_PUBLIC_LOCALHOST;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function SavedPilots() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setNewFolder({
        folderName: "",
        folderDesc: "",
      })
      
    };
    const [open1, setOpen1] = React.useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };
  const [open2, setOpen2] = React.useState(false);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  let [data, setData] = useState([]);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/folder/getMyFolders`, config).then((res) => {
      setData(res.data);
    });
  }, []);
  let [newFolder, setNewFolder] = useState({
    folderName: "",
    folderDesc: "",
  });
  let [editFolder, setEditFolder] = useState({
    name: "",
    desc: "",
  });
  let folderChangeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";

    setNewFolder({
      ...newFolder,
      [e.target.id]: e.target.value,
    });
  };
  let folderChangeHandler1 = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";

    setEditFolder({
      ...editFolder,
      [e.target.id]: e.target.value,
    });
  };
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
      axios.post(
        `${domain}/api/folder/createFolder`,
        { folderName: newFolder.folderName, description: newFolder.folderDesc },
        config
      ).then(res=>{
        setNewFolder({
            folderName: "",
            folderDesc: ""
        })
        axios.get(`${domain}/api/folder/getMyFolders`, config).then((res) => {
            setData(res.data);
          });
      })
      handleClose()
    }
  };
  let [tempId, setTempId] = useState("")
  let selectEdit = (id) =>{
    axios.post(`${domain}/api/folder/getFolderData`, {folderId : id}).then(res=>{
        console.log(res)
        setTempId(id)
        setEditFolder({
            name: res.data.folderName,
            desc: res.data.description
        })
        setOpen1(true)
    })
  }
let editFolder1 = () =>{
    let focusField = "";
    let fields = ["name", "desc"];
    for (let i = 0; i < fields.length; i++) {
        console.log(fields[i])
      console.log(editFolder[fields[i]]);
      if (editFolder[fields[i]] == "") {
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
        editFolder.name !== "" &&
      (editFolder.name.length < 3 || editFolder.name.length > 100)
    ) {
      document.getElementById("name_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("name_error").style.display = "block";
      focusField = "name";
    }
    if (
        editFolder.desc !== "" &&
      (editFolder.desc.length < 3 || editFolder.desc.length > 100)
    ) {
      document.getElementById("desc_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("desc_error").style.display = "block";
      focusField = "desc";
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
          `${domain}/api/folder/updateFolderData`,
          { folderId:tempId, folderName: editFolder.name, description: editFolder.desc },
          config
        ).then(res=>{
            axios.get(`${domain}/api/folder/getMyFolders`, config).then((res) => {
                setData(res.data);
              });
              setOpen1(false)
        })
    }
}
let deleteFolder = () =>{
    const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
    axios.post(`${domain}/api/folder/deleteFolder`, {folderId: tempId}).then(res=>{
        axios.get(`${domain}/api/folder/getMyFolders`, config).then((res) => {
            setData(res.data);
          });
    })
    setOpen2(false)
}
  return (
    <div>
      <div className={DashCss.title}>
        Click the folder to see Saved Pilots or Create a new one.
      </div>
      <div>
        <Grid container spacing={2}>
          {data.map((item, i) => {
            return (
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12} key={i}>
                    <div style={{ position: "relative" }}>
                        <Link href={`/company-dashboard/activities/saved-pilots/${item._id}`}>
                <Card style={{ cursor: "pointer", marginBottom: "5px" }}>
                  <CardContent>
               
                      
                      <div className={DashCss.subTitle}>
                        {item.folderName.length < 70
                          ? item.folderName
                          : item.folderName.slice(0, 70) + "..."}
                      </div>
                      <div className={DashCss.folderDesc}>
                        {item.description.length < 80
                          ? item.description
                          : item.description.slice(0, 78) + "..."}
                      </div>
                      
                   
                  </CardContent>
                </Card>
                </Link>
                <div>
                        <div className={DashCss.editDel}style={{position: "absolute", bottom: "0px", right: "0px"}}>
                          <DeleteIcon
                            style={{ color: "#ff726f", marginRight: "5px" }}
                            onClick={()=>{
                                setTempId(item._id)
                                setOpen2(true)
                            }}
                          />
                          <ModeEditIcon style={{ color: "#00e7fc" }} onClick={()=>selectEdit(item._id)} />
                        </div>
                      </div>
                </div>
              </Grid>
            );
          })}

          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <Card onClick={() => setOpen(true)}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "160px",
                    width: "100%",
                  }}
                >
                  <AddCircleOutlineIcon
                    style={{
                      fontSize: "60px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
          </Grid>
        </Grid>
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon className="popupClose" onClick={handleClose} />
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
            <button className="popupLoginBtn" onClick={createNewFolder}>
              Create
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
          <div className={DashCss.title}>Edit the folder to save pilots</div>
          <div>
            <label className="inputLabel" htmlFor="name">
              Folder Name
            </label>
            <div>
              <input
                type="text"
                className="inputBox"
                id="name"
                value={editFolder.name}
                onChange={folderChangeHandler1}
              />
            </div>
            <div className="input_error_msg" id="name_error">
              Folder Name is required
            </div>
          </div>
          <div>
            <label className="inputLabel" htmlFor="desc">
              Folder Description
            </label>
            <div>
              <input
                type="text"
                className="inputBox"
                id="desc"
                value={editFolder.desc}
                onChange={folderChangeHandler1}
              />
            </div>
            <div className="input_error_msg" id="desc_error">
              FolderDesc is required
            </div>
          </div>
          <center>
            <button className="popupLoginBtn" onClick={editFolder1}>
              Update
            </button>
          </center>
        </div>
      </Dialog>
      <Dialog
        open={open2}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose2}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon className="popupClose" onClick={handleClose2} />
          <div className="popupTitle">Are you sure you want to delete this folder?</div>
          <center>
          <button className="popupLoginBtn" onClick={deleteFolder}>Yes, continue</button>
          </center>
          </div>
      </Dialog>
     
    </div>
  );
}
SavedPilots.Layout = CompanyActivities;
export default SavedPilots;
