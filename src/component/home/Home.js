import React from 'react'
import Search from './home-components/Search'
import AddNewSite from './home-components/AddNewSite'
import LoggedInSites from './home-components/LoggedInSites'
import { useState } from 'react';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  return (
    <>
    <div className="p-6 flex items-center justify-between border-b">
        <Search classNames="w-full" handleSearchChange={handleSearchChange}/>
        <AddNewSite classNames=""/>
    </div>
    
    <LoggedInSites searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
    </>
  )
}

export default Home
