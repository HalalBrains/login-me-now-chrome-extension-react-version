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
import Modal from '@mui/material/Modal'
import trash from "../../../assets/images/trash.png"
const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));


const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 350,
      bgcolor: 'background.paper',
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

  // function drop(key) {
  //   // eslint-disable-next-line no-undef
  //   chrome.storage.local.get("loginMeNowTokens", function (data) {
  //     let tokens = data.loginMeNowTokens ? data.loginMeNowTokens : {};
  //     delete tokens[key];
  //     // eslint-disable-next-line no-undef
  //     chrome.storage.local.set({ loginMeNowTokens: tokens });
  //   });
  // }
  
    // filteredData.map((item, index)=> console.log(item, index));

    if (Object.keys(filteredData).length > 0) {
      for (const key in filteredData) {
        console.log(key, filteredData[key])
      }
    }

    


  return (
    <>
<div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="rounded-[8px]">
          <div className="flex justify-center"><img src={trash} alt="" /></div>
          <h1 className="text-center text-[#000000] font-bold my-4 text-[17px]">Are you sure you want to delete your account?</h1>
          <div className="flex justify-around">
            <button className="bg-[#d11a2a] hover:bg-[#ac0412] text-white font-bold py-2 px-4 rounded">Yes, Delete</button>
            <button className="bg-[#28a745] hover:bg-[#218838] text-white font-bold py-2 px-4 rounded" onClick={handleClose}>No, Cancel</button>
          </div>
        </Box>
      </Modal>
    </div>


      <Box className="w-full px-2">
        <Grid>
          <Demo>
            <List dense={dense}>
              {filteredData.map((item) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <Tooltip title="Delete" placement="left">
                      <IconButton edge="end" aria-label="delete" onClick={handleOpen}>
                        <DeleteIcon className="text-[#005E54] hover:text-[#d11a2a]"/>
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        item.site_icon_url === ""
                          ? defaultLogo
                          : item.site_icon_url
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.user_display_name}
                    secondary={item.site_url}
                  />
                </ListItem>
              ))}
            </List>
          </Demo>
        </Grid>
      </Box>
    </>
  );
}
