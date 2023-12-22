import { Container } from "@mui/system";
import React, { useState, useEffect } from "react";
import styles from "../../styles/uploadFiles.module.css";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import { Button } from "@mui/material";
import axios from "axios";
import Router from "next/router";
import { useRouter } from "next/router";
import Loader from "../../components/loader";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Select from "react-select";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const imageLink = process.env.NEXT_PUBLIC_CDN;

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

const customStyles = {
  control: (base, state) => ({
    ...base,
    fontSize: "13px",
    padding: "0px 10px",
    background: "#fff",
    borderRadius: "50px",
    border: "1px solid #ddd",
    marginBottom: "10px",
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

function EditFile({ suggestedKeywords, industriesLst }) {
  const router = useRouter();
  const [suggestedkwds, setSuggestedKwds] = useState(
    suggestedKeywords.map((x) => x.keyword)
  );
  const [industries, setIndustries] = useState(
    industriesLst.map((x) => x.industry)
  );
  const imgSizeLimit = 25;
  const img3dSizeLimit = 25;
  const videoSizeLimit = 100;
  const videoDuration = 5;
  const [selectedFile, setSelectedFile] = useState(0);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [fileEditMore, setFileEditMore] = useState(true);
  const [errLst, setErrLst] = useState([]);
  const [fileData, setFileData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const allowedFormats = ["jpg", "jpeg", "png", "mp4", "mov"];
  const [formatError, setFormatError] = useState(false);
  const [showSuggestedTags, setShowSuggestedTags] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [curruptFileErr1, setCurruptFileErr1] = useState(false);
  const [newFileChanged, setNewFileChanged] = useState(false)

  useEffect(() => {
    const options = industriesLst.map((d) => ({
      value: d.industry,
      label: d.industry,
    }));
    setIndustries([...options]);
    console.log(options);
    const { id } = router.query;
    axios
      .get(`${domain}/api/image/getImage/${id}`)
      .then((res) => {
        let file = res.data[0];
        let tempFile = {
          file: file.file,
          file_name_saved: file.postName,
          file_name: file.postName,
          file_type: file.fileType,
          industry: file.category,
          experience: file.experience,
          keywords: file.keywords,
          suggestedKeywords: suggestedkwds.filter(
            (x) => !file.keywords.includes(x)
          ),
          adult: file.adult,
          uploadStatus: "selected",
          resolutionSatisfied: true,
          lengthSatisfied: true,
        };
        console.log(file);
        setFileData(tempFile);
      })
      .catch((err) => {
        Router.push("/no-page-found");
      });
  }, []);
  const changeHandler = (e) => {
    console.log("Change")
    var temp_file = fileData;
    if (e.target.id === "file_name"){
      temp_file[e.target.name] = e.target.value.substring(0,101);
      document.getElementById("file_name").value = e.target.value.substring(0,101);
    }else if (e.target.id === "experience") {
      temp_file[e.target.name] = e.target.value.substring(0,201);
      document.getElementById("experience").value = e.target.value.substring( 0, 200 );
    }else{
      temp_file[e.target.name] = e.target.value;
    }
    setFileData({ ...temp_file });
    console.log(temp_file);
    document.getElementById(`${e.target.id}_error`).style.display = "none";
  };
  const checkboxChange = () => {
    let temp_file = fileData;
    temp_file.adult = !temp_file.adult;
    setFileData({ ...temp_file });
  };
  const addkeyword = (e) => {
    if (e.key === "Enter" && e.target.value.trim().length > 0) {
      setKeyword("");
      setShowSuggestedTags(false);
      document.getElementById("keyword_error").style.display = "none";
      var temp_file = fileData;
      if (
        temp_file.keywords.filter(
          (item) => e.target.value.toLowerCase() === item.toLowerCase()
        ).length === 0
      ) {
        console.log("not include in selected");
        if (
          fileData.suggestedKeywords.filter(
            (item) => e.target.value.toLowerCase() === item.toLowerCase()
          ).length !== 0
        ) {
          console.log("Include in suggested");
          let index = temp_file.suggestedKeywords.findIndex(
            (item) => e.target.value.toLowerCase() === item.toLowerCase()
          );
          temp_file.suggestedKeywords.splice(index, 1);
        }
        temp_file.keywords.push(e.target.value);
        setFileData({ ...temp_file });
      }
      document.getElementById("keyword").value = "";
    }
  };
  const removeSelectedKeyword = (index) => {
    let temp_files = fileData;
    temp_files.suggestedKeywords = [
      temp_files.keywords[index],
      ...temp_files.suggestedKeywords,
    ];
    temp_files.keywords.splice(index, 1);
    setFileData({ ...temp_files });
  };
  const addKwdFrmSug = (index) => {
    let temp_files = fileData;
    document.getElementById("keyword_error").style.display = "none";
    if (temp_files.keywords.length < 10) {
      temp_files.keywords = [
        ...temp_files.keywords,
        temp_files.suggestedKeywords[index],
      ];
      temp_files.suggestedKeywords.splice(index, 1);
      console.log(temp_files);
      setFileData({ ...temp_files });
    }
  };
  const industryChangeHandler = (value) => {
    var temp_file = fileData;
    temp_file.industry = value.value;
    console.log(temp_file);
    setFileData({ ...temp_file });
  };

  const getResolution = (file) => {
    var temp_file = fileData;
    if (file.type.split("/")[0] === "image") {
      var img = new Image();
      img.onload = function () {
        if (this.width >= 1100 && this.height >= 500) {
          temp_file.resolutionSatisfied = true;
        } else {
          temp_file.resolutionSatisfied = false;
        }
        setFileData({ ...temp_file });
        console.log(this.width + "x" + this.height);
      };
      img.src = URL.createObjectURL(file);
    } else {
      temp_file.resolutionSatisfied = true;
      setFileData({ ...temp_file });
    }
  };

  const fileChanged = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let temp_file = fileData;
      var file = e.target.files[0];
      var fileFormat = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      console.log(fileFormat);
      if (
        allowedFormats.includes(fileFormat) &&
        (file.type.includes("video") || file.type.includes("image"))
      ) {
        if (file.type.includes("image")){
          var img = new Image();
          img.onload = () => {
            temp_file.file = e.target.files[0];
            temp_file.file_type = e.target.files[0].type.split("/")[0];
            setFileData({ ...temp_file });
            getResolution(e.target.files[0]);
            console.log(temp_file.file.name);
          };
          img.onerror = function () {
            setCurruptFileErr1(true);
          };
          img.src = URL.createObjectURL(file);
        }else{
          const reader = new FileReader();
          reader.onload = () => {
            const media = new Audio(reader.result);
            media.onloadedmetadata = () => {
              console.log(media.duration)
              if (media.duration / 60 > videoDuration){
                temp_file.lengthSatisfied = false
              }else{
                temp_file.lengthSatisfied = true
              }
              temp_file.file = e.target.files[0];
              temp_file.file_type = e.target.files[0].type.split("/")[0];
              setFileData({ ...temp_file });
              getResolution(e.target.files[0]);
              console.log(temp_file.file.name);
              setNewFileChanged(true)
              setTimeout(() => {
                setNewFileChanged(false)
              }, 10)
            }
            media.onerror = function () {
              setCurruptFileErr1(true);
            };
          };
          reader.readAsDataURL(file);
          reader.onerror = function () {
            setCurruptFileErr1(true);
          };
        }
      } else {
        setFormatError(true);
      }
    }
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
  const publishFiles = async () => {
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    var tempFile = fileData;
    var error = false;
    var focusField = "";
    var req_fields = ["file_name", "industry", "experience", "keywords"];
    var link = `${domain}/api/image/editImage/${router.query.id}`;
    if (
      !tempFile.file.size ||
      (tempFile.file.size / 1000000 <=
        (tempFile.file_type === "video"
          ? videoSizeLimit
          : tempFile.file_type === "3d"
          ? img3dSizeLimit
          : imgSizeLimit) &&
        tempFile.resolutionSatisfied&&
        tempFile.lengthSatisfied)
    ) {
      for (var i = 0; i < req_fields.length; i++) {
        if (req_fields[i] !== "keywords" && req_fields[i] !== "experience") {
          if (tempFile[req_fields[i]] === "") {
            error = true;
            if (focusField === "") {
              focusField = req_fields[i];
            }
            document.getElementById(`${req_fields[i]}_error`).style.display =
              "block";
          }
        } else {
          if (tempFile.keywords.length <= 0) {
            error = true;
            if (focusField === "") {
              focusField = "keyword";
            }
            document.getElementById(`keyword_error`).style.display = "block";
          }
        }
      }
      if (!isPostNameValid(tempFile.file_name)) {
        error = true;
        focusField = "file_name";
        console.log(tempFile.file_name);
        document.getElementById("file_name_error").innerText =
          "Title should not be empty and should not contain special characters";
        document.getElementById("file_name_error").style.display = "block";
      }

      if (error) {
        document.getElementById(focusField).focus();
      } else {
        if (tempFile.uploadStatus === "selected") {
          tempFile.uploadStatus = "pending";
          setFileData({ ...tempFile });
          var formData;
          if (tempFile.file.name) {
            link = `${domain}/api/image/editImage/${router.query.id}`;
            formData = new FormData();
            formData.append("file", tempFile.file);
            formData.append("postName", tempFile.file_name);
            formData.append("fileType", tempFile.file_type);
            formData.append("experience", tempFile.experience);
            formData.append("keywords", tempFile.keywords);
            formData.append("adult", tempFile.adult);
            formData.append("category", tempFile.industry);
          } else {
            link = `${domain}/api/image/editImage1/${router.query.id}`;
            formData = {
              file: tempFile.file,
              postName: tempFile.file_name,
              fileType: tempFile.file_type,
              experience: tempFile.experience,
              keywords: `${tempFile.keywords}`,
              adult: tempFile.adult,
              category: tempFile.industry,
            };
          }
          console.log(formData);
          console.log(link);
          setIsLoading(true);
          axios
            .post(`${link}`, formData, config)
            .then((res) => {
              console.log(res.data);
              tempFile.uploadStatus = "uploaded";
              setFileData({ ...tempFile });
              Router.push({
                pathname: "/pilot-dashboard/activities",
                query: {
                  comment: "file-edited",
                },
              });
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err);
              tempFile.uploadStatus = "failed";
              setFileData({ ...tempFile });
              setIsLoading(false);
            });
        }
      }
    }
  };

  return (
    <>
      <Container className="Container" style={{ paddingBottom: "20px" }}>
        <div className={styles.upload_file}>
          <label
            className={styles.upload_file_container}
            style={{
              display: "block",
            }}
            htmlFor="file_input"
          >
            {fileData.file && (
              <div
                className={`${styles.upload_file_selected_files_container} ${styles.filePreview}`}
                style={{ cursor: "default" }}
              >
                {fileData.file_type === "video" ? (
                  // <video className={styles.upload_file_selected_file}>
                  //   <source
                  //     src={
                  //       fileData.file.name
                  //         ? URL.createObjectURL(fileData.file)
                  //         : `${videoLink}/${fileData.file}`
                  //     }
                  //     type="video/mp4"
                  //   />
                  //   <source
                  //     src={
                  //       fileData.file.name
                  //         ? URL.createObjectURL(fileData.file)
                  //         : `${videoLink}/${fileData.file}`
                  //     }
                  //     type="video/ogg"
                  //   />
                  //   Your browser does not support the video tag.
                  // </video>
                  newFileChanged ? "" : <video
                  className={styles.upload_file_selected_file}
                  playsInline
                >
                  <source src={
                    fileData.file.name
                      ? URL.createObjectURL(fileData.file)
                      : `${videoLink}/${fileData.file}`
                  }></source>
                </video>
                ) : (
                  <img
                    src={
                      fileData.file.name
                        ? URL.createObjectURL(fileData.file)
                        : `${imageLink}/500x500/${fileData.file}`
                    }
                    className={styles.upload_file_selected_file}
                  />
                )}

                {fileData.file.size / 1000000 >
                  (fileData.file_type === "video"
                    ? videoSizeLimit
                    : fileData.file_type === "3d"
                    ? img3dSizeLimit
                    : imgSizeLimit) && (
                  <div className={styles.upload_file_error_container}>
                    <HighlightOffOutlinedIcon
                      className={styles.upload_file_error_icon}
                    />
                    <div className={styles.upload_file_error_content}>
                      File size exceeded maximum{" "}
                      {fileData.file_type === "video"
                        ? videoSizeLimit
                        : fileData.file_type === "3d"
                        ? img3dSizeLimit
                        : imgSizeLimit}
                      MB
                    </div>
                  </div>
                )}
                {!fileData.resolutionSatisfied && (
                  <div className={styles.upload_file_error_container}>
                    <HighlightOffOutlinedIcon
                      className={styles.upload_file_error_icon}
                    />
                    <div className={styles.upload_file_error_content}>
                      File Resolution should be minimum 1100x500
                    </div>
                  </div>
                )}
                {!fileData.lengthSatisfied && (
                  <div className={styles.upload_file_error_container}>
                    <HighlightOffOutlinedIcon
                      className={styles.upload_file_error_icon}
                    />
                    <div className={styles.upload_file_error_content}>
                      Video length should not exceed {videoDuration} minute.
                    </div>
                  </div>
                )}
                {fileData.uploadStatus !== "selected" && (
                  <div className={styles.upload_file_error_container}>
                    {fileData.uploadStatus === "pending" ? (
                      <>
                        <PendingOutlinedIcon
                          className={styles.upload_file_success_icon}
                        />
                        <div className={styles.upload_file_success_content}>
                          Uploading
                        </div>
                      </>
                    ) : fileData.uploadStatus === "uploaded" ? (
                      <>
                        <CheckCircleOutlineIcon
                          className={styles.upload_file_success_icon}
                        />
                        <div className={styles.upload_file_success_content}>
                          Published successfully
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
                  <label
                    className={`${styles.fileDeleteChangeContainer} ${styles.fileDeleteChangeContent}`}
                    style={{ margin: "0px", paddingTop: "3px" }}
                    htmlFor="file_change"
                  >
                    Edit
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={fileChanged}
                      accept=".jpg, .jpeg, .png, .mp4, .mov"
                      id="file_change"
                    />
                  </label>
                )}
              </div>
            )}
          </label>
          <div className={styles.upload_file_input_parent_container}>
            <div className={styles.upload_file_input_container}>
              <div className={styles.upload_file_input_file}>
                <div className={styles.upload_file_input_thumbnail}>
                  {fileData.file_type && (
                    <>
                      {fileData.file_type === "video" ? (
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
                        //       fileData.file.name
                        //         ? URL.createObjectURL(fileData.file)
                        //         : `${videoLink}/${fileData.file}`
                        //     }
                        //     type="video/mp4"
                        //   />
                        //   <source
                        //     src={
                        //       fileData.file.name
                        //         ? URL.createObjectURL(fileData.file)
                        //         : `${videoLink}/${fileData.file}`
                        //     }
                        //     type="video/ogg"
                        //   />
                        //   Your browser does not support the video tag.
                        // </video>
                        newFileChanged ? "" : 
                        <video
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "30px",
                          }}
                          playsInline
                        >
                          <source src={
                            fileData.file.name
                              ? URL.createObjectURL(fileData.file)
                              : `${videoLink}/${fileData.file}`
                          }></source>
                        </video>
                      ) : (
                        <img
                          src={
                            fileData.file.name
                              ? URL.createObjectURL(fileData.file)
                              : `${imageLink}/50x50/${fileData.file}`
                          }
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "30px",
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
                <div className={styles.upload_file_input_filename}>
                  {fileData.file_name_saved || "File name"}
                </div>
              </div>
              <div className={styles.upload_file_input}>
                <div className={styles.upload_file_input_title}>
                  <label style={{ cursor: "pointer" }} htmlFor="file_name">
                    Title
                  </label>
                </div>
                <input
                  className={`${styles.upload_file_input_field} inputBox`}
                  type="text"
                  id="file_name"
                  name="file_name"
                  value={fileData.file_name || ""}
                  onChange={changeHandler}
                />
                <div
                  className="input_error_msg"
                  id="file_name_error"
                  style={{
                    display:
                      errLst.includes(selectedFile) &&
                      document.getElementById("file_name").value === ""
                        ? "block"
                        : "none",
                  }}
                >
                  Title is required
                </div>
              </div>
              <div className={styles.upload_file_input}>
                <div className={styles.upload_file_input_title}>File type</div>
                <div
                  className={styles.upload_file_type_container}
                  style={{ pointerEvents: "none", opacity: 0.7 }}
                >
                  <div
                    className={`${styles.upload_file_type} ${
                      fileData.file_type === "image" &&
                      styles.upload_file_type_active
                    }`}
                  >
                    Images
                  </div>
                  <div
                    className={`${styles.upload_file_type} ${
                      fileData.file_type === "video" &&
                      styles.upload_file_type_active
                    }`}
                  >
                    Videos
                  </div>
                  <div
                    className={`${styles.upload_file_type} ${
                      fileData.file_type === "3d" &&
                      styles.upload_file_type_active
                    }`}
                  >
                    3D Images
                  </div>
                </div>
              </div>
              <div className={styles.upload_file_input}>
                <div className={styles.upload_file_input_title}>
                  <label style={{ cursor: "pointer" }} htmlFor="industry">
                    Industry
                  </label>
                </div>
                <Select
                  value={
                    fileData.industry
                      ? { label: fileData.industry, value: fileData.industry }
                      : fileData.industry
                  }
                  onChange={industryChangeHandler}
                  options={industries}
                  id="industry"
                  styles={{ ...customStyles }}
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
                  className={`${styles.upload_file_textarea} inputBox`}
                  id="experience"
                  name="experience"
                  onChange={changeHandler}
                  value={fileData.experience}
                />
                <div
                  className="input_error_msg"
                  id="experience_error"
                  style={{
                    display: "none",
                  }}
                >
                </div>
              </div>
              <div className={styles.upload_file_input}>
                <div className={styles.upload_file_input_title}>
                  <label htmlFor="keyword" style={{ cursor: "pointer" }}>
                    Tags (maximum 10)
                  </label>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    className={`${styles.upload_file_input_field} inputBox`}
                    type="text"
                    placeholder="Type and press enter to select."
                    id="keyword"
                    name="keyword"
                    onKeyUp={addkeyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setShowSuggestedTags(true);
                      document.getElementById("keyword_error").style.display =
                        "none";
                    }}
                    onFocus={() => setShowSuggestedTags(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowSuggestedTags(false);
                      }, 250);
                    }}
                    autoComplete="off"
                  />
                  {showSuggestedTags &&
                  fileData.suggestedKeywords &&
                  fileData.suggestedKeywords.length ? (
                    <div
                      className={styles.suggestedBrands}
                      id="suggestedBrands"
                    >
                      {fileData.suggestedKeywords.map((item, i) => {
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
                  ) : (
                    ""
                  )}
                  <div
                    className="input_error_msg"
                    id="keyword_error"
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
                </div>
                <div className={styles.upload_file_type_container}>
                  {fileData.keywords &&
                    fileData.keywords.map((keyword, index) => {
                      return (
                        <div
                          className={styles.upload_file_keyword}
                          key={index}
                          style={{ cursor: "default" }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <RemoveCircleIcon
                              sx={{ color: "#ff000080", cursor: "pointer" }}
                              onClick={() => removeSelectedKeyword(index)}
                            />{" "}
                            {keyword}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              {/* <div className={styles.upload_file_input}>
                <div className={styles.upload_file_input_title}>Content</div>
                <label
                  style={{
                    display: "flex",
                    marginBottom: "30px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    id="adult"
                    onClick={checkboxChange}
                    checked={fileData.adult}
                    style={{ cursor: "pointer" }}
                  />
                  <div>Confirm 18+ viewable?</div>
                </label>
              </div> */}
              <div className={styles.uploadFileBtnContainer}>
                {isLoading ? (
                  <Button className="formBtn2">
                    <Loader /> Saving
                  </Button>
                ) : (
                  <Button className="formBtn2" onClick={publishFiles}>
                    Save changes
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
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
          open={
            curruptFileErr1 && !formatError
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
      </Container>
    </>
  );
}

export default EditFile;