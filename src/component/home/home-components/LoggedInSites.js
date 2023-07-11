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
import wordpressImage from '../../../assets/images/wordpress.png';

function generate(element) {
  return [0, 1, 2, 3].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function LoggedInSites() {
  const [dense] = React.useState(false);
  const [secondary] = React.useState(true);

  return (
    <Box className="w-full px-8">
      <Grid>
        <Demo>
          <List dense={dense}>
            {generate(
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar src={wordpressImage} />
                </ListItemAvatar>
                <ListItemText
                  primary="Softency"
                  secondary={secondary ? 'https://www.softency.com' : null}
                />
              </ListItem>,
            )}
          </List>
        </Demo>
      </Grid>
    </Box>
  );
}
