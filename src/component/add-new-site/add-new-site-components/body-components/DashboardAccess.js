import React, { useEffect, useState } from "react";
import { TextField, createTheme, ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const expiration = accessHours;
    setIsLoading(true);
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
          setIsLoading(false);
          setError(false);
          navigate("/", { state: { success: true } });
        });
      })
      .catch((error) => {
        setIsLoading(false);
        setError(true);
        console.log("rerendered");
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
    <>
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
              className="w-full"
              accessHours={accessHours}
              setAccessHours={setAccessHours}
              onChange={handleAccessHoursChange}
              InputProps={{
                type: "datetime-local",
              }}
            />

            <button className="bg-[#005E54] hover:bg-[#005e55ef] text-white font-bold py-3 rounded w-full mt-4">
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>
          <p className="text-center text-[12px] mt-2 text-gray-500">
            This extension does not store any login data of your website.
          </p>
        </div>
      </ThemeProvider>

      {useEffect(() => {
        if (error) {
          toast.error("There was an error !", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          setError(false);
        }
      }, [error])}
      <ToastContainer />
    </>
  );
}

export default DashboardAccess;
