import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import defaultLogo from "../../../assets/images/wordpress.png";
import Modal from "@mui/material/Modal";
import trash from "../../../assets/images/trash.png";
import { Link, useLocation } from "react-router-dom";
import jwt from "jwt-decode";
import { Tooltip } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function LoggedInSites({ searchQuery }) {
  const [dense] = useState(false);
  const [tokens, setTokens] = useState({});
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const location = useLocation()
  console.log(location.state)

  const handleOpen = (key) => {
    setOpen(true);
    setSelectedKey(key);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get("loginMeNowTokens", function (data) {
      let tokens = data.loginMeNowTokens ? data.loginMeNowTokens : {};
      setTokens(tokens);
    });
  }, []);

  if (tokens === null) {
    return <div>Loading...</div>;
  }

  function drop(key) {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get("loginMeNowTokens", function (data) {
      let tokens = data.loginMeNowTokens ? data.loginMeNowTokens : {};
      delete tokens[key];
      setTokens(tokens);
      // eslint-disable-next-line no-undef
      chrome.storage.local.set({ loginMeNowTokens: tokens }, function () {});
    });
  }

  const handleLoginToWebsite = (key) => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get("loginMeNowTokens", function (data) {
      let tokens = data.loginMeNowTokens;
      const { site_url, token } = tokens[key];
      let formdata = new FormData();
      formdata.append("token", token);
      let requestOptions = {
        method: "POST",
        body: formdata,
      };

      fetch(
        `${site_url}/wp-json/login-me-now/generate-onetime-number`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (typeof result.data.status !== "undefined") {
            let message = `Something wen't wrong!`;
            // eslint-disable-next-line default-case
            switch (result.data.status) {
              case "pause":
                message = "Current token status is Paused.";
                break;
              case "expired":
                message = "Current token status is Expired.";
                break;
              case "blocked":
                message = "Current token status is Blocked.";
                break;
              // eslint-disable-next-line no-duplicate-case
              case "blocked":
                // eslint-disable-next-line no-unused-vars
                message = "Current token status is Blocked.";
                break;
            }
            return;
          }
          // eslint-disable-next-line no-undef
          chrome.tabs.create({
            url: result.data.link + "&extension=chrome",
            active: false,
          });
        })
        .catch((error) => {
          console.log("error", error);
          // selectedCard.classList.remove("validating");
        });
    });
  };

  const entries = Object.entries(tokens);

  const currentDatetime = new Date();
  const timestamp = currentDatetime.getTime() / 1000;
  const roundedTimeStamp = Math.floor(timestamp);

  const listItems = [];
  for (const [key, value] of entries) {
    // expire date code start from here
    const decodedToken = jwt(value.token);
    const expiredDate = decodedToken.exp;

    // expire date code end from here

    if (
      searchQuery.toLowerCase() === "" ||
      value.user_display_name.toLowerCase().includes(searchQuery) ||
      value.site_url.toLowerCase().includes(searchQuery)
    ) {
      listItems.push(
        <div
          key={key}
          className={
            roundedTimeStamp >= expiredDate
              ? `bg-red-300 rounded-[4px] mb-[5px] flex justify-between items-center mx-[8px]`
              : `hover:bg-[#dce5f3] hover:rounded-[4px] mb-[5px] flex justify-between items-center mx-[8px]`
          }
        >
          <div
            className="flex items-center w-full py-3 pl-5"
            onClick={() => handleLoginToWebsite(key)}
          >
            <img
              src={
                value.site_icon_url === "" ||
                value.site_icon_url === null ||
                value.site_icon_url === undefined
                  ? defaultLogo
                  : value.site_icon_url
              }
              alt=""
              className="h-10 w-10 rounded-full inline-block"
            />
            <div className="pl-4">
              <h1 className="text-[16px] font-medium">
                {value.user_display_name}
              </h1>
              <h6>{value.site_url}</h6>
            </div>
          </div>

          <Tooltip title="Delete" placement="left">
            <div
              onClick={() => handleOpen(key)}
              className="w-[4.75rem] flex justify-center items-center h-[66px] cursor-pointer hover:bg-[#f3dcdc] rounded-[4px] group"
            >
              <DeleteIcon className="text-[#005e5496] group-hover:text-[#d11a2a] transition-colors duration-300" />
            </div>
          </Tooltip>
        </div>
      );
    }
  }

  return (
    <>
      <Box
        className={`w-full h-[450px] ${
          listItems.length === 0 && "flex justify-center items-center "
        }`}
      >
        <Grid>
          <Demo>
            <List dense={dense}>
              {listItems.length === 0 && (
                <div className="text-center">
                  <p>No Website Found</p>
                  <Link to="/add-new-site">
                    <button className="bg-[#005E54] hover:bg-[#005e55ef] text-white font-bold py-3 rounded w-full mt-4">
                      Add New Site
                    </button>
                  </Link>
                </div>
              )}
              {listItems}
            </List>
          </Demo>
        </Grid>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="rounded-[8px]">
          <div className="flex justify-center">
            <img src={trash} alt="" />
          </div>
          <h1 className="text-center text-[#000000] font-bold my-4 text-[17px]">
            Are you sure you want to delete your account?
          </h1>
          <div className="flex justify-around">
            <button
              className="bg-[#d11a2a] hover:bg-[#ac0412] text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                handleClose();
                if (selectedKey !== null) {
                  drop(selectedKey);
                }
              }}
            >
              Yes, Delete
            </button>
            <button
              className="bg-[#28a745] hover:bg-[#218838] text-white font-bold py-2 px-4 rounded"
              onClick={handleClose}
            >
              No, Cancel
            </button>
          </div>
        </Box>
      </Modal>
      {// eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
    if (location.state && location.state.success === true) {
      toast.success('Saved Successfully', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [location.state])}
      
      <ToastContainer />
    </>
  );
}
