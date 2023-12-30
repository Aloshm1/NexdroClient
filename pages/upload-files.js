import { Container } from "@mui/system";
import React, { useState, useEffect } from "react";
import styles from "../styles/uploadFiles.module.css";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import Router from "next/router";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Select from "react-select";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/router";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import FilterOutlinedIcon from "@mui/icons-material/FilterOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const imageLink = process.env.NEXT_PUBLIC_CDN;

const customStyles = {
  control: (base, state) => ({
    ...base,
    height: "45px",
    fontSize: "13px",
    padding: "0px 10px",
    background: "#EFF3F6",
    borderRadius: "3px",
    border: "0",
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

const s3Domain = "https://dn-nexevo-home.s3.ap-south-1.amazonaws.com";

export async function getServerSideProps(context) {
  const kwdsRes = await fetch(`${domain}/api/keyword/getKeywords`);
  const industriesRes = await fetch(`${domain}/api/industry/getIndustries`);
  const kwdsData = await kwdsRes.json();
  const industriesData = await industriesRes.json();
  if (kwdsData && industriesData) {
    return {
      props: {
        suggestedKeywords: kwdsData,
        industriesLst: industriesData,
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

function UploadFiles({ suggestedKeywords, industriesLst }) {
  const router = useRouter();
  const allowedFormats = ["jpg", "jpeg", "png", "mp4", "mov"];
  const [selectedTab, setSelectedTab] = useState(1);
  const [formatError, setFormatError] = useState(false);
  const [draftSuccess, setDraftSuccess] = useState(false);
  const [fileCountExceeded, setFileCountExceeded] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [videoCount1, setVideoCount1] = useState(0);
  const [suggestedkwds, setSuggestedKwds] = useState(
    suggestedKeywords.map((x) => x.keyword)
  );
  const [industries, setIndustries] = useState([]);
  const imgSizeLimit = 25;
  const img3dSizeLimit = 25;
  const videoSizeLimit = 100;
  const videoDuration = 5;
  const [files, setFiles] = useState([]);
  const [draftFiles, setDraftFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(0);
  const [selectedType, setSelectedType] = useState("image");
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedSuggestedKeywords, setSelectedSuggestedKeywords] = useState(
    suggestedkwds.slice(0, suggestedkwds.length)
  );
  const [draftFileExistPopup, setDraftFileExistPopup] = useState(false);
  const [showSuggestedTags, setShowSuggestedTags] = useState(false);
  const [draftFileExistPopupShown, setDraftFileExistPopupShown] =
    useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [fileEditOption, setFileEditOption] = useState(false);
  const [fileEditMore, setFileEditMore] = useState(true);
  const [fileSelectDisabled, setFileSelectDisabled] = useState(false);
  const [errLst, setErrLst] = useState([]);
  const [error, setError] = useState(false);
  const [fileLimits, setFileLimits] = useState({
    images: 0,
    videos: 0,
    images3d: 0,
  });
  const [plan, setPlan] = useState("");
  const [limitError, setLimitError] = useState(false);
  const [multiSelectPopup, setMultiSelectPopup] = useState(false);
  const [draftFileErrorPopup, setDraftFileErrorPopup] = useState(false);
  const [preview, setPreview] = useState(false);
  const [addMoreState, setAddMoreState] = useState(false);
  const [draftVideoLimitError, setDraftVideoLimitError] = useState(false);
  const [uploaded1Success, setUploaded1Success] = useState(false);
  const [goAway, setGoAway] = useState("");
  const [uploaded1SuccessTest, setUploaded1SuccessTest] = useState("");
  const [curruptFileErr, setCurruptFileErr] = useState(false);
  const [curruptFileErr1, setCurruptFileErr1] = useState(false);
  const [fileChangeLoading, setFileChangeLoading] = useState(false);
  const [fileChangeVideoLoading, setFileChangeVideoLoading] = useState(false);

  useEffect(() => {
    if (window) {
      function confirmWinClose(e) {
        if (files.length == 0) {
          e.preventDefault();
          var confirmClose = window.confirm("are you sure you want to leave?");
          return confirmClose;
        }
        return true;
      }
      window.onbeforeunload = confirmWinClose;
      Router.beforePopState(() => {
        //if (componentShouldBeSavedAsDraft(componentData)) {
        if (files.length > 0) {
          const result = window.confirm("are you sure you want to leave?");
          if (!result) {
            Router.push("/upload-files");
          }
          console.log(goAway); // this value is always "" even though set differently in code.
          return result;
        } else {
          return true;
        }
      });
    }

    return () => {
      if (window) {
        window.onbeforeunload = null;
      }
      Router.beforePopState(() => {
        return true;
      });
    };
  }, [goAway]);

  const getDraftFiles = () => {
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    console.log(localStorage.getItem("access_token"));
    axios
      .post(`${domain}/api/draft/getDrafts`, config)
      .then((res) => {
        let tempDraftFiles = res.data;
        let tempLst = [];
        let tempVideoCount = 0;
        for (var i = 0; i < tempDraftFiles.length; i++) {
          var file = tempDraftFiles[i];
          if (file.fileType === "video") {
            tempVideoCount++;
          }
          tempLst.push({
            _id: file._id,
            file: `${file.file}`,
            file_name_saved: file.postName,
            file_name: file.postName,
            file_type: file.fileType,
            industry: file.category,
            experience: file.experience,
            keywords: file.keywords.filter((x) => x !== ""),
            resolutionSatisfied: true,
            lengthSatisfied: true,
            suggestedKeywords: suggestedkwds.filter(
              (x) => !file.keywords.includes(x)
            ),
            adult: file.adult,
            uploadStatus: "selected",
          });
        }
        setVideoCount1(tempVideoCount);
        if (tempLst.length > 0 && !draftFileExistPopupShown) {
          setDraftFileExistPopup(true);
          setDraftFileExistPopupShown(true);
        } else {
          setDraftFileExistPopupShown(true);
        }
        console.log(tempLst);
        setDraftFiles([...tempLst]);
      })
      .catch((err) => {
        var lst = [];
        for (var i = 0; i < 5; i++) {
          lst.push(i);
        }
        console.log(lst);
      });
  };

  const [userDetails, setUserDetails] = useState({});

  const updateLimit = () => {
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .get(`${domain}/api/pilotSubscription/getMySubscription`, config)
      .then((res) => {
        console.log(res.data);
        if (res.data.subscription) {
          setFileLimits({
            ...fileLimits,
            images:
              res.data.subscription.images - res.data.images >= 0
                ? res.data.subscription.images - res.data.images
                : 0,
            videos:
              res.data.subscription.videos - res.data.videos >= 0
                ? res.data.subscription.videos - res.data.videos
                : 0,
            images3d:
              res.data.subscription.images3d - res.data.images3d >= 0
                ? res.data.subscription.images3d - res.data.images3d
                : 0,
          });
          setPlan(res.data.subscription.plan);
        } else {
          setFileLimits({
            ...fileLimits,
            images: 50 - res.data.images,
            videos: 50 - res.data.videos,
            images3d: 50 - res.data.images3d,
          });
        }
      });
  };

  useEffect(() => {
    const options = industriesLst.map((d) => ({
      value: d.industry,
      label: d.industry,
    }));
    setIndustries([...options]);
    console.log(options);
    // setIndustries(temp_industries)
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("role")) {
      if (localStorage.getItem("role") === "halfPilot") {
        Router.push("/create-pilot");
      } else if (localStorage.getItem("role") === "undefined") {
        Router.push("/choose-categories");
      } else if (localStorage.getItem("role") !== "pilot") {
        Router.push("/no-page-found");
      }
    } else {
      Router.push("/login");
    }
    getDraftFiles();
    axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
      console.log(res.data);
      setUserDetails({
        username: res.data.name,
        profilePic: res.data.profilePic,
      });
    });
    updateLimit();
  }, []);
  const generateThumbnail = (file, boundBox) => {
    if (!boundBox || boundBox.length != 2) {
      throw "You need to give the boundBox";
    }
    var scaleRatio = Math.min(...boundBox) / Math.max(file.width, file.height);
    var reader = new FileReader();
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
          var scaleRatio =
            Math.min(...boundBox) / Math.max(img.width, img.height);
          let w = img.width * scaleRatio;
          let h = img.height * scaleRatio;
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);
          return resolve(canvas.toDataURL(file.type));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };
  const getResolution = (file, index, type) => {
    let temp_files;
    if (type === "draft_file") {
      temp_files = draftFiles;
    } else {
      temp_files = files;
    }
    if (file.type.split("/")[0] === "image") {
      var img = new Image();
      img.onload = function () {
        console.log("Loaded");
        if (this.width >= 1100 && this.height >= 500) {
          temp_files[index].resolutionSatisfied = true;
        } else {
          temp_files[index].resolutionSatisfied = false;
        }
        if (type === "draft_file") {
          setDraftFiles([...temp_files]);
        } else {
          setFiles([...temp_files]);
        }
        console.log(this.width + "x" + this.height);
        generateThumbnail(file, [300, 300]).then(function (dataUrl) {
          temp_files[index].thumbnail = dataUrl;
          if (type === "draft_file") {
            setDraftFiles([...temp_files]);
          } else {
            setFiles([...temp_files]);
          }
        });
      };
      img.onerror = function () {
        removeSelectedFile(index, null);
        setCurruptFileErr(true);
      };
      img.src = URL.createObjectURL(file);
    } else {
      temp_files[index].resolutionSatisfied = true;
      const reader = new FileReader();
      reader.onload = () => {
        const media = new Audio(reader.result);
        media.onloadedmetadata = () => {
          console.log(media.duration);
          if (media.duration / 60 > videoDuration) {
            temp_files[index].lengthSatisfied = false;
          } else {
            temp_files[index].lengthSatisfied = true;
          }
          if (type === "draft_file") {
            setDraftFiles([...temp_files]);
          } else {
            setFiles([...temp_files]);
          }
        };
        media.onerror = function () {
          removeSelectedFile(index, null);
          setCurruptFileErr(true);
        };
      };
      reader.readAsDataURL(file);
      reader.onerror = function () {
        removeSelectedFile(index, null);
        setCurruptFileErr(true);
      };
    }
  };

  const selectFirst = () => {
    for (var i = 0; i < files.length; i++) {
      console.log(files[i].uploadStatus);
      if (files[i].uploadStatus !== "uploaded") {
        changeSelectedFile(i);
        break;
      }
    }
  };

  const SaveDraftCompleted = () => {
    changeSelectedFile(-1);
    setFileEditOption(false);
    setTimeout(() => {
      setFileSelectDisabled(false);
    }, 200);
    window.scrollTo(0, 0);
    setDraftSuccess(true);
    setTimeout(() => {
      setDraftSuccess(false);
    }, 4000);
  };

  const afterUploadSuccess = (type) => {
    console.log(files.length);
    setTimeout(() => {
      for (var i = 0; i < files.length; i++) {
        console.log(files[i].file_type);
        if (
          files[i].lengthSatisfied &&
          files[i].resolutionSatisfied &&
          (files[i].uploadStatus === "selected" ||
            files[i].uploadStatus === "pending" ||
            files[i].uploadStatus === "failed") &&
          files[i].file.size / 1000000 <=
            (files[i].file_type === "image"
              ? fileLimits.images
              : files[i].file_type === "3d"
              ? fileLimits.images3d
              : fileLimits.videos)
        ) {
          console.log("Dont redirect");
          return 0;
        }
      }
      console.log("Redirect");
      if (type === "publish") {
        localStorage.setItem("published", "true");
        Router.push("/pilot-dashboard/activities");
      } else {
        setDraftSuccess(true);
        SaveDraftCompleted();
        setFiles([]);
        setFileSelectDisabled(false);
        setTimeout(() => {
          setDraftSuccess(false);
        }, 2000);
      }
      window.scrollTo(0, 0);
    }, 200);
  };

  const fileSelected = (e) => {
    if (e.target.files.length > 0) {
      var fileCount = e.target.files.length;
      if (files.length + e.target.files.length > 12) {
        setFileCountExceeded(true);
        fileCount = 12 - files.length;
      }
      let tempVideoCount = videoCount1;
      let tempFiles = files;
      for (var i = 0; i < fileCount; i++) {
        console.log(i);
        var file = e.target.files[i];
        console.log(file.type);
        var fileFormat = file.name
          .substring(file.name.lastIndexOf(".") + 1)
          .toLowerCase();
        console.log(fileFormat);
        if (
          allowedFormats.includes(fileFormat) &&
          (file.type.includes("video") || file.type.includes("image"))
        ) {
          if (!file.type.includes("image") || file.type.includes("video")) {
            tempVideoCount++;
          }
          console.log(file.type.split("/")[0]);
          tempFiles.push({
            file: file,
            thumbnail: "",
            file_name_saved: file.name,
            file_name: "",
            file_type: file.type.split("/")[0],
            industry: "",
            experience: "",
            keywords: [],
            suggestedKeywords: suggestedkwds.slice(0, suggestedkwds.length),
            adult: false,
            uploadStatus: "selected",
            resolutionSatisfied: true,
            lengthSatisfied: true,
          });
        } else {
          setFormatError(true);
        }
      }
      setVideoCount1(tempVideoCount);
      if (tempFiles.length > 0) {
        setFiles([...tempFiles]);
        for (var i = 0; i < tempFiles.length; i++) {
          getResolution(tempFiles[i].file, i, "upload_file");
        }
        if (addMoreState) {
          selectFirst();
          console.log(e.target.files);
          setFileSelectDisabled(true);
        } else {
          setSelectedType(tempFiles[0].file_type);
          console.log(e.target.files);
          setFileSelectDisabled(true);
        }
      }
    }

    document.getElementById(e.target.id).value = "";
  };
  const changeHandler = (e) => {
    if (selectedTab === 1) {
      var temp_files = files;
      if (e.target.id === "file_name") {
        temp_files[selectedFile][e.target.name] = e.target.value.substring(
          0,
          100
        );
        document.getElementById("file_name").value = e.target.value.substring(
          0,
          100
        );
      } else if (e.target.id === "experience") {
        temp_files[selectedFile][e.target.name] = e.target.value.substring(
          0,
          200
        );
        document.getElementById("experience").value = e.target.value.substring(
          0,
          200
        );
      } else {
        temp_files[selectedFile][e.target.name] = e.target.value;
      }
      setFiles(temp_files);
    } else {
      var temp_files = draftFiles;
      if (e.target.id === "file_name") {
        temp_files[selectedFile][e.target.name] = e.target.value.substring(
          0,
          100
        );
        document.getElementById("file_name").value = e.target.value.substring(
          0,
          100
        );
      } else if (e.target.id === "experience") {
        temp_files[selectedFile][e.target.name] = e.target.value.substring(
          0,
          200
        );
        document.getElementById("experience").value = e.target.value.substring(
          0,
          200
        );
      } else {
        temp_files[selectedFile][e.target.name] = e.target.value;
      }
      setDraftFiles(temp_files);
    }
    document.getElementById(`${e.target.id}_error`).style.display = "none";
  };
  const checkboxChange = () => {
    if (
      (selectedTab === 1 && files.length > 0) ||
      (selectedTab === 2 && draftFiles.length > 0)
    ) {
      var temp_files = selectedTab === 1 ? files : draftFiles;
      temp_files[selectedFile].adult = !temp_files[selectedFile].adult;
      if (selectedTab === 1) {
        setFiles(temp_files);
      } else {
        setDraftFiles(temp_files);
      }
    }
  };
  const changeSelectedFile = (index) => {
    console.log(index, "removeindex");
    setFileChangeLoading(true);
    setTimeout(() => {
      setFileChangeLoading(false);
    }, 10);
    console.log(selectedTab);
    window.scrollTo(0, 0);
    var tempFiles = selectedTab === 1 ? files : draftFiles;
    if (index !== -1) {
      setSelectedFile(index);
      document.getElementById("file_name").value = tempFiles[index].file_name;
      document.getElementById("experience").value = tempFiles[index].experience;
      // document.getElementById("adult").checked = tempFiles[index].adult;
      document.getElementById("keyword").value = "";
      setKeyword("");
      setSelectedType(tempFiles[index].file_type);
      setSelectedKeywords(tempFiles[index].keywords);
      setSelectedSuggestedKeywords(tempFiles[index].suggestedKeywords);
      setSelectedIndustry(tempFiles[index].industry);
    } else {
      console.log("remove");
      setSelectedFile(0);
      document.getElementById("file_name").value = "";
      document.getElementById("experience").value = "";
      document.getElementById("keyword").value = "";
      setKeyword("");
      // document.getElementById("adult").checked = "";
      setSelectedType("");
      setSelectedKeywords([]);
      setSelectedSuggestedKeywords(
        suggestedkwds.slice(0, suggestedkwds.length)
      );
      setSelectedIndustry("");
    }
  };
  const changeFileType = (type) => {
    if (selectedTab === 1) {
      if (
        files.length > 0 &&
        files[selectedFile].file_type !== "video" &&
        type !== "video"
      ) {
        setSelectedType(type);
        var temp_files = files;
        temp_files[selectedFile].file_type = type;
        setFiles(temp_files);
      }
    } else {
      if (
        draftFiles.length > 0 &&
        draftFiles[selectedFile].file_type !== "video" &&
        type !== "video"
      ) {
        setSelectedType(type);
        var temp_files = draftFiles;
        temp_files[selectedFile].file_type = type;
        setDraftFiles(temp_files);
      }
    }
  };
  const addkeyword = (e) => {
    if (e.key === "Enter") {
      setShowSuggestedTags(false);
    }
    var keywords =
      selectedTab === 1
        ? files[selectedFile].keywords
        : draftFiles[selectedFile].keywords;
    if (keywords.length < 10) {
      if (
        e.key === "Enter" &&
        ((files.length > 0 &&
          selectedTab === 1 &&
          e.target.value.trim().length > 0) ||
          (draftFiles.length > 0 &&
            selectedTab === 2 &&
            e.target.value.trim().length > 0))
      ) {
        if (
          selectedKeywords.filter(
            (item) => e.target.value.toLowerCase() === item.toLowerCase()
          ).length === 0
        ) {
          console.log("Not include in selected");
          if (
            selectedSuggestedKeywords.filter(
              (item) => e.target.value.toLowerCase() === item.toLowerCase()
            ).length === 0
          ) {
            console.log("Not include in suggested");
            setSelectedKeywords([
              ...selectedKeywords,
              e.target.value.substring(0, 51),
            ]);
            if (selectedTab === 1) {
              var temp_files = selectedTab === 1 ? files : draftFiles;
              temp_files[selectedFile].keywords.push(
                e.target.value.substring(0, 51)
              );
              setFiles(temp_files);
            } else {
              var temp_files = draftFiles;
              temp_files[selectedFile].keywords.push(
                e.target.value.substring(0, 51)
              );
              setDraftFiles(temp_files);
            }
          } else {
            var index = selectedSuggestedKeywords.findIndex(
              (item) => e.target.value.toLowerCase() === item.toLowerCase()
            );
            console.log(index);
            addKwdFrmSug(index);
          }
        }
        document.getElementById("keyword").value = "";
        setKeyword("");
      }
    }
  };
  const removeSelectedKeyword = (index) => {
    if (
      (selectedTab === 1 && files.length > 0) ||
      (selectedTab === 2 && draftFiles.length > 0)
    ) {
      var kwds = selectedKeywords;
      var sugg_kwds = selectedSuggestedKeywords;
      sugg_kwds = [kwds[index], ...sugg_kwds];
      kwds.splice(index, 1);
      setSelectedKeywords([...kwds]);
      setSelectedSuggestedKeywords([...sugg_kwds]);
      var temp_files = selectedTab === 1 ? files : draftFiles;
      temp_files[selectedFile].keywords = kwds;
      temp_files[selectedFile].suggestedKeywords = sugg_kwds;
      if (selectedTab === 1) {
        setFiles(temp_files);
      } else {
        setDraftFiles(temp_files);
      }
    }
  };
  const addKwdFrmSug = (index) => {
    setShowSuggestedTags(false);
    var keywords =
      selectedTab === 1
        ? files[selectedFile].keywords
        : draftFiles[selectedFile].keywords;
    if (keywords.length < 10) {
      if (selectedTab === 1) {
        if (files.length > 0) {
          var kwds = selectedKeywords;
          var sugg_kwds = selectedSuggestedKeywords;
          kwds.push(sugg_kwds[index]);
          sugg_kwds.splice(index, 1);
          setSelectedKeywords([...kwds]);
          setSelectedSuggestedKeywords([...sugg_kwds]);
          var temp_files = files;
          temp_files[selectedFile].keywords = kwds;
          temp_files[selectedFile].suggestedKeywords = sugg_kwds;
          setFiles(temp_files);
        }
      } else {
        if (draftFiles.length > 0) {
          var kwds = selectedKeywords;
          var sugg_kwds = selectedSuggestedKeywords;
          kwds.push(sugg_kwds[index]);
          sugg_kwds.splice(index, 1);
          setSelectedKeywords([...kwds]);
          setSelectedSuggestedKeywords([...sugg_kwds]);
          var temp_files = draftFiles;
          temp_files[selectedFile].keywords = kwds;
          temp_files[selectedFile].suggestedKeywords = sugg_kwds;
          setDraftFiles(temp_files);
        }
      }
    }
  };
  const industryChangeHandler = (value) => {
    console.log(value.value);
    setSelectedIndustry(value.value);
    if (selectedTab === 1) {
      var temp_files = files;
      temp_files[selectedFile].industry = value.value;
      setFiles(temp_files);
    } else {
      var temp_files = draftFiles;
      temp_files[selectedFile].industry = value.value;
      setDraftFiles(temp_files);
    }
  };
  const removeAllUploaded = () => {
    console.log("ououuuuuuuu");
    var temp_files = files;
    for (var i = 0; i < temp_files.length; i++) {
      var file = temp_files[i];
      if (file.uploadStatus === "uploaded") {
        temp_files.splice(i, 1);
        i--;
      }
    }
    if (temp_files.length > 0) {
      changeSelectedFile(0);
    } else {
      changeSelectedFile(-1);
      setTimeout(() => {
        setFileSelectDisabled(false);
      }, 50);
    }
    setFiles(temp_files);
  };
  const removeSelectedFile = async (index, fileId) => {
    console.log(
      index,
      fileId,
      "ooojjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj"
    );
    console.log("--------------------------------------");
    console.log(files, "flflflflflflfflflfllflflfllflflfl");

    console.log(selectedFile, "ssfdffsfsfsfsffsfsdffsfs");
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    setTimeout(() => {
      setFileEditOption(false);
    }, 100);
    if (selectedTab === 1) {
      var temp_files = files;
      if (temp_files[index].file_type === "video") {
        setVideoCount1(videoCount1 - 1);
      }
      temp_files.splice(index, 1);

      if (temp_files.length !== 0) {
        if (index === selectedFile && selectedFile !== 0) {
          changeSelectedFile(index - 1);
        } else {
          if (temp_files.length === selectedFile) {
            changeSelectedFile(selectedFile - 1);
          } else {
            changeSelectedFile(selectedFile);
          }
        }
      } else {
        changeSelectedFile(-1);
        setFileEditOption(false);
        setTimeout(() => {
          setFileSelectDisabled(false);
        }, 200);
      }

      setFiles([...temp_files]);

      
      if (errLst.includes(index)) {
        var temp_err_lst = errLst;
        temp_err_lst.splice(temp_err_lst.indexOf(index), 1);
        setErrLst(temp_err_lst);
      }
    } else {
      
      axios
        .post(`${domain}/api/draft/deleteDraft`, { id: fileId }, config)
        .then((res) => {
          console.log(res.data);
          var temp_files = draftFiles;
          if (temp_files[index].file_type === "video") {
            setVideoCount1(videoCount1 - 1);
          }
          temp_files.splice(index, 1);
          if (temp_files.length !== 0) {
            if (index === selectedFile && selectedFile !== 0) {
              changeSelectedFile(index - 1);
            } else {
              if (temp_files.length === selectedFile) {
                changeSelectedFile(selectedFile - 1);
              } else {
                changeSelectedFile(selectedFile);
              }
            }
          } else {
            changeSelectedFile(-1);
            setFileEditOption(false);
            setTimeout(() => {
              setFileSelectDisabled(false);
            }, 200);
          }
          setDraftFiles([...temp_files]);
          if (errLst.includes(index)) {
            var temp_err_lst = errLst;
            temp_err_lst.splice(temp_err_lst.indexOf(index), 1);
            setErrLst(temp_err_lst);
          }
        })
        .catch((err) => {
          console.log(err.response);
          setError(true);
        });
    }
    if (selectedTab === 1) {
      console.log("+++++++++++");
      console.log(files, "oofosdfsofosd");
      // removeAllUploaded()
    }
  };
  const fileChanged = async (e, index) => {
    console.log("filechngeddd");
    console.log(e.target.files[0]);
    console.log(index);
    var file = e.target.files[0];
    var fileFormat = file.name
      .substring(file.name.lastIndexOf(".") + 1)
      .toLowerCase();
    if (
      allowedFormats.includes(fileFormat) &&
      (file.type.includes("video") || file.type.includes("image"))
    ) {
      if (file.type.split("/")[0] === "image") {
        var img = new Image();
        img.onload = () => {
          var temp_files = selectedTab === 1 ? files : draftFiles;
          if (
            temp_files[index].file_type === "video" &&
            file.type.split("/")[0] === "image"
          ) {
            setVideoCount1(videoCount1 - 1);
          }
          if (
            temp_files[index].file_type != "video" &&
            file.type.split("/")[0] == "video"
          ) {
            setVideoCount1(videoCount1 + 1);
          }
          temp_files[index].file = file;
          temp_files[index].file_name_saved = file.name;
          temp_files[index].file_type = file.type.split("/")[0];
          temp_files[index].uploadStatus = "selected";
          temp_files[index].lengthSatisfied = true;
          if (selectedTab === 1) {
            setFiles([...temp_files]);
            getResolution(temp_files[index].file, index, "upload_file");
          } else {
            setDraftFiles([...temp_files]);
            getResolution(temp_files[index].file, index, "draft_file");
          }
          changeSelectedFile(selectedFile);
        };
        img.onerror = function () {
          setCurruptFileErr1(true);
        };
        img.src = URL.createObjectURL(file);
      } else {
        var temp_files = selectedTab === 1 ? files : draftFiles;
        if (
          temp_files[index].file_type === "video" &&
          file.type.split("/")[0] === "image"
        ) {
          setVideoCount1(videoCount1 - 1);
        }
        if (
          temp_files[index].file_type != "video" &&
          file.type.split("/")[0] == "video"
        ) {
          setVideoCount1(videoCount1 + 1);
        }
        temp_files[index].file = file;
        temp_files[index].file_name_saved = file.name;
        temp_files[index].file_type = file.type.split("/")[0];
        temp_files[index].uploadStatus = "selected";
        temp_files[index].lengthSatisfied = true;
        if (selectedTab === 1) {
          setFiles([...temp_files]);
          getResolution(temp_files[index].file, index, "upload_file");
        } else {
          setDraftFiles([...temp_files]);
          getResolution(temp_files[index].file, index, "draft_file");
        }
        changeSelectedFile(selectedFile);
      }
    } else {
      setFormatError(true);
    }
    document.getElementById(e.target.id).value = "";
    setFileChangeVideoLoading(true);
    setTimeout(() => {
      setFileChangeVideoLoading(false);
    }, 10);
  };

  const publishFile = () => {
    console.log(selectedFile);
  };
  const isPostNameValid = (postname) => {
    /* 
      Usernames can only have: 
      - Letters (a-z, A-Z)
      - Numbers (0-9)
      - space (" ")
    */
    const res = /^[a-zA-Z0-9 ]+$/.exec(postname);
    const valid = !!res;
    return valid;
  };
  const publishFiles = async (type) => {
    window.scrollTo(0, 0);
    if (type === "draft" && videoCount1 > 10) {
      setDraftVideoLimitError(true);
    } else {
      if (selectedTab === 1) {
        var imageCount = 0;
        var image3dCount = 0;
        var videoCount = 0;
        for (var i = 0; i < files.length; i++) {
          if (
            files[i].file.size / 1000000 <=
              (files[i].file_type === "video"
                ? videoSizeLimit
                : files[i].file_type === "3d"
                ? img3dSizeLimit
                : imgSizeLimit) &&
            files[i].resolutionSatisfied &&
            (files[i].uploadStatus === "selected" ||
              files[i].uploadStatus === "failed") &&
            files[i].lengthSatisfied
          ) {
            if (files[i].file_type === "image") {
              imageCount += 1;
            } else if (files[i].file_type === "video") {
              videoCount += 1;
            } else if (files[i].file_type === "3d") {
              image3dCount += 1;
            }
          }
        }
        console.log(fileLimits);
        console.log(imageCount);
        if (
          fileLimits.images < imageCount ||
          fileLimits.videos < videoCount ||
          fileLimits.images3d < image3dCount
        ) {
          setLimitError(true);
          return;
        }
      }
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      console.log(type);
      var tempFiles = selectedTab === 1 ? files : draftFiles;
      var errObjId = null;
      var errObjField = null;
      var temp_err_lst = errLst;
      var req_fields;
      var link;
      if (type === "publish") {
        req_fields = ["file_name", "industry", "experience", "keywords"];
        if (selectedTab === 1) {
          link = "/api/image/createImage";
        } else {
          link = `/api/draft/uploadDraft`;
        }
      } else {
        req_fields = [];
        link = "/api/draft/createDraft";
      }
      for (var i = 0; i < tempFiles.length; i++) {
        var error = false;
        for (var j = 0; j < req_fields.length; j++) {
          if (
            selectedTab === 2 ||
            (tempFiles[i].file.size / 1000000 <=
              (tempFiles[i].file_type === "video"
                ? videoSizeLimit
                : tempFiles[i].file_type === "3d"
                ? img3dSizeLimit
                : imgSizeLimit) &&
              tempFiles[i].resolutionSatisfied &&
              tempFiles[i].lengthSatisfied &&
              (tempFiles[i].uploadStatus === "selected" ||
                tempFiles[i].uploadStatus === "failed"))
          ) {
            if (
              req_fields[j] !== "keywords" &&
              req_fields[j] !== "experience"
            ) {
              if (tempFiles[i][req_fields[j]] === "") {
                error = true;
                if (errObjId === null && errObjField === null) {
                  errObjId = i;
                  errObjField = req_fields[j];
                }
              }
            } else {
              if (tempFiles[i].keywords.length <= 0) {
                error = true;
                if (errObjId === null && errObjField === null) {
                  errObjId = i;
                  errObjField = "keyword";
                }
              }
            }
            if (req_fields[j] === "file_name") {
              if (type === "publish") {
                if (!isPostNameValid(tempFiles[i].file_name)) {
                  error = true;
                  if (errObjId === null) {
                    errObjId = i;
                    errObjField = "file_name";
                  }
                }
              }
            }
          }
        }
        if (error) {
          if (!temp_err_lst.includes(i)) temp_err_lst.push(i);
        } else {
          if (temp_err_lst.includes(i)) {
            var id = temp_err_lst.indexOf(i);
            temp_err_lst.splice(id, 1);
          }
        }
      }
      if (errObjId !== null && errObjField !== null) {
        console.log(temp_err_lst);
        setErrLst([...temp_err_lst]);
        changeSelectedFile(errObjId);
        document.getElementById(errObjField).focus();
      }
      var temp_files = tempFiles;
      for (var i = 0; i < tempFiles.length; i++) {
        if (
          !temp_err_lst.includes(i) &&
          (tempFiles[i].uploadStatus === "selected" ||
            tempFiles[i].uploadStatus === "failed") &&
          (!tempFiles[i].file.size ||
            (tempFiles[i].file.size / 1000000 <=
              (tempFiles[i].file_type === "video"
                ? videoSizeLimit
                : tempFiles[i].file_type === "3d"
                ? img3dSizeLimit
                : imgSizeLimit) &&
              tempFiles[i].resolutionSatisfied &&
              tempFiles[i].lengthSatisfied))
        ) {
          console.log(tempFiles[i].uploadStatus);
          temp_files[i].uploadStatus = "pending";
          if (selectedTab === 1) {
            setFiles([...temp_files]);
          } else {
            setDraftFiles([...temp_files]);
          }
          var formData;
          if (tempFiles[i].file.name) {
            formData = new FormData();
            formData.append("file", tempFiles[i].file);
            formData.append("postName", tempFiles[i].file_name);
            formData.append("fileType", tempFiles[i].file_type);
            formData.append("experience", tempFiles[i].experience);
            formData.append("keywords", tempFiles[i].keywords);
            formData.append("adult", tempFiles[i].adult);
            formData.append("category", tempFiles[i].industry);
          } else {
            formData = {
              file: tempFiles[i].file,
              postName: tempFiles[i].file_name,
              fileType: tempFiles[i].file_type,
              experience: tempFiles[i].experience,
              keywords: tempFiles[i].keywords,
              adult: tempFiles[i].adult,
              category: tempFiles[i].industry,
            };
          }
          if (selectedTab === 2) {
            if (tempFiles[i].file.name) {
              link = "/api/image/createImage";
            } else {
              link = `/api/draft/uploadDraft`;
            }
          }
          setErrLst([]);
          axios
            .post(`${domain + link}`, formData, config)
            .then((res) => {
              if (selectedTab === 2) {
                axios
                  .post(
                    `${domain}/api/draft/deleteDraft`,
                    { id: temp_files[i]._id },
                    config
                  )
                  .then((res) => {
                    console.log(res.data);
                  });
              }
              console.log(res.data);
              try {
                temp_files[i].uploadStatus = "uploaded";
              } catch {
                console.log("Error");
              }
              if (selectedTab === 1) {
                setFiles([...temp_files]);
                if (type === "draft") {
                  getDraftFiles();
                }
              } else {
                setDraftFiles([...temp_files]);
              }
              if (type === "publish" && selectedTab === 1) {
                setUploaded1Success(true);
                setErrLst([]);
                setUploaded1SuccessTest(
                  `${temp_files[i].file_name.substring(
                    0,
                    15
                  )}... added successfully`
                );
                setTimeout(() => {
                  setUploaded1Success(false);
                }, 10000);
                setTimeout(() => {
                  afterUploadSuccess(type);
                }, 300);
              } else {
                afterUploadSuccess(type);
              }
            })
            .catch((err) => {
              console.log(i);
              temp_files[i].uploadStatus = "failed";
              if (selectedTab === 1) {
                setFiles([...temp_files]);
              } else {
                setDraftFiles([...temp_files]);
              }
            });
        }
      }
    }
  };

  const changeTab = (id) => {
    if (selectedTab === 1 && id === 2) {
      setErrLst([]);
      setSelectedTab(id);
      if (draftFiles.length > 0) {
        setSelectedFile(0);
        document.getElementById("file_name").value = draftFiles[0].file_name;
        document.getElementById("experience").value = draftFiles[0].experience;
        // document.getElementById("adult").checked = draftFiles[0].adult;
        setSelectedType(draftFiles[0].file_type);
        setSelectedKeywords(draftFiles[0].keywords);
        setSelectedSuggestedKeywords(draftFiles[0].suggestedKeywords);
        setSelectedIndustry(draftFiles[0].industry);
      } else {
        setSelectedFile(0);
        document.getElementById("file_name").value = "";
        document.getElementById("experience").value = "";
        // document.getElementById("adult").checked = "";
        setSelectedType("");
        setSelectedKeywords([]);
        setSelectedSuggestedKeywords(
          suggestedkwds.slice(0, suggestedkwds.length)
        );
        setSelectedIndustry("");
      }
    } else if (selectedTab === 2 && id === 1) {
      updateLimit();
      setErrLst([]);
      setSelectedTab(id);
      if (files.length > 0) {
        setSelectedFile(0);
        selectFirst();
        document.getElementById("file_name").value = files[0].file_name;
        document.getElementById("experience").value = files[0].experience;
        // document.getElementById("adult").checked = files[0].adult;
        setSelectedType(files[0].file_type);
        setSelectedKeywords(files[0].keywords);
        setSelectedSuggestedKeywords(files[0].suggestedKeywords);
        setSelectedIndustry(files[0].industry);
      } else {
        setSelectedFile(0);
        selectFirst();
        document.getElementById("file_name").value = "";
        document.getElementById("experience").value = "";
        // document.getElementById("adult").checked = "";
        setSelectedType("");
        setSelectedKeywords([]);
        setSelectedSuggestedKeywords(
          suggestedkwds.slice(0, suggestedkwds.length)
        );
        setSelectedIndustry("");
      }
    }
  };

  // const generateVideoSource = () => {
  //   if (selectedFileItem && selectedFileItem.file) {
  //     if (selectedFileItem.file.name) {
  //       return URL.createObjectURL(selectedFileItem.file);
  //     } else if (selectedFileItem.file) {
  //       return `${videoLink}/${selectedFileItem.file}`;
  //     }
  //   }
  //   return ''; // Default empty string if no valid source is found
  // };

  // const videoSource = generateVideoSource();


  

  return (
    <div style={{ position: "relative", background: "#F8FAFB" }}>
      <div className="subnav">
        <Container className="Container" maxWidth="xl">
          <div
            className={`subnav_link ${selectedTab === 1 && styles.tabSelected}`}
            onClick={() => changeTab(1)}
          >
            To Submit
          </div>
          <div
            className={`subnav_link ${selectedTab === 2 && styles.tabSelected}`}
            onClick={() => changeTab(2)}
          >
            Draft ({draftFiles.length})
          </div>
        </Container>
      </div>
      {uploaded1Success && (
        <div className="upload_file_success_alert">
          <Container maxWidth="xl">
            <Alert severity="success" style={{ width: "100%" }}>
              {uploaded1SuccessTest}
            </Alert>
          </Container>
        </div>
      )}
      <Container
        className="Container"
        style={{ paddingBottom: "20px" }}
        maxWidth="xl"
      >
        <div className={styles.upload_file}>
          <div className={styles.upload_file_left_container}>
            <label
              className={styles.upload_file_container}
              style={{
                cursor: files.length <= 0 && selectedTab === 1 && "pointer",
                display: "block",
              }}
              htmlFor="file_input"
              onDrop={(e) => console.log(e)}
            >
              {draftSuccess && (
                <Alert severity="success">Draft files saved successfully</Alert>
              )}

              {(selectedTab === 1 && files.length > 0) ||
              (selectedTab === 2 && draftFiles.length > 0) ? (
                <>
                  {selectedTab === 1 && files.length < 12 && (
                    <div className={styles.addMoreBtnContainer}>
                      <label htmlFor="add_file">
                        <span
                          className={`formBtn4 ${styles.customAddMoreStyle}`}
                          onClick={() => setAddMoreState(true)}
                        >
                          <AddIcon
                            style={{
                              backgroundColor: "white",
                              borderRadius: "20px",
                              marginRight: "5px",
                            }}
                          />
                          Add More
                        </span>
                        <input
                          type="file"
                          id="add_file"
                          multiple
                          style={{ display: "none" }}
                          onChange={fileSelected}
                          accept=".jpg, .jpeg, .png, .mp4, .mov"
                        />
                      </label>
                    </div>
                  )}
                  {/* <div className={styles.filePreviewDetails}>
                    <div className={styles.filePreviewContainer}>
                      <div className={styles.filePreviewTitle}>Post name: </div>
                      <div className={styles.filePreviewContent}>{(selectedTab === 1 ? files : draftFiles)[selectedFile].file_name}</div>
                    </div>
                    <div className={styles.filePreviewContainer}>
                      <div className={styles.filePreviewTitle}>Industry: </div>
                      <div className={styles.filePreviewContent}>{(selectedTab === 1 ? files : draftFiles)[selectedFile].industry}</div>
                    </div>
                  </div> */}
                  <div className={styles.filePreview}>
                    <div
                      className={styles.filePreviewBtn}
                      onClick={() => setPreview(true)}
                    >
                      {" "}
                      <VisibilityOutlinedIcon style={{ marginRight: "10px" }} />
                      Preview
                    </div>

                    {(selectedTab === 1 ? files : draftFiles)[selectedFile]
                      .file_type === "video" ? (
                      // <video
                      //   className={styles.upload_file_selected_file}
                      //   onClick={() => changeSelectedFile(selectedFile)}
                      // >
                      //   <source
                      //     src={
                      //       (selectedTab === 1 ? files : draftFiles)[selectedFile]
                      //         .file.name
                      //         ? URL.createObjectURL(
                      //             (selectedTab === 1 ? files : draftFiles)[
                      //               selectedFile
                      //             ].file
                      //           )
                      //         : `${videoLink}/${
                      //             (selectedTab === 1 ? files : draftFiles)[
                      //               selectedFile
                      //             ].file
                      //           }`
                      //     }
                      //     type="video/mp4"
                      //   />
                      //   <source
                      //     src={
                      //       (selectedTab === 1 ? files : draftFiles)[selectedFile]
                      //         .file.name
                      //         ? URL.createObjectURL(
                      //             (selectedTab === 1 ? files : draftFiles)[
                      //               selectedFile
                      //             ].file
                      //           )
                      //         : `${videoLink}/${
                      //             (selectedTab === 1 ? files : draftFiles)[
                      //               selectedFile
                      //             ].file
                      //           }`
                      //     }
                      //     type="video/ogg"
                      //   />
                      //   Your browser does not support the video tag.
                      // </video>
                      fileChangeLoading ? (
                        ""
                      ) : (
                        <video
                          className={styles.upload_file_selected_file}
                          key={
                            (selectedTab === 1 ? files : draftFiles)[
                              selectedFile
                            ].file
                          }
                          playsInline
                        >
                          <source
                            src={
                              (selectedTab === 1 ? files : draftFiles)[
                                selectedFile
                              ].file.name
                                ? URL.createObjectURL(
                                    (selectedTab === 1 ? files : draftFiles)[
                                      selectedFile
                                    ].file
                                  )
                                : `${videoLink}/${
                                    (selectedTab === 1 ? files : draftFiles)[
                                      selectedFile
                                    ].file
                                  }`
                            }
                            type="video/mp4"
                          />
                        </video>
                      )
                    ) : (
                      <img
                        src={
                          (selectedTab === 1 ? files : draftFiles)[selectedFile]
                            .file.name
                            ? URL.createObjectURL(
                                (selectedTab === 1 ? files : draftFiles)[
                                  selectedFile
                                ].file
                              )
                            : `${imageLink}/500x500/${
                                (selectedTab === 1 ? files : draftFiles)[
                                  selectedFile
                                ].file
                              }`
                        }
                        className={styles.upload_file_selected_file}
                      />
                    )}

                    {(selectedTab === 1 ? files : draftFiles)[selectedFile].file
                      .size /
                      1000000 >
                      ((selectedTab === 1 ? files : draftFiles)[selectedFile]
                        .file_type === "video"
                        ? videoSizeLimit
                        : (selectedTab === 1 ? files : draftFiles)[selectedFile]
                            .file_type === "3d"
                        ? img3dSizeLimit
                        : imgSizeLimit) && (
                      <div className={styles.upload_file_error_container}>
                        <HighlightOffOutlinedIcon
                          className={styles.upload_file_error_icon}
                        />
                        <div className={styles.upload_file_error_content}>
                          File size exceeded maximum{" "}
                          {(selectedTab === 1 ? files : draftFiles)[
                            selectedFile
                          ].file_type === "video"
                            ? videoSizeLimit
                            : (selectedTab === 1 ? files : draftFiles)[
                                selectedFile
                              ].file_type === "3d"
                            ? img3dSizeLimit
                            : imgSizeLimit}
                          MB
                        </div>
                      </div>
                    )}
                    {!(selectedTab === 1 ? files : draftFiles)[selectedFile]
                      .resolutionSatisfied && (
                      <div className={styles.upload_file_error_container}>
                        <HighlightOffOutlinedIcon
                          className={styles.upload_file_error_icon}
                        />
                        <div className={styles.upload_file_error_content}>
                          File Resolution should be minimum 1100x500
                        </div>
                      </div>
                    )}
                    {!(selectedTab === 1 ? files : draftFiles)[selectedFile]
                      .lengthSatisfied && (
                      <div className={styles.upload_file_error_container}>
                        <HighlightOffOutlinedIcon
                          className={styles.upload_file_error_icon}
                        />
                        <div className={styles.upload_file_error_content}>
                          Video length should not exceed {videoDuration} minute.
                        </div>
                      </div>
                    )}
                    {(selectedTab === 1 ? files : draftFiles)[selectedFile]
                      .uploadStatus !== "selected" && (
                      <div className={styles.upload_file_error_container}>
                        {(selectedTab === 1 ? files : draftFiles)[selectedFile]
                          .uploadStatus === "pending" ? (
                          <>
                            <PendingOutlinedIcon
                              className={styles.upload_file_success_icon}
                            />
                            <div className={styles.upload_file_success_content}>
                              Uploading
                            </div>
                          </>
                        ) : (selectedTab === 1 ? files : draftFiles)[
                            selectedFile
                          ].uploadStatus === "uploaded" ? (
                          <>
                            <CheckCircleOutlineIcon
                              className={styles.upload_file_success_icon}
                            />
                            <div className={styles.upload_file_success_content}>
                              Added successfully
                            </div>
                          </>
                        ) : (
                          <>
                            <HighlightOffOutlinedIcon
                              className={styles.upload_file_error_icon}
                            />
                            <div className={styles.upload_file_error_content}>
                              Upload failed
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {fileEditMore && (
                      <div
                        className={`${styles.fileDeleteChangeContainer} ${
                          fileEditOption !== selectedFile &&
                          styles.fileDeleteChangeIconContainer
                        }`}
                        onClick={() => setFileEditOption(selectedFile)}
                        onMouseLeave={() => setFileEditOption(false)}
                      >
                        {fileEditOption === selectedFile ? (
                          <>
                            <label
                              className={styles.fileDeleteChangeContent}
                              htmlFor="file_change"
                            >
                              Change
                              <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => fileChanged(e, selectedFile)}
                                accept=".jpg, .jpeg, .png, .mp4, .mov"
                                id="file_change"
                              />
                            </label>
                            <div
                              className={styles.fileDeleteChangeContent}
                              onClick={() =>
                                removeSelectedFile(
                                  selectedFile,

                                  (selectedTab === 1 ? files : draftFiles)[
                                    selectedFile
                                  ]._id
                                )
                              }
                            >
                              Remove
                            </div>
                          </>
                        ) : (
                          <MoreVertIcon
                            className={styles.fileDeleteChangeIcon}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {(selectedTab === 1 ? files : draftFiles).length > 1 && (
                    <>
                      <div style={{ textAlign: "center" }}>
                        {(selectedTab === 1 ? files : draftFiles).map(
                          (file, index) => {
                          
                            return (
                              <>
                                {file.uploadStatus !== "uploaded" && (
                                  <div
                                    className={`${
                                      styles.upload_file_selected_files_container
                                    } ${
                                      index === selectedFile
                                        ? styles.upload_file_selected_file_select_container
                                        : errLst.includes(index) &&
                                          styles.upload_file_selected_err
                                    }`}
                                    key={file.file.name || file._id}
                                  >
                                    {file.file_type === "video" ? (
                                
                                      // <video
                                      //   className={styles.upload_file_selected_file}
                                      //   onClick={() => changeSelectedFile(index)}
                                      // >
                                      //   <source
                                      //     src={
                                      //       file.file.name
                                      //         ? URL.createObjectURL(file.file)
                                      //         : `${videoLink}/${file.file}`
                                      //     }
                                      //     type="video/mp4"
                                      //   />
                                      //   <source
                                      //     src={
                                      //       file.file.name
                                      //         ? URL.createObjectURL(file.file)
                                      //         : `${videoLink}/${file.file}`
                                      //     }
                                      //     type="video/ogg"
                                      //   />
                                      //   Your browser does not support the video tag.
                                      // </video>
                                      fileChangeVideoLoading ? (
                                        ""
                                      ) : (
                                        <video
                                          className={
                                            styles.upload_file_selected_file
                                          }
                                          onClick={() =>
                                            changeSelectedFile(index)
                                          }
                                          playsInline
                                        >
                                        
                                          <source
                                            src={
                                              file.file.name
                                                ? URL.createObjectURL(file.file)
                                                : `${videoLink}/${file.file}`
                                            }
                                          />
                                        </video>
                                      )
                                    ) : fileChangeVideoLoading ? (
                                      ""
                                    ) : (
                                      <img
                                        src={
                                          file.file.name
                                            ? file.thumbnail ||
                                              `${imageLink}/static/upload_placeholder.png`
                                            : `${imageLink}/200x200/${file.file}`
                                        }
                                        className={
                                          styles.upload_file_selected_file
                                        }
                                        onClick={() =>
                                          changeSelectedFile(index)
                                        }
                                      />
                                    )
                                    // <p>sadf</p>
                                    }

                                    {file.file.size / 1000000 >
                                      (file.file_type === "video"
                                        ? videoSizeLimit
                                        : file.file_type === "3d"
                                        ? img3dSizeLimit
                                        : imgSizeLimit) && (
                                      <div
                                        className={
                                          styles.upload_file_error_container2
                                        }
                                        onClick={() =>
                                          changeSelectedFile(index)
                                        }
                                      >
                                        <HighlightOffOutlinedIcon
                                          className={
                                            styles.upload_file_error_icon2
                                          }
                                        />
                                        {/* <div className={styles.upload_file_error_content}>
                                    File size exceeded maximum{" "}
                                    {file.file_type === "video"
                                      ? videoSizeLimit
                                      : file.file_type === "3d"
                                      ? img3dSizeLimit
                                      : imgSizeLimit}
                                    MB
                                  </div> */}
                                      </div>
                                    )}
                                    {(!file.resolutionSatisfied ||
                                      !file.lengthSatisfied) && (
                                      <div
                                        className={
                                          styles.upload_file_error_container2
                                        }
                                        onClick={() =>
                                          changeSelectedFile(index)
                                        }
                                      >
                                        <HighlightOffOutlinedIcon
                                          className={
                                            styles.upload_file_error_icon2
                                          }
                                        />
                                        {/* <div className={styles.upload_file_error_content}>
                                    File Resolution should be minimum 1100x500
                                  </div> */}
                                      </div>
                                    )}
                                    {file.uploadStatus !== "selected" && (
                                      <div
                                        className={
                                          styles.upload_file_error_container2
                                        }
                                        onClick={() =>
                                          changeSelectedFile(index)
                                        }
                                      >
                                        {file.uploadStatus === "pending" ? (
                                          <>
                                            <PendingOutlinedIcon
                                              className={
                                                styles.upload_file_success_icon2
                                              }
                                            />
                                            {/* <div
                                        className={styles.upload_file_success_content}
                                      >
                                        Uploading
                                      </div> */}
                                          </>
                                        ) : file.uploadStatus === "uploaded" ? (
                                          <>
                                            <CheckCircleOutlineIcon
                                              className={
                                                styles.upload_file_success_icon2
                                              }
                                            />
                                            {/* <div
                                        className={styles.upload_file_success_content}
                                      >
                                        Uploaded successfully
                                      </div> */}
                                          </>
                                        ) : (
                                          <>
                                            <HighlightOffOutlinedIcon
                                              className={
                                                styles.upload_file_error_icon2
                                              }
                                            />
                                            {/* <div className={styles.upload_file_error_content}>
                                        Upload failed
                                      </div> */}
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            );
                          }
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : selectedTab === 1 ? (
                <>
                  <div className={styles.upload_file_icon_container}>
                    <div className={styles.upload_file_icon}>
                      <FilterOutlinedIcon
                        style={{
                          fontSize: "200px",
                          display: "block",
                          color: "#12e4b2",
                          margin: "auto",
                        }}
                      />
                      <div className={styles.upload_file_inst_title}>
                        Drag and drop to upload, or
                      </div>
                      <button
                        className={styles.upload_file_btn}
                        style={{ pointerEvents: "none" }}
                      >
                        Browse
                      </button>
                      <div className={styles.upload_file_desc}>
                        (Maximum{" "}
                        <span className={styles.upload_file_desc_count}>
                          12 shots
                        </span>{" "}
                        in One Go for smooth uploads)
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={fileSelected}
                    multiple
                    accept=".jpg, .jpeg, .png, .mp4, .mov"
                    id="file_input"
                    disabled={fileSelectDisabled}
                  />
                </>
              ) : (
                <Alert severity="info">There is no draft files yet</Alert>
              )}
            </label>
            {selectedTab === 1 ? (
              <div className="upload_file_restrictions_container">
                <div className="upload_file_restriction">
                  <CheckCircleOutlinedIcon className={styles.checkIcon} />{" "}
                  Maximum size: Images - {imgSizeLimit}MB; Video -{" "}
                  {videoSizeLimit}MB
                </div>
                <div className="upload_file_restriction">
                  <CheckCircleOutlinedIcon className={styles.checkIcon} />{" "}
                  Accepted formats: Images - JPEG/JPG/PNG, ; Video - MP4/MOV
                </div>
                <div className="upload_file_restriction">
                  <CheckCircleOutlinedIcon className={styles.checkIcon} /> Image
                  Resolution: Minimum - Width 1100px, Height 500px{" "}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className={styles.upload_file_input_parent_container}>
            <div className={styles.upload_file_input_container}>
              <div className={styles.upload_file_input_file}>
                <div className={styles.upload_file_input_thumbnail}>
                  {((selectedTab === 1 && files.length > 0) ||
                    (selectedTab === 2 && draftFiles.length > 0)) &&
                    ((selectedTab === 1 &&
                      files[selectedFile].file_type === "video") ||
                    (selectedTab === 2 &&
                      draftFiles[selectedFile].file_type === "video") ? (
                      // <video
                      //   style={{
                      //     height: "100%",
                      //     width: "100%",
                      //     objectFit: "cover",
                      //     borderRadius: "30px",
                      //   }}
                      // >
                      //   <source
                      //     src={
                      //       selectedTab === 1
                      //         ? URL.createObjectURL(files[selectedFile].file)
                      //         : draftFiles[selectedFile].file.name
                      //         ? URL.createObjectURL(
                      //             draftFiles[selectedFile].file
                      //           )
                      //         : `${videoLink}/${draftFiles[selectedFile].file}`
                      //     }
                      //     type="video/mp4"
                      //   />
                      //   <source
                      //     src={
                      //       selectedTab === 1
                      //         ? URL.createObjectURL(files[selectedFile].file)
                      //         : draftFiles[selectedFile].file.name
                      //         ? URL.createObjectURL(
                      //             draftFiles[selectedFile].file
                      //           )
                      //         : `${videoLink}/${draftFiles[selectedFile].file}`
                      //     }
                      //     type="video/ogg"
                      //   />
                      //   Your browser does not support the video tag.
                      // </video>
                      fileChangeLoading ? (
                        ""
                      ) : (
                        <video
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "30px",
                          }}
                          playsInline
                        >
                          <source
                            src={
                              selectedTab === 1
                                ? URL.createObjectURL(files[selectedFile].file)
                                : draftFiles[selectedFile].file.name
                                ? URL.createObjectURL(
                                    draftFiles[selectedFile].file
                                  )
                                : `${videoLink}/${draftFiles[selectedFile].file}`
                            }
                          />
                        </video>
                      )
                    ) : (
                      <img
                        src={
                          selectedTab === 1
                            ? URL.createObjectURL(files[selectedFile].file)
                            : draftFiles[selectedFile].file.name
                            ? URL.createObjectURL(draftFiles[selectedFile].file)
                            : `${imageLink}/50x50/${draftFiles[selectedFile].file}`
                        }
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "30px",
                        }}
                      />
                    ))}
                </div>
                <div className={styles.upload_file_input_filename}>
                  {selectedTab === 1 && files.length > 0
                    ? files[selectedFile].file_name_saved
                    : selectedTab === 2 && draftFiles.length > 0
                    ? draftFiles[selectedFile].file_name_saved
                    : "File name"}
                </div>
              </div>
              <div className={styles.upload_file_input}>
                <div className={styles.upload_file_input_title}>
                  <label style={{ cursor: "pointer" }} htmlFor="file_name">
                    Title
                  </label>
                </div>
                <input
                  className={`${styles.upload_file_input_field}`}
                  type="text"
                  id="file_name"
                  name="file_name"
                  defaultValue={
                    selectedTab === 1 && files.length > 0
                      ? files[selectedFile].file_name
                      : selectedTab === 2 && draftFiles.length > 0
                      ? draftFiles[selectedFile].file_name
                      : ""
                  }
                  onChange={changeHandler}
                  disabled={
                    (selectedTab === 1 && files.length <= 0) ||
                    (selectedTab === 2 && draftFiles.length <= 0)
                  }
                />
                <div
                  className="input_error_msg"
                  id="file_name_error"
                  style={{
                    display:
                      errLst.includes(selectedFile) &&
                      (document.getElementById("file_name").value === "" ||
                        !isPostNameValid(
                          selectedTab === 1 && files.length > 0
                            ? files[selectedFile].file_name
                            : selectedTab === 2 && draftFiles.length > 0
                            ? draftFiles[selectedFile].file_name
                            : ""
                        ))
                        ? "block"
                        : "none",
                  }}
                >
                  {!isPostNameValid(
                    selectedTab === 1 && files.length > 0
                      ? files[selectedFile].file_name
                      : selectedTab === 2 && draftFiles.length > 0
                      ? draftFiles[selectedFile].file_name
                      : ""
                  )
                    ? "Title should not be empty and should not contain special characters"
                    : "Title is required"}
                </div>
              </div>
              <div className={styles.upload_file_input}>
                <div className={styles.upload_file_input_title}>File type</div>
                <div className={styles.upload_file_type_container}>
                  <button
                    className={`${styles.upload_file_type} ${
                      ((selectedTab === 1 &&
                        files.length > 0 &&
                        selectedType === "image") ||
                        (selectedTab === 2 &&
                          draftFiles.length > 0 &&
                          selectedType === "image")) &&
                      styles.upload_file_type_active
                    }`}
                    onClick={() => changeFileType("image")}
                  >
                    Images
                  </button>
                  <button
                    className={`${styles.upload_file_type} ${
                      ((selectedTab === 1 &&
                        files.length > 0 &&
                        selectedType === "video") ||
                        (selectedTab === 2 &&
                          draftFiles.length > 0 &&
                          selectedType === "video")) &&
                      styles.upload_file_type_active
                    }`}
                    onClick={() => changeFileType("video")}
                  >
                    Videos
                  </button>
                  <button
                    className={`${styles.upload_file_type} ${
                      ((selectedTab === 1 &&
                        files.length > 0 &&
                        selectedType === "3d") ||
                        (selectedTab === 2 &&
                          draftFiles.length > 0 &&
                          selectedType === "3d")) &&
                      styles.upload_file_type_active
                    }`}
                    onClick={() => changeFileType("3d")}
                  >
                    3D Images
                  </button>
                </div>
              </div>
              <div className={styles.upload_file_input}>
                <div className={styles.upload_file_input_title}>
                  <label style={{ cursor: "pointer" }} htmlFor="industry">
                    Industry
                  </label>
                </div>
                {/* <select
                  className={`${styles.upload_file_input_field} inputBox`}
                  id="industry"
                  name="industry"
                  onChange={industryChangeHandler}
                  disabled={
                    (selectedTab === 1 && files.length <= 0) ||
                    (selectedTab === 2 && draftFiles.length <= 0)
                  }
                  value={selectedIndustry}
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry, index) => {
                    return (
                      <option key={index} value={industry}>
                        {industry}
                      </option>
                    );
                  })}
                </select> */}
                <Select
                  value={
                    selectedIndustry
                      ? { label: selectedIndustry, value: selectedIndustry }
                      : selectedIndustry
                  }
                  onChange={industryChangeHandler}
                  options={industries}
                  id="industry"
                  styles={{ ...customStyles }}
                  isDisabled={
                    (selectedTab === 1 && files.length <= 0) ||
                    (selectedTab === 2 && draftFiles.length <= 0)
                  }
                />
                <div
                  className="input_error_msg"
                  id="file_name_error"
                  style={{
                    display:
                      errLst.includes(selectedFile) && selectedIndustry === ""
                        ? "block"
                        : "none",
                  }}
                >
                  Industry is required
                </div>
              </div>
              <div className={styles.upload_file_input}>
                <div className={styles.upload_file_input_title}>
                  <label htmlFor="experience" style={{ cursor: "pointer" }}>
                    How would you describe this shot?(Optional)
                  </label>
                </div>
                <textarea
                  className={`${styles.upload_file_textarea}`}
                  id="experience"
                  name="experience"
                  onChange={changeHandler}
                  disabled={
                    (selectedTab === 1 && files.length <= 0) ||
                    (selectedTab === 2 && draftFiles.length <= 0)
                  }
                />
                <div
                  className="input_error_msg"
                  id="experience_error"
                  style={{
                    display: "none",
                  }}
                ></div>
              </div>
              <div className={styles.upload_file_input}>
                <div className={styles.upload_file_input_title}>
                  <label htmlFor="keyword" style={{ cursor: "pointer" }}>
                    Tags (maximum 10) &nbsp;
                    <Tooltip
                      title="Select tags based on industry."
                      placement="top"
                    >
                      <InfoIcon
                        sx={{ height: "14px", width: "14px", color: "#00e7fc" }}
                      />
                    </Tooltip>
                  </label>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    className={`${styles.upload_file_input_field}`}
                    type="text"
                    placeholder="Type and press enter to select."
                    id="keyword"
                    name="keyword"
                    onKeyUp={addkeyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setShowSuggestedTags(true);
                    }}
                    disabled={
                      (selectedTab === 1 && files.length <= 0) ||
                      (selectedTab === 2 && draftFiles.length <= 0)
                    }
                    onFocus={() => setShowSuggestedTags(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowSuggestedTags(false);
                      }, 250);
                    }}
                    autoComplete="off"
                  />
                  {showSuggestedTags &&
                    selectedSuggestedKeywords.length > 0 && (
                      <div
                        className={styles.suggestedBrands}
                        id="suggestedBrands"
                      >
                        {selectedSuggestedKeywords.map((item, i) => {
                          return (
                            <>
                              {item
                                .toLowerCase()
                                .includes(keyword.toLowerCase()) && (
                                <div
                                  className={styles.suggestBrands}
                                  onClick={() => addKwdFrmSug(i)}
                                  key={i}
                                >
                                  {item}
                                </div>
                              )}
                            </>
                          );
                        })}
                      </div>
                    )}
                </div>
                <div
                  className="input_error_msg"
                  id="file_name_error"
                  style={{
                    display:
                      errLst.includes(selectedFile) &&
                      selectedKeywords.length <= 0
                        ? "block"
                        : "none",
                  }}
                >
                  Tags minimum 1 is required
                </div>
                <div className={styles.upload_file_type_container}>
                  {selectedKeywords.map((keyword, index) => {
                    return (
                      <div
                        className={styles.upload_file_keyword}
                        key={index}
                        style={{ cursor: "default" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "default",
                          }}
                        >
                          <RemoveCircleIcon
                            sx={{ color: "#ff000080", cursor: "pointer" }}
                            onClick={() => removeSelectedKeyword(index)}
                          />{" "}
                          &nbsp; {keyword}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.upload_file_input}>
                {/* <div className={styles.upload_file_input_title}>Content</div>
                <label
                  style={{
                    display: "flex",
                    marginBottom: "30px",
                    cursor: "pointer",
                    width: "fit-content"
                  }}
                >
                  <input
                    type="checkbox"
                    id="adult"
                    onClick={checkboxChange}
                    disabled={
                      (selectedTab === 1 && files.length <= 0) ||
                      (selectedTab === 2 && draftFiles.length <= 0)
                    }
                  />
                  <span>Confirm 18+ viewable?</span>
                </label> */}
              </div>
              <div className={styles.uploadFileBtnContainer}>
                {selectedTab !== 2 && (
                  <Button
                    className="formBtn3"
                    onClick={() => publishFiles("draft")}
                    disabled={selectedTab !== 1 || files.length <= 0}
                    style={{
                      opacity:
                        selectedTab !== 1 || files.length <= 0 ? "0.7" : "1",
                    }}
                  >
                    Save as draft
                  </Button>
                )}
                {/* <Button
                  className="formBtn2"
                  onClick={publishFile}
                  disabled={
                    (selectedTab === 1 && files.length <= 0) ||
                    (selectedTab === 2 && draftFiles.length <= 0)
                  }
                  style = {{
                    opacity: ((selectedTab === 1 && files.length <= 0) ||
                    (selectedTab === 2 && draftFiles.length <= 0))?"0.7":"1",
                  }}
                >
                  Publish
                </Button> */}
                <Button
                  className="formBtn2 mb-0"
                  onClick={() => publishFiles("publish")}
                  disabled={
                    (selectedTab === 1 && files.length <= 0) ||
                    (selectedTab === 2 && draftFiles.length <= 0)
                  }
                  style={{
                    opacity:
                      (selectedTab === 1 && files.length <= 0) ||
                      (selectedTab === 2 && draftFiles.length <= 0)
                        ? "0.7"
                        : "1",
                  }}
                >
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          open={limitError}
          TransitionComponent={Transition}
          onClose={() => setLimitError(false)}
        >
          <DialogTitle>
            {`Limit exceeded ${
              !plan.includes("Platinum") ? "Upgrade to upload files" : ""
            }`}
          </DialogTitle>
          <DialogContent>
            <div className={styles.popupContentContainer}>
              <p>Image limit: {fileLimits.images}</p>
              <p>3D Image limit: {fileLimits.images3d}</p>
              <p>Video limit: {fileLimits.videos}</p>
            </div>
            <div className={styles.popupBtnContainer}>
              <Button
                className={styles.popupBtn1}
                onClick={() => setLimitError(false)}
              >
                Close
              </Button>
              {!plan.includes("Platinum") && (
                <Button
                  className={styles.popupBtn2}
                  onClick={() => Router.push("/pilot-pro")}
                >
                  Upgrade
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={multiSelectPopup}
          TransitionComponent={Transition}
          onClose={() => setMultiSelectPopup(false)}
        >
          <DialogTitle>Upgrade to select multiple files</DialogTitle>
          <DialogContent>
            <div className={styles.popupBtnContainer}>
              <Button
                className={styles.popupBtn1}
                onClick={() => setMultiSelectPopup(false)}
              >
                Close
              </Button>
              <Button
                className={styles.popupBtn2}
                onClick={() => Router.push("/pilot-pro")}
              >
                Upgrade
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={draftFileErrorPopup}
          TransitionComponent={Transition}
          onClose={() => setDraftFileErrorPopup(false)}
        >
          <DialogTitle>Upgrade to save files to draft.</DialogTitle>
          <DialogContent>
            <div className={styles.popupBtnContainer}>
              <Button
                className={styles.popupBtn1}
                onClick={() => setDraftFileErrorPopup(false)}
              >
                Close
              </Button>
              <Button
                className={styles.popupBtn2}
                onClick={() => Router.push("/pilot-pro")}
              >
                Upgrade
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={draftFileExistPopup}
          TransitionComponent={Transition}
          onClose={() => setDraftFileExistPopup(false)}
        >
          <DialogTitle sx={{ textAlign: "center", fontFamily: "roboto-bold" }}>
            You have draft files in your account. Do you want to continue upload
          </DialogTitle>
          <DialogContent>
            <div className={styles.popupBtnContainer}>
              <Button
                className={styles.popupBtn1}
                onClick={() => setDraftFileExistPopup(false)}
              >
                Upload new
              </Button>
              <Button
                className={styles.popupBtn2}
                onClick={() => {
                  changeTab(2);
                  setDraftFileExistPopup(false);
                }}
              >
                Continue draft
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={error}
          TransitionComponent={Transition}
          onClose={() => setError(false)}
        >
          <DialogTitle sx={{ textAlign: "center" }}>
            Something went wrong. Please try again.
          </DialogTitle>
          <DialogContent>
            <div className={styles.popupBtnContainer}>
              <Button
                className={styles.popupBtn1}
                onClick={() => setError(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          fullWidth={true}
          maxWidth={"md"}
          open={preview}
          TransitionComponent={Transition}
          onClose={() => setPreview(false)}
        >
          {preview && (
            <>
              <div
                className={styles.previewCloseIcon}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "10px",
                  cursor: "pointer",
                }}
                onClick={() => setPreview(false)}
              >
                <CloseIcon />
              </div>
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      flex: "1",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "roboto-bold",
                        fontSize: "22px",
                      }}
                    >
                      {(selectedTab === 1 ? files : draftFiles)[selectedFile]
                        .file_name || "- - - - - - - "}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontFamily: "roboto-regular",
                      }}
                    >
                      {(selectedTab === 1 ? files : draftFiles)[selectedFile]
                        .industry || "- - - - - - - "}
                    </div>
                  </div>
                  <Button className={styles.previewDownloadBtn}>
                    Download
                  </Button>
                </div>
                <div
                  style={{
                    width: "100%",
                    background: "#c5c5c5",
                    borderRadius: "10px",
                  }}
                >
                  {(selectedTab === 1 ? files : draftFiles)[selectedFile]
                    .file_type === "video" ? (
                    <video
                      className={styles.upload_file_selected_file}
                      onClick={() => changeSelectedFile(selectedFile)}
                      playsInline
                    >
                      <source
                        src={
                          (selectedTab === 1 ? files : draftFiles)[selectedFile]
                            .file.name
                            ? URL.createObjectURL(
                                (selectedTab === 1 ? files : draftFiles)[
                                  selectedFile
                                ].file
                              )
                            : `${videoLink}/${
                                (selectedTab === 1 ? files : draftFiles)[
                                  selectedFile
                                ].file
                              }`
                        }
                        type="video/mp4"
                      />
                      <source
                        src={
                          (selectedTab === 1 ? files : draftFiles)[selectedFile]
                            .file.name
                            ? URL.createObjectURL(
                                (selectedTab === 1 ? files : draftFiles)[
                                  selectedFile
                                ].file
                              )
                            : `${videoLink}/${
                                (selectedTab === 1 ? files : draftFiles)[
                                  selectedFile
                                ].file
                              }`
                        }
                        type="video/ogg"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={
                        (selectedTab === 1 ? files : draftFiles)[selectedFile]
                          .file.name
                          ? URL.createObjectURL(
                              (selectedTab === 1 ? files : draftFiles)[
                                selectedFile
                              ].file
                            )
                          : `${imageLink}/1200x0/${
                              (selectedTab === 1 ? files : draftFiles)[
                                selectedFile
                              ].file
                            }`
                      }
                      className={styles.upload_file_selected_file}
                      onClick={() => changeSelectedFile(selectedFile)}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
                <div style={{ display: "flex", marginTop: "20px" }}>
                  <div
                    style={{
                      height: "75px",
                      marginRight: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div className={styles.previewProfileContainer}>
                      <img
                        className={styles.previewProfilePic}
                        src={`${imageLink}/200x200/${userDetails.profilePic}`}
                        alt=""
                      />
                    </div>
                    <div>
                      <div className={styles.previewUsername}>
                        {userDetails.username}
                      </div>
                      <div className={styles.previewFollow}>Follow</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Dialog>
        <Dialog
          open={formatError}
          TransitionComponent={Transition}
          onClose={() => setFormatError(false)}
        >
          <div className="popupContainer">
            <h3 style={{ textAlign: "center" }}>
              File format incorrect select accepted formats mentioned below.
              jpg, jpeg, png, mp4, mov
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
          open={fileCountExceeded}
          TransitionComponent={Transition}
          onClose={() => setFileCountExceeded(false)}
        >
          <div className="popupContainer">
            <h3 style={{ textAlign: "center" }}>
              We are allowing maximum 12 shots in One Go for smooth uploads.
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
                onClick={() => setFileCountExceeded(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={
            curruptFileErr &&
            !fileCountExceeded &&
            !draftVideoLimitError &&
            !formatError
          }
          TransitionComponent={Transition}
          onClose={() => setCurruptFileErr(false)}
        >
          <div className="popupContainer">
            <h3 style={{ textAlign: "center" }}>Some shots are not valid.</h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                className="formBtn2"
                onClick={() => setCurruptFileErr(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={
            curruptFileErr1 &&
            !fileCountExceeded &&
            !draftVideoLimitError &&
            !formatError
          }
          TransitionComponent={Transition}
          onClose={() => setCurruptFileErr1(false)}
        >
          <div className="popupContainer">
            <h3 style={{ textAlign: "center" }}>This shots is not valid.</h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                className="formBtn2"
                onClick={() => setCurruptFileErr1(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={draftVideoLimitError}
          TransitionComponent={Transition}
          onClose={() => setDraftVideoLimitError(false)}
        >
          <div className="popupContainer">
            <h3 style={{ textAlign: "center" }}>
              You cannot save more than 10 videos to the draft.
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
                onClick={() => setDraftVideoLimitError(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      </Container>
    </div>
  );
}

export default UploadFiles;
