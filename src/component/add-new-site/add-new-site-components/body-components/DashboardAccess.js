import { TextField, createTheme, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log the data before saving to chrome.storage.local
    console.log("Submitted data:");
    console.log("Site URL:", siteUrl);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Access Hours:", accessHours);

    // Check if any of the data fields are empty, undefined, or null
    if (siteUrl === "" || email === "" || password === "" || accessHours === "") {
      console.error("Data saving error: Some fields are empty or undefined.");
      return;
    }

    // eslint-disable-next-line no-undef
    chrome.storage.local.set({ siteUrl, email, password, accessHours }, function () {
      // eslint-disable-next-line no-undef
      if (chrome.runtime.lastError) {
        // eslint-disable-next-line no-undef
        console.error("Data sending error:", chrome.runtime.lastError.message);
      } else {
        console.log("Data saved to chrome.storage.local:");
        console.log(JSON.stringify({ siteUrl, email, password, accessHours }, null, 2));

        // eslint-disable-next-line no-undef
        chrome.storage.local.get(
          ["siteUrl", "email", "password", "accessHours"],
          function (result) {
            const savedSiteUrl = result.siteUrl || "";
            const savedEmail = result.email || "";
            const savedPassword = result.password || "";
            const savedAccessHours = result.accessHours || "";

            // Compare the saved data with the original input values
            if (
              savedSiteUrl === siteUrl &&
              savedEmail === email &&
              savedPassword === password &&
              savedAccessHours === accessHours
            ) {
              console.log("Data saved correctly.");
            } else {
              console.error("Data saving error: Data mismatch.");
            }
          }
        );
      }
    });
  };

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

          <select classNames="w-full" onChange={handleAccessHoursChange} name="accessHours">
            <option value="option1">Mridul</option>
            <option value="option2">Hosen</option>
            <option value="option3">Kibria</option>
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