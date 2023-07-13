import * as React from "react";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material";

export default function Search({ classNames, handleSearchChange }) {
  const theme = createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#005e55ef",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#005E54",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#005E54",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            "&.Mui-focused": {
              color: "#005E54",
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <TextField
        className={classNames}
        label="Search Your Website"
        InputProps={{
          type: "search",
        }}
        onChange={handleSearchChange}
      />
    </ThemeProvider>
  );
}
