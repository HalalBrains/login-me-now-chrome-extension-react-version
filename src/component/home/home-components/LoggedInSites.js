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

export default function LoggedInSites({searchQuery, setSearchQuery}) {
  const [dense] = useState(false);
  const [data, setData] = useState([]);
  

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then((response) => response.json())
      .then((data) => setData(data.slice(0, 49))); // Limiting to the first 49 items
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
                        <DeleteIcon />
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
