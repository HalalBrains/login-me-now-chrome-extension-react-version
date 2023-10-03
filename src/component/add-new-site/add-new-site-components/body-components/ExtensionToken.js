import React, { useEffect, useState } from "react";
import jwt from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ExtensionToken() {
  const [extensionToken, setExtensionToken] = useState("");
  const [invalidToken, setInvalidToken] = useState(false);
  const [paused, setPaused] = useState(false);
  // const [existResult, setExistResult] = useState('')
  const navigate = useNavigate();

  const handleExtensionToken = (e) => {
    setExtensionToken(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!extensionToken.trim()) {
      console.log("error: You must add the token.");
      return;
    }
    try {
      // Attempt to decode the token
      const data = jwt(extensionToken);

      if (!data.iss) {
        setInvalidToken(true);
        return;
      }

      const link = data.iss;

      let formdata = new FormData();
      formdata.append("token", extensionToken);

      let requestOptions = {
        method: "POST",
        body: formdata,
      };

      fetch(`${link}/wp-json/login-me-now/validate`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          // console.log(result.site_url)
          //   if (result.site_url === link) {
          //     console.log(true);
          //     return; 
          //   }


          if (
            typeof result !== "undefined" &&
            typeof result.data !== "undefined" &&
            typeof result.data.status !== "undefined"
          ) {
            console.log("error: Something went wrong");
            return;
          }

          if (result === "pause") {
            setPaused(true);
          } else {
            let unique = Date.now();

            // eslint-disable-next-line no-undef
            chrome.storage.local.get("loginMeNowTokens", function (data) {
              let tokens = data.loginMeNowTokens || {};
              tokens[unique] = result;
              console.log(tokens)
              // eslint-disable-next-line no-undef
              chrome.storage.local.set({ loginMeNowTokens: tokens });
              navigate("/", { state: { tokenSuccess: true } });
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } catch (error) {
      setInvalidToken(true);
    }
  };

  useEffect(() => {
    if (invalidToken || paused) {
      toast.error(
        `${invalidToken ? "Token is invalid!" : "Extension Token Is Paused!"}`,
        {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );

      setInvalidToken(false);
      setPaused(false);
    }
  }, [invalidToken, paused]);

  return (
    <>
      <div className="mt-5">
        <form onSubmit={handleSubmit}>
          <textarea
            name="extension-token"
            placeholder="Paste your extension token here..."
            className="w-full p-2 focus:outline-[#005E54] border border-[#005e55ef] rounded text-[18px]"
            rows={9}
            required
            value={extensionToken}
            onChange={handleExtensionToken}
          />
          <button
            type="submit"
            className="bg-[#005E54] hover:bg-[#005e55ef] text-white font-bold py-3 rounded w-full mt-4"
          >
            Save
          </button>
        </form>
      </div>

      <ToastContainer />
    </>
  );
}

export default ExtensionToken;
