import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Tooltip } from '@mui/material';

function Header() {
  return (
    <div className="px-6 py-2 flex justify-between items-center border-b">
        <h1 className="text-[22px] font-semibold text-[#00231F]">Add New Site</h1>
        <Tooltip title="Go to Dashboard">
        <ArrowBackIcon fontSize='large' style={{ color: '#00231F' }}/>
        </Tooltip>
    </div>
  )
}

export default Header
