import React, { useState } from "react";
import { TextField, createTheme, ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Error from "../../../Error";

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
  const [error, setError] = useState(false); // State to handle errors

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const accessHoursTimeStamp = accessHours;
    const expiration = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(accessHoursTimeStamp / 1000));

    generateToken(siteUrl, email, password, expiration);
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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid URL or password");
        }
        return response.json();
      })
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
          tokens[unique] = result;
          // eslint-disable-next-line no-undef
          chrome.storage.local.set({ loginMeNowTokens: tokens });
          navigate("/");
        });
      })
      .catch((error) => {
        setError(true);
      });
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

          <TextField
            name="accessHours"
            className="w-full text-[#00000099]"
            accessHours={accessHours}
            setAccessHours={setAccessHours}
            onChange={handleAccessHoursChange}
            InputProps={{
              type: "datetime-local",
            }}
          />

          <button className="bg-[#005E54] hover:bg-[#005e55ef] text-white font-bold py-3 rounded w-full mt-4">
            Login
          </button>
        </form>
        <p className="text-center text-[12px] mt-2 text-gray-500">
          This extension does not store any login data of your website.
        </p>
      </div>
      {error && <Error severity="error" content="Something Went Wrong!" />}
    </ThemeProvider>
  );
}

export default DashboardAccess;
