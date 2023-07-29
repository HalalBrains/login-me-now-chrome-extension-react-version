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
import { Tooltip } from "@mui/material";
import defaultLogo from "../../../assets/images/wordpress.png";
import Modal from "@mui/material/Modal";
import trash from "../../../assets/images/trash.png";

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
  const [tokens, setTokens] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get("loginMeNowTokens", function (data) {
      let tokens = data.loginMeNowTokens;
      setTokens(tokens);
      console.log(tokens);
    });
  }, []);



  if (tokens === null) {
    return <div>Loading...</div>;
  }

  const myData = Object.values(tokens);
  const filteredData = myData.filter((item) => {
    const displayName = item.user_display_name
      ? item.user_display_name.toLowerCase()
      : "";
    const siteUrl = item.site_url ? item.site_url.toLowerCase() : "";

    return (
      displayName.includes(searchQuery.toLowerCase()) ||
      siteUrl.includes(searchQuery.toLowerCase())
    );
  });
  

  function drop(key) {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get("loginMeNowTokens", function (data) {
      let tokens = data.loginMeNowTokens ? data.loginMeNowTokens : {};
      console.log(tokens[key], tokens.key)
      delete tokens[key]; 
      setTokens(tokens)
      // eslint-disable-next-line no-undef
      chrome.storage.local.set({ loginMeNowTokens: tokens }, function () {
        
      });
    });
  }
  
  
  const entries = Object.entries(tokens);

  const listItems = [];
  for (const [key, value] of entries) {
    listItems.push(
      <ListItem
        key={key}
        secondaryAction={
          <Tooltip title="Delete" placement="left">
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => drop(key)}
            >
              <DeleteIcon className="text-[#005E54] hover:text-[#d11a2a]" />
            </IconButton>
          </Tooltip>
        }
      >
        <ListItemAvatar>
          <Avatar
            src={
              value.site_icon_url === "" ? defaultLogo : value.site_icon_url
            }
          />
        </ListItemAvatar>
        <ListItemText
          primary={value.user_display_name}
          secondary={value.site_url}
        />
      </ListItem>
    );
  }

  return (
    <>
      <Box className="w-full px-2">
        <Grid>
          <Demo>
            <List dense={dense}>
              {listItems}
            </List>
          </Demo>
        </Grid>
      </Box>
    </>
  );
}