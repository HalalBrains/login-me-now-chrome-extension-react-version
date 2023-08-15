import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { Tooltip } from "@mui/material";

function AddNewSite({ classNames }) {
  const customIconSize = 50;
  return (
    <Tooltip title="Add New">
      <AddIcon
      style={{
        fontSize: customIconSize,
        color: '#005E54',
      }}
      className={classNames}
    />
    </Tooltip>
  );
}

export default AddNewSite;
