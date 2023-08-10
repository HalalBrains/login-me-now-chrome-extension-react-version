import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function Error({ content, severity }) {
  return (
    <Stack sx={{ width: "100%" }} spacing={2} className="absolute top-2 right-0">
      <Alert severity={severity}>{content}</Alert>
    </Stack>
  );
}
