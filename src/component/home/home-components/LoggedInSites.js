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

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function LoggedInSites({ searchQuery }) {
  const [dense] = useState(false);
  const [tokens, setTokens] = useState(null);

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
  

  return (
    <>
      <Box className="w-full px-6">
        <Grid>
          <Demo>
            <List dense={dense}>
              {filteredData.map((item) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <Tooltip title="Delete" placement="left">
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon style={{ color: "#005E54" }} />
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
