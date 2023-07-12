import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

function AddNewSite({ classNames }) {
  return (
    <Link to="/add-new-site">
    <Tooltip title="Add New">
      <AddIcon fontSize="large" className={classNames} />
    </Tooltip>
    </Link>
  );
}

export default AddNewSite;
