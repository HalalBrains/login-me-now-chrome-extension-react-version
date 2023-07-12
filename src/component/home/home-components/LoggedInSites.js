import * as React from 'react';
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
// import wordpressImage from '../../../assets/images/wordpress.png';
import { TextField, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';


const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function LoggedInSites() {
  const [dense] = useState(false);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState()

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then((response) => response.json())
      .then((data) => setData(data.slice(0, 49))); // Limiting to the first 4 items
  }, []);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + '...';
  };

  // filter search items
  const filteredData = data.filter((item) =>
  item.title.toLowerCase().includes(searchQuery.toLowerCase())
);

const handleSearchChange = (event) => {
  setSearchQuery(event.target.value);
};

  return (
  <>
  <TextField label="search" className='w-full' onChange={handleSearchChange} value={searchQuery}/>
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
