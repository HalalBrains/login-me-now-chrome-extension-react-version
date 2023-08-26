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
  const [isDeleted, setIssDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [somethingWrong, setSomethingWrong] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (paused) {
      toast.warn(`${"Extension Token Is Paused!"}`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setPaused(false);
    }
  }, [paused]);

  useEffect(() => {
    if (somethingWrong) {
      toast.error("Something Went Wrong!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setSomethingWrong(false);
    }
  }, [somethingWrong]);

  useEffect(() => {
    if (
      (location.state && location.state.success === true) ||
      (location.state && location.state.tokenSuccess === true) ||
      isDeleted
    ) {
      toast.success(
        `${
          location.state && location.state.success === true
            ? "Saved Successfully!"
            : isDeleted === true
            ? "Deleted Successfully!"
            : location.state && location.state.tokenSuccess === true
            ? "Token Saved Successfully!"
            : ""
        }`,
        {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  }, [location.state, isDeleted]);

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
      chrome.storage.local.set({ loginMeNowTokens: tokens }, function () {
        setIssDeleted(true);
      });
    });
  }

  const handleLoginToWebsite = (key) => {
    setIsLoading((prevState) => ({ ...prevState, [key]: true }));
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
          setIsLoading((prevState) => ({ ...prevState, [key]: false }));
          if (typeof result.data.status !== "undefined") {
            let message = `Something wen't wrong!`;
            // eslint-disable-next-line default-case
            switch (result.data.status) {
              case "pause":
                message = "Current token status is Paused.";
                setPaused(true);
                break;
              case "expired":
                message = "Current token status is Expired.";
                break;
              case "blocked":
                message = "Current token status is Blocked.";
                setSomethingWrong(true)
                break;
              // eslint-disable-next-line no-duplicate-case
              case "invalid":
                // eslint-disable-next-line no-unused-vars
                message = "Current token status is Invalid.";
                setSomethingWrong(true)
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
          setSomethingWrong(true);
          setIsLoading((prevState) => ({ ...prevState, [key]: false }));
        });
    });
  };

  const entries = Object.entries(tokens);
  const currentDatetime = new Date();
  const timestamp = currentDatetime.getTime() / 1000;
  const roundedTimeStamp = Math.floor(timestamp);

  const listItems = [];
  for (const [key, value] of entries) {
    const decodedToken = jwt(value.token === undefined ? value : value.token);
    const expiredDate = decodedToken.exp;

    if (
      searchQuery.toLowerCase() === "" ||
      value.user_display_name.toLowerCase().includes(searchQuery) ||
      value.site_url.toLowerCase().includes(searchQuery)
    ) {
      listItems.push(
        isLoading[key] ? (
          <div className="bg-[#dce5f3] mb-[5px] mx-[8px] rounded-[4px]">
            <div class="stage">
              <div class="dot-pulse"></div>
            </div>
          </div>
        ) : (
          <div
            className={
              roundedTimeStamp >= expiredDate
                ? `bg-red-300 rounded-[4px] mb-[5px] flex justify-between items-center mx-[8px]`
                : `hover:bg-[#dce5f3] hover:rounded-[4px] mb-[5px] flex justify-between items-center mx-[8px]`
            }
            key={key}
          >
            <div
              className={` ${
                roundedTimeStamp >= expiredDate
                  ? "flex items-center w-full py-3 pl-5 pointer-events-none"
                  : "flex items-center w-full py-3 pl-5 cursor-pointer"
              }`}
              onClick={() => handleLoginToWebsite(key)}
            >
              <img
                src={
                  value.site_icon_url === "" ||
                  value.site_icon_url === null ||
                  value.site_icon_url === undefined ||
                  value === "" ||
                  value === null ||
                  value === undefined ||
                  value === value.token
                    ? defaultLogo
                    : value.site_icon_url
                }
                alt=""
                className="h-10 w-10 rounded-full inline-block"
              />
              <div className="pl-4">
                <h1 className="text-[16px] font-medium">
                  {value.user_display_name === "" ||
                  value.user_display_name === null ||
                  value.user_display_name === undefined ||
                  value === "" ||
                  value === null ||
                  value === undefined ||
                  value === value.token
                    ? "Empty Name"
                    : value.user_display_name}
                </h1>
                <h6>
                  {value.site_url === "" ||
                  value.site_url === null ||
                  value.site_url === undefined ||
                  value === "" ||
                  value === null ||
                  value === undefined ||
                  value === value.token
                    ? "Empty Url"
                    : value.site_url}
                </h6>
              </div>
            </div>
            <Tooltip title="Delete" placement="left">
              <div
                onClick={() => handleOpen(key)}
                className="w-[4.75rem] flex justify-center items-center h-[72px] cursor-pointer hover:bg-[#f3dcdc] rounded-[4px] group"
              >
                <DeleteIcon className="text-[#005e5496] group-hover:text-[#d11a2a] transition-colors duration-300" />
              </div>
            </Tooltip>
          </div>
        )
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
      <ToastContainer />
    </>
  );
}
