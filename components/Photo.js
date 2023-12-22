import React from "react";
import Grid from "@mui/material/Grid";

const imgWithClick = { cursor: "pointer" };
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;

const Photo = ({ index, onClick, photo, margin, direction, top, left, type }) => {
  const imgStyle = { margin: margin };
  if (direction === "column") {
    imgStyle.position = "absolute";
    imgStyle.left = left;
    imgStyle.top = top;
    imgStyle.height = "100px";
    imgStyle.width = "100px";
  }

  const handleClick = event => {
    onClick(event, { photo, index });
  };

  return (
        <Grid item xl = {3} lg = {3} md = {4} sm = {3} xs = {4} style = {{padding: "5px"}}>
          {photo.fileType === "video" 
              ?
              <div style = {{height: "100%", width: "100%"}}>
                  <video playsInline
                  style={onClick ? { ...imgStyle, ...imgWithClick, width: "100%", height: "100%", borderRadius: "10px", objectFit: "cover" } : {...imgStyle, width: "100%", borderRadius: "10px", objectFit: "cover", height: "100%" }}
                  src={`${videoLink}/${photo.file}`}
                  onClick={onClick ? handleClick : null}
                  ></video>
              </div>
              :
              <img
              style={onClick ? { ...imgStyle, ...imgWithClick, width: "100%", borderRadius: "10px" } : {...imgStyle, width: "100%", borderRadius: "10px"}}
              src={`${imageLink}/300x300/${photo.file}`}
              onClick={onClick ? handleClick : null}
              alt="img"

              />
          }
        </Grid>
  );
};

export default Photo;
