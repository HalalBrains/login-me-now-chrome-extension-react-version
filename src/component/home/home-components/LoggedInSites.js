import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import defaultLogo from "../../../assets/images/wordpress.png";
import Modal from "@mui/material/Modal";
import trash from "../../../assets/images/trash.png";
import { useLocation } from "react-router-dom";
import jwt from "jwt-decode";
import { Tooltip } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [somethingWrong, setSomethingWrong] = useState(false);
  const location = useLocation();
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get("loginMeNowTokens", function (data) {
      let tokens = data.loginMeNowTokens ? data.loginMeNowTokens : {};
      setTokens(tokens);

      const entries = Object.entries(tokens);
      const currentDatetime = new Date();
      const timestamp = currentDatetime.getTime() / 1000;
      const roundedTimeStamp = Math.floor(timestamp);

      const storedOrder = data.loginMeNowOrder || entries.map(([key]) => key);

      const updatedListItems = storedOrder.map((key) => {
        const value = tokens[key];
        const decodedToken = jwt(value.token === undefined ? value : value.token);
        const expiredDate = decodedToken.exp;

        return {
          key: key,
          value: isLoading[key] ? (
            <div className="bg-[#dce5f3] mb-[5px] mx-[8px] rounded-[4px]">
              <div className="stage">
                <div className="dot-pulse"></div>
              </div>
            </div>
          ) : (
            <div
              draggable
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
          ),
        };
      });

      setListItems(updatedListItems);
    });
  }, [isLoading, somethingWrong, location.state, isDeleted]);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedListItems = Array.from(listItems);
    const [removed] = reorderedListItems.splice(result.source.index, 1);
    reorderedListItems.splice(result.destination.index, 0, removed);

    setListItems(reorderedListItems);

    // Store the updated order in local storage
    const updatedOrder = reorderedListItems.map((item) => item.key);
    // eslint-disable-next-line no-undef
    chrome.storage.local.set({ loginMeNowOrder: updatedOrder });
  };

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
            let message = `Something went wrong!`;
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
                break;
              default:
                break;
            }
            toast.warn(message, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
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

  const handleOpen = (key) => {
    setOpen(true);
    setSelectedKey(key);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedKey(null);
  };

  const drop = (key) => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get("loginMeNowTokens", function (data) {
      let tokens = data.loginMeNowTokens ? data.loginMeNowTokens : {};
      delete tokens[key];
    // eslint-disable-next-line no-undef
      chrome.storage.local.set({ loginMeNowTokens: tokens }, function () {
        setIsDeleted(true);
      });
    });
  };

  return (
    <>
      <Box
        className={`w-full h-[450px] ${
          listItems.length === 0 && "flex justify-center items-center "
        }`}
      >
        <Grid>
          <Demo>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {listItems.map((item, index) => (
                      <Draggable
                        key={item.key}
                        draggableId={item.key}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {item.value}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
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
