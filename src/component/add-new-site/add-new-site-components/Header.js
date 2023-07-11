import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Header() {
  return (
    <div className="px-6 py-2 flex justify-between items-center border-b">
        <h1 className="text-[22px] font-semibold">Add New Site</h1>
        <ArrowBackIcon fontSize='large'/>
    </div>
  )
}

export default Header
