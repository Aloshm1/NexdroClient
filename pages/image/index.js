import { Container } from "@mui/system";
import React, { useState } from "react";
import Ivcss from "../../styles/imageView.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Grid } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Index() {
  let [commentsTab, setCommentsTab] = useState("comments");
  return (
    <div>
      <Container className={"Container"} sx={{ paddingTop: "30px" }}>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ float: "right", marginTop: "10px" }}>
            <button className={Ivcss.likeBtn}>
              <FavoriteBorderIcon />
              <span style={{ marginLeft: "5px" }}>Like</span>
            </button>
            <button className={Ivcss.downBtn}>
              <DownloadForOfflineIcon />
              <span style={{ marginLeft: "5px" }}>Free Download</span>
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
            <Grid item xl={8} lg={8}>
              <div style={{ height: "500px" }}>
                <img
                  src={`https://dn-nexevo-landing.s3.ap-south-1.amazonaws.com/lions_MM7947_0813_009210bbe18bb938fd3a38f37a4bd657f6bba0012c59123e6143976f201c05ce5cf.jpg`}
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
            <Grid item xl={4} lg={4}>
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
                      src="https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492"
                      className={Ivcss.pilotProfile}
                    />
                  </div>
                  <div style={{ marginLeft: "15px" }}>
                    <div className={Ivcss.ivName}>Yaseen Ahmed</div>
                    <div className={Ivcss.ivfollow}>Follow</div>
                  </div>
                </div>
                <Grid container spacing={0}>
                  <Grid item xl={6} lg={6}>
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
                  <Grid item xl={6} lg={6}>
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
                              src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492`}
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
                              src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492`}
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
                              src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492`}
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
                              src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492`}
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
                              src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492`}
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
                              src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492`}
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
                            src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492`}
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
                            src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492`}
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
                            src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492`}
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
                            src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492`}
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
                            src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492`}
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
                            src={`https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/a2763eee0f008972cba8a137f7447520dfb0a03a4e7ef853e9d098e9de77dbac89492`}
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
        <div>
          <div style={{ margin: "20px 0px" }}>
            <div className={Ivcss.ivHello}>Hello Everyone,</div>
            <div className={Ivcss.ivHello}>
              Test Experience Test Experience Test Experience Test Experience
              Test Experience Test Experience Test Experience Test Experience
              Test Experience Test Experience Test Experience Test Experience
              Test Experience Test Experience Test Experience Test Experience
              Test Experience Test Experience Test Experience Test Experience
              Test Experience
            </div>
            <div className={Ivcss.ivHello1}>Wanna create something great?</div>
            <div className={Ivcss.ivHello}>
              Feel Free to contact us{" "}
              <span style={{ color: "#00e7fc" }}>info@nexevo.in</span>
            </div>
          </div>
        </div>
        {/* //more Shoots */}
        <div style={{ marginBottom: "20px" }}>
          <div className={Ivcss.ivName}>More shots from Yaseen Ahmed</div>
          <Grid container spacing={2}>
            <Grid item lg={3} md={4} sm={6} xs={6}>
              <img
                src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/drone_photo_1st-prize-winner-category-travel-basilica-of-saint-francis-of-assisi-umbria-italy-by-fcattuto-e1482246142223902a714428102efdd1f7f4f83e387a8fe28dfbf77a72eb98502564cc33cd259c.webp`}
                className={Ivcss.ivSYML}
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={6}>
              <img
                src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/drone_photo_1st-prize-winner-category-travel-basilica-of-saint-francis-of-assisi-umbria-italy-by-fcattuto-e1482246142223902a714428102efdd1f7f4f83e387a8fe28dfbf77a72eb98502564cc33cd259c.webp`}
                className={Ivcss.ivSYML}
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={6}>
              <img
                src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/drone_photo_1st-prize-winner-category-travel-basilica-of-saint-francis-of-assisi-umbria-italy-by-fcattuto-e1482246142223902a714428102efdd1f7f4f83e387a8fe28dfbf77a72eb98502564cc33cd259c.webp`}
                className={Ivcss.ivSYML}
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={6}>
              <img
                src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/drone_photo_1st-prize-winner-category-travel-basilica-of-saint-francis-of-assisi-umbria-italy-by-fcattuto-e1482246142223902a714428102efdd1f7f4f83e387a8fe28dfbf77a72eb98502564cc33cd259c.webp`}
                className={Ivcss.ivSYML}
              />
            </Grid>
          </Grid>
        </div>
        {/* suggested shots */}
        <div style={{ marginBottom: "20px" }}>
          <div className={Ivcss.ivName}>Shots you might like</div>
          <Grid container spacing={2}>
            <Grid item lg={3} md={4} sm={6} xs={6}>
              <img
                src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/drone_photo_1st-prize-winner-category-travel-basilica-of-saint-francis-of-assisi-umbria-italy-by-fcattuto-e1482246142223902a714428102efdd1f7f4f83e387a8fe28dfbf77a72eb98502564cc33cd259c.webp`}
                className={Ivcss.ivSYML}
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={6}>
              <img
                src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/drone_photo_1st-prize-winner-category-travel-basilica-of-saint-francis-of-assisi-umbria-italy-by-fcattuto-e1482246142223902a714428102efdd1f7f4f83e387a8fe28dfbf77a72eb98502564cc33cd259c.webp`}
                className={Ivcss.ivSYML}
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={6}>
              <img
                src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/drone_photo_1st-prize-winner-category-travel-basilica-of-saint-francis-of-assisi-umbria-italy-by-fcattuto-e1482246142223902a714428102efdd1f7f4f83e387a8fe28dfbf77a72eb98502564cc33cd259c.webp`}
                className={Ivcss.ivSYML}
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={6}>
              <img
                src={`https://dn-nexevo-home.s3.ap-south-1.amazonaws.com/drone_photo_1st-prize-winner-category-travel-basilica-of-saint-francis-of-assisi-umbria-italy-by-fcattuto-e1482246142223902a714428102efdd1f7f4f83e387a8fe28dfbf77a72eb98502564cc33cd259c.webp`}
                className={Ivcss.ivSYML}
              />
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}

export default Index;
