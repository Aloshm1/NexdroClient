import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import dashboardCss from "../../styles/DashboardSidebar.module.css";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Alert from "@mui/material/Alert";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));
function MyQueries() {
  let [data, setData] = useState([]);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/query/getQueries`, config).then((res) => {
      setData(res.data);
      if (res.data.length == 0) {
        document.getElementById("nqy").style.display = "block";
      } else {
        setExpanded(res.data[0]._id);
      }
    });
  }, []);
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return (
    <div>
      <div className={dashboardCss.Faq}>My Questions</div>
      <div style={{ marginTop: "20px" }}>
        <center>
          <div
            className={dashboardCss.Faq}
            style={{ display: "none" }}
            id="nqy"
          >
            <Alert severity="info">No Questions Yet</Alert>
          </div>
        </center>
        {data.map((item, i) => {
          return (
            <Accordion
              expanded={expanded === item._id}
              onChange={handleChange(item._id)}
              key={i}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>
                  {item.query}{" "}
                  <span
                    className={dashboardCss.queryBadge}
                    style={{
                      backgroundColor:
                        item.status === "pending" ? "#00e7fc" : "#4ffea3",
                    }}
                  >
                    {item.status === "pending" ? "Pending" : "Resolved"}
                  </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div style={{ fontFamily: "roboto-bold" }}>
                    {item.description}
                  </div>
                  <div style={{ wordBreak: "break-word" }}>
                    {item.answer ? item.answer : "No answer yet"}
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}

export default MyQueries;
