import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { Tooltip } from "@mui/material";

function AddNewSite({ classNames }) {
  return (
        <Tooltip title="Add New">
          <AddIcon fontSize="large" className={classNames} style={{color:"#005E54"}}/>
        </Tooltip>
  );
}

export default AddNewSite;
