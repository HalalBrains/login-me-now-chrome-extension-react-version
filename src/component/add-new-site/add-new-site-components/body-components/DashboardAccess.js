import { TextField, createTheme, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "../../../Error";
// import Selector from "./Selector";

// Create a custom theme with the desired colors
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

function DashboardAccess() {
  const [siteUrl, setSiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessHours, setAccessHours] = useState("");

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let expiration = getExpirationInDay(accessHours)
    generateToken(siteUrl, email, password, expiration)
  };

  function generateToken(siteUrl, username, password, expiration) {
    let formdata = new FormData();
    formdata.append("username", username);
    formdata.append("password", password);
    formdata.append("expiration", expiration);


    let requestOptions = {
      method: "POST",
      body: formdata,
    };
    
    fetch(`${siteUrl}/wp-json/login-me-now/generate`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (
          typeof result !== "undefined" &&
          typeof result.data !== "undefined" &&
          typeof result.data.status !== "undefined"
        ) {
          console.log("error");
          return;
        }

        let unique = Date.now();
        // eslint-disable-next-line no-undef
        chrome.storage.local.get("loginMeNowTokens", function (data) {
          let tokens = data.loginMeNowTokens ? data.loginMeNowTokens : {};
          console.log(tokens)
          tokens[unique] = result;
          // eslint-disable-next-line no-undef
          chrome.storage.local.set({ loginMeNowTokens: tokens });
          navigate("/")
          console.log("success");
        });
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }

  function getExpirationInDay(expiration) {
    let day = 7;
    switch (expiration) {
      case "lifetime":
        day = 1000;
        break;
      case "year":
        day = 365;
        break;
      case "month":
        day = 31;
        break;
      case "week":
        day = 7;
        break;
      case "day":
        day = 1;
        break;
      default:
        day = 7;
        break;
    }
  
    return day;
  }

  // Event handler for TextField onChange
  const handleSiteUrlChange = (e) => {
    setSiteUrl(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleAccessHoursChange = (e) => {
    setAccessHours(e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="mt-5">
        <form onSubmit={handleSubmit}>
          <TextField
            name="siteUrl"
            className="w-full margin-b-2"
            label="Site URL"
            placeholder="https://example.com"
            InputProps={{
              type: "text",
            }}
            value={siteUrl}
            onChange={handleSiteUrlChange}
          />

          <TextField
            name="email"
            className="w-full margin-b-2"
            label="Username/Email"
            placeholder="example@email.com"
            InputProps={{
              type: "text",
            }}
            value={email}
            onChange={handleEmailChange}
          />

          <TextField
            name="password"
            className="w-full margin-b-2"
            label="Password"
            placeholder="********"
            InputProps={{
              type: "password",
            }}
            value={password}
            onChange={handlePasswordChange}
          />

          <select
            classNames="w-full"
            onChange={handleAccessHoursChange}
            name="accessHours"
          >
            <option value="day">1 Day</option>
            <option value="week">1 Week</option>
            <option value="month">1 Month</option>
            <option value="year">1 Year</option>
          </select>

          <button className="bg-[#005E54] hover:bg-[#005e55ef] text-white font-bold py-3 rounded w-full mt-4">
            Login
          </button>
        </form>
        <p className="text-center text-[12px] mt-2 text-gray-500">
          This extension does not store any login data of your website.
        </p>
      </div>
    </ThemeProvider>
  );
}

export default DashboardAccess;
