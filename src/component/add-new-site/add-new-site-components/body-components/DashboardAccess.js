import { TextField, createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import Selector from "./Selector";

// Create a custom theme with the desired colors
const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#005e55ef',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#005E54',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#005E54',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#005E54',
          },
        },
      },
    },
  },
});

function DashboardAccess() {
  return (
    <ThemeProvider theme={theme}>
      <div className="mt-5">
        <TextField
          className="w-full margin-b-2"
          label="Site URL"
          placeholder="https://example.com"
          InputProps={{
            type: "text",
          }}
        />

        <TextField
          className="w-full margin-b-2"
          label="Username/Email"
          placeholder="example@email.com"
          InputProps={{
            type: "text",
          }}
        />

        <TextField
          className="w-full margin-b-2"
          label="Password"
          placeholder="********"
          InputProps={{
            type: "password",
          }}
        />

        <Selector classNames="w-full" />

        <button className="bg-[#005E54] hover:bg-[#005e55ef] text-white font-bold py-3 rounded w-full mt-4">
          Login
        </button>
        <p className="text-center text-[12px] mt-2 text-gray-500">This extension does not store any login data of your website.</p>
      </div>
    </ThemeProvider>
  );
}

export default DashboardAccess;
