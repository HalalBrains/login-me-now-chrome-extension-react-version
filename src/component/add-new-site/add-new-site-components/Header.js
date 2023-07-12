import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';

function Header() {
  return (
    <div className="px-6 py-2 flex justify-between items-center border-b">
        <h1 className="text-[22px] font-semibold">Add New Site</h1>
        <Link to="/">
        <Tooltip title="Go to Dashboard">
        <ArrowBackIcon fontSize='large'/>
        </Tooltip>
        </Link>
    </div>
  )
}

export default Header
