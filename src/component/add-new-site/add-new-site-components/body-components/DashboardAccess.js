import { TextField } from "@mui/material";
import React from "react";
import Selector from "./Selector";

function DashboardAccess() {
  return (
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

      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded w-full mt-2">
        Login
      </button>
      <p className="text-center text-[12px] mt-2 text-gray-500">This extension does not store any login data of your website</p>
    </div>
  );
}

export default DashboardAccess;
