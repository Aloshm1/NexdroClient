import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import Gallery from "react-photo-gallery";
import Photo from "./Photo";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from "react-sortable-hoc";
import axios from "axios";
import Grid from "@mui/material/Grid";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;

/* popout the browser and maximize to see more rows! -> */
const SortablePhoto = SortableElement((item) => <Photo {...item} />);
const SortableGallery = SortableContainer(({ items }) => (
  <Gallery
    photos={items}
    renderImage={(props) => <SortablePhoto {...props} />}
  />
));

function RearrangeFiles(props) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (props.type === "images") {
      axios
        .post(
          `${domain}/api/rearrange/getRearrangedMedia`,
          { fileType: "image" },
          config
        )
        .then((res) => {
          console.log(res);
          if (res.data === "No file available") {
            axios
              .post(`${domain}/api/image/getApprovedImages`, config)
              .then((res) => {
                setItems(res.data);
              });
          } else {
            setItems(res.data[0].media);
          }
        })
        .catch(() => {
          axios
            .post(`${domain}/api/image/getApprovedImages`, config)
            .then((res) => {
              setApprovedImages(res.data);
            });
        });
    } else if (props.type === "3dimages") {
      axios
        .post(
          `${domain}/api/rearrange/getRearrangedMedia`,
          { fileType: "3d" },
          config
        )
        .then((res) => {
          console.log(res);
          if (res.data === "No file available") {
            axios
              .post(`${domain}/api/image/getApproved3d`, config)
              .then((res) => {
                setItems(res.data);
              });
          } else {
            setItems(res.data[0].media);
          }
        })
        .catch(() => {
          axios
            .post(`${domain}/api/image/getApproved3d`, config)
            .then((res) => {
              setApprovedImages(res.data);
            });
        });
    } else if (props.type === "videos") {
        axios
        .post(
          `${domain}/api/rearrange/getRearrangedMedia`,
          { fileType: "video" },
          config
        )
        .then((res) => {
          console.log(res);
          if (res.data === "No file available") {
            axios
              .post(`${domain}/api/image/getApprovedVideos`, config)
              .then((res) => {
                setItems(res.data);
              });
          } else {
            setItems(res.data[0].media);
          }
        })
        .catch(() => {
          axios
            .post(`${domain}/api/image/getApprovedVideos`, config)
            .then((res) => {
              setApprovedImages(res.data);
            });
        });
        
    }
  }, []);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMove(items, oldIndex, newIndex));
    props.testBtn(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div>
      <Grid container spacing={2} style={{ width: "100%" }}>
        <SortableGallery
          items={items}
          onSortEnd={onSortEnd}
          axis={"xy"}
          type={props.type}
        />
      </Grid>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {props.cancelButton}
        <div style={{ display: "inline-block" }}>{props.saveButton}</div>
      </div>
    </div>
  );
}

export default RearrangeFiles;
