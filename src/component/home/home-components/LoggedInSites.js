import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import {  Tooltip } from '@mui/material';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function LoggedInSites({searchQuery}) {
  const [dense] = useState(false);
  const [data, setData] = useState([]);
  

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then((response) => response.json())
      .then((data) => setData(data.slice(0, 50))); // Limiting to the first 49 items
  }, []);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + '...';
  };



  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.thumbnailUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );


  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get("loginMeNowTokens", function (data) {
      let tokens = data.loginMeNowTokens;

      console.log(tokens)
      
      for (const key in tokens) {
        const value = tokens[key];
        console.log(`${key} : ${value}`);
        
        if (typeof value === 'object' && value !== null) {
          for (const itemKey in value) {
            const itemValue = value[itemKey];
            // eslint-disable-next-line no-undef
            console.log(`${itemKey} :) ${itemValue}`);
          }
        }
      }
      
    });
  }, []);

  
  

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
                        <DeleteIcon  style={{color:"#005E54"}}/>
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={item.thumbnailUrl} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={truncateText(item.title, 40)}
                    secondary={item.thumbnailUrl}
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
