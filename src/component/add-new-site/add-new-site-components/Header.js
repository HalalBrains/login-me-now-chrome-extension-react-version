import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

function Header({title}) {
  return (
    <div className="p-6 pr-4 py-2 flex justify-between items-center border-b">
      <h1 className="text-[22px] font-semibold text-[#00231F]">{title}</h1>
      <Link to="/">
        <Tooltip title="Go to Dashboard">
          <ArrowBackIcon fontSize="large" style={{ color: "#005E54" }} />
        </Tooltip>
      </Link>
    </div>
  );
}

export default Header;
