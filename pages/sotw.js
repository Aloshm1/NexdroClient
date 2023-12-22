import { Container } from "@mui/system";
import React, { useState } from "react";
import Ivcss from "../styles/imageView.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Shoot from "../styles/sotw.module.css";
import { Grid } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Sowt() {
  let [commentsTab, setCommentsTab] = useState("comments");

  return (
    <div>
      <Container
        className="Container"
        style={{ paddingTop: "50px", marginBottom: "50px" }}
      >
       <h2 style={{ textAlign: "center" }}>Shoots of the week</h2>
        {/* //first post */}
        <div>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ float: "right", marginTop: "10px" }}>
            <button className={Ivcss.likeBtn}>
              <FavoriteBorderIcon />
              <span style={{ marginLeft: "5px" }}>Like</span>
            </button>
            <button className={Ivcss.downBtn}>
              <DownloadForOfflineIcon />
              <span style={{ marginLeft: "5px" }}>Download</span>
            </button>
            <button className={Ivcss.moreBtn}>
              <MoreVertIcon />
            </button>
          </div>
          <div className={Ivcss.IvTitle}>My First Post</div>
          <div className={Ivcss.IvIndustry}>Marriage Shoots</div>
        </div>
        {/* //image comments div */}
        <div>
          <Grid container>
            <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
              <div style={{ height: "500px" }}>
                <img
                  src={`https://d2sv1zkyiqv9y5.cloudfront.net/2500x0/nbnn/br/t-m-2v9x3cj1TAw-unsplashdfdc440efb9e34e1a01cacd2f0dc41d21435a9eb2c170f830d2256edd433f18f.jpg`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    cursor: "zoom-in",
                    borderRadius: "10px",
                  }}
                />
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div
                style={{
                  margin: "0px 10px",
                  border: "1px solid #b5b5b5",
                  borderRadius: "10px",
                }}
              >
                <div style={{ display: "flex", padding: "10px" }}>
                  <div>
                    <img
                      src="https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492"
                      className={Ivcss.pilotProfile}
                    />
                  </div>
                  <div style={{ marginLeft: "15px" }}>
                    <div className={Ivcss.ivName}>Yaseen Ahmed</div>
                    <div className={Ivcss.ivfollow}>Follow</div>
                  </div>
                </div>
                <Grid container spacing={0}>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <center>
                      <div
                        className={
                          commentsTab == "comments" ||
                          commentsTab == "newComment"
                            ? Ivcss.commentsNameActive
                            : Ivcss.commentsName
                        }
                        onClick={() => {
                          setCommentsTab("comments"),
                            document
                              .getElementById("scrollcomments")
                              .scrollTo(0, 0);
                        }}
                      >
                        Comments (12)
                      </div>
                    </center>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <div
                      className={
                        commentsTab == "likes"
                          ? Ivcss.commentsNameActive
                          : Ivcss.commentsName
                      }
                      style={{ borderLeft: "1px solid #e5e5e5" }}
                      onClick={() => setCommentsTab("likes")}
                    >
                      <center>Likes (14)</center>
                    </div>
                  </Grid>
                </Grid>
                <div
                  style={{ height: "360px", overflow: "auto" }}
                  id="scrollcomments"
                >
                  {commentsTab == "newComment" ? (
                    <div style={{ padding: "10px 20px" }}>
                      <div className={Ivcss.wrc}>Write a comment</div>
                      <textarea
                        type="text"
                        className="inputBox"
                        style={{
                          resize: "none",
                          height: "100px",
                          padding: "10px",
                          marginBottom: "10px",
                        }}
                      />
                      <div className={Ivcss.ivDownloadBtn}>Create</div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {commentsTab == "comments" ? (
                    <div>
                      <div>
                        <div style={{ margin: "10px" }}>
                          <div
                            className={Ivcss.addComment}
                            onClick={() => setCommentsTab("newComment")}
                          >
                            Add comment
                          </div>
                        </div>

                        <div style={{ margin: "10px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={`https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492`}
                              style={{
                                height: "45px",
                                width: "45px",
                                borderRadius: "22.5px",
                                cursor: "pointer",
                              }}
                            />{" "}
                            <div
                              className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                            >
                              Yaseen Ahmed
                            </div>
                          </div>
                          <div style={{ cursor: "pointer" }}>
                            <button className={Ivcss.ivcommentLike}>
                              <FavoriteIcon /> 12
                            </button>

                            <div className={Ivcss.commentActual}>Hello</div>
                          </div>
                        </div>

                        <hr className={Ivcss.ivHr} />
                        <div style={{ margin: "10px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={`https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492`}
                              style={{
                                height: "45px",
                                width: "45px",
                                borderRadius: "22.5px",
                                cursor: "pointer",
                              }}
                            />{" "}
                            <div
                              className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                            >
                              Yaseen Ahmed
                            </div>
                          </div>
                          <div style={{ cursor: "pointer" }}>
                            <button className={Ivcss.ivcommentLike}>
                              <FavoriteIcon /> 12
                            </button>

                            <div className={Ivcss.commentActual}>Hello</div>
                          </div>
                        </div>

                        <hr className={Ivcss.ivHr} />
                        <div style={{ margin: "10px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={`https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492`}
                              style={{
                                height: "45px",
                                width: "45px",
                                borderRadius: "22.5px",
                                cursor: "pointer",
                              }}
                            />{" "}
                            <div
                              className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                            >
                              Yaseen Ahmed
                            </div>
                          </div>
                          <div style={{ cursor: "pointer" }}>
                            <button className={Ivcss.ivcommentLike}>
                              <FavoriteIcon /> 12
                            </button>

                            <div className={Ivcss.commentActual}>Hello</div>
                          </div>
                        </div>

                        <hr className={Ivcss.ivHr} />
                        <div style={{ margin: "10px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={`https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492`}
                              style={{
                                height: "45px",
                                width: "45px",
                                borderRadius: "22.5px",
                                cursor: "pointer",
                              }}
                            />{" "}
                            <div
                              className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                            >
                              Yaseen Ahmed
                            </div>
                          </div>
                          <div style={{ cursor: "pointer" }}>
                            <button className={Ivcss.ivcommentLike}>
                              <FavoriteIcon /> 12
                            </button>

                            <div className={Ivcss.commentActual}>Hello</div>
                          </div>
                        </div>

                        <hr className={Ivcss.ivHr} />
                        <div style={{ margin: "10px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={`https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492`}
                              style={{
                                height: "45px",
                                width: "45px",
                                borderRadius: "22.5px",
                                cursor: "pointer",
                              }}
                            />{" "}
                            <div
                              className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                            >
                              Yaseen Ahmed
                            </div>
                          </div>
                          <div style={{ cursor: "pointer" }}>
                            <button className={Ivcss.ivcommentLike}>
                              <FavoriteIcon /> 12
                            </button>

                            <div className={Ivcss.commentActual}>Hello</div>
                          </div>
                        </div>

                        <hr className={Ivcss.ivHr} />
                        <div style={{ margin: "10px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={`https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492`}
                              style={{
                                height: "45px",
                                width: "45px",
                                borderRadius: "22.5px",
                                cursor: "zoom-in",
                              }}
                            />{" "}
                            <div
                              className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                            >
                              Yaseen Ahmed
                            </div>
                          </div>
                          <div style={{ cursor: "pointer" }}>
                            <button className={Ivcss.ivcommentLike}>
                              <FavoriteIcon /> 12
                            </button>

                            <div className={Ivcss.commentActual}>Hello</div>
                          </div>
                        </div>

                        <hr className={Ivcss.ivHr} />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {commentsTab == "likes" ? (
                    <div>
                      <div style={{ margin: "10px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={`https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492`}
                            style={{
                              height: "45px",
                              width: "45px",
                              borderRadius: "22.5px",
                              cursor: "pointer",
                            }}
                          />{" "}
                          <div
                            className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                          >
                            Yaseen Ahmed
                          </div>
                        </div>
                      </div>
                      <hr className={Ivcss.ivHr} />
                      <div style={{ margin: "10px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={`https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492`}
                            style={{
                              height: "45px",
                              width: "45px",
                              borderRadius: "22.5px",
                              cursor: "pointer",
                            }}
                          />{" "}
                          <div
                            className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                          >
                            Yaseen Ahmed
                          </div>
                        </div>
                      </div>
                      <hr className={Ivcss.ivHr} />
                      <div style={{ margin: "10px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={`https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492`}
                            style={{
                              height: "45px",
                              width: "45px",
                              borderRadius: "22.5px",
                              cursor: "pointer",
                            }}
                          />{" "}
                          <div
                            className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                          >
                            Yaseen Ahmed
                          </div>
                        </div>
                      </div>
                      <hr className={Ivcss.ivHr} />
                      <div style={{ margin: "10px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={`https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492`}
                            style={{
                              height: "45px",
                              width: "45px",
                              borderRadius: "22.5px",
                              cursor: "pointer",
                            }}
                          />{" "}
                          <div
                            className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                          >
                            Yaseen Ahmed
                          </div>
                        </div>
                      </div>
                      <hr className={Ivcss.ivHr} />
                      <div style={{ margin: "10px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={`https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492`}
                            style={{
                              height: "45px",
                              width: "45px",
                              borderRadius: "22.5px",
                              cursor: "pointer",
                            }}
                          />{" "}
                          <div
                            className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                          >
                            Yaseen Ahmed
                          </div>
                        </div>
                      </div>
                      <hr className={Ivcss.ivHr} />
                      <div style={{ margin: "10px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={`https://d2sv1zkyiqv9y5.cloudfront.net/75x75/profilePictures/b0241a47f0e5ef45610bad591a33128fc5e54e3910db4ae3c92c705b2aa7306389492`}
                            style={{
                              height: "45px",
                              width: "45px",
                              borderRadius: "22.5px",
                              cursor: "pointer",
                            }}
                          />{" "}
                          <div
                            className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                          >
                            Yaseen Ahmed
                          </div>
                        </div>
                      </div>
                      <hr className={Ivcss.ivHr} />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
        </div>
      </Container>
    </div>
  );
}

export default Sowt;
