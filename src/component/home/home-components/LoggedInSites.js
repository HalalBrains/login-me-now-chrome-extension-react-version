import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import defaultLogo from "../../../assets/images/wordpress.png";
import Modal from "@mui/material/Modal";
import trash from "../../../assets/images/trash.png";
import { Link } from "react-router-dom";

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

  const handleOpen = (key) => {
    setOpen(true);
    setSelectedKey(key); 
  };
  const handleClose = () => setOpen(false);

  console.log(searchQuery)


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
      console.log(tokens[key], tokens.key);
      delete tokens[key];
      setTokens(tokens);
      // eslint-disable-next-line no-undef
      chrome.storage.local.set({ loginMeNowTokens: tokens }, function () {});
    });
  }

  const entries = Object.entries(tokens);

  const listItems = [];
for (const [key, value] of entries) {
  // Check if searchQuery is an empty string or if it matches the user_display_name
  if (searchQuery.toLowerCase() === '' || value.user_display_name.toLowerCase().includes(searchQuery) || value.site_url.toLowerCase().includes(searchQuery)) {
    listItems.push(
      <ListItem key={key} secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={() => handleOpen(key)}>
            <DeleteIcon className="text-[#005E54] hover:text-[#d11a2a]" />
            </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar
            src={value.site_icon_url === "" || value.site_icon_url === null || value.site_icon_url === undefined ? defaultLogo : value.site_icon_url}
          />
        </ListItemAvatar>
        <ListItemText
          primary={value.user_display_name}
          secondary={value.site_url}
        />
      </ListItem>
    );
  }
}

  return (
    <>
      <Box
        className={`w-full px-2 h-[450px] ${
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
    </>
  );
}