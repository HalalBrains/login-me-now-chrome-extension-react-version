import React from 'react'
import Search from './home-components/Search'
import AddNewSite from './home-components/AddNewSite'
import LoggedInSites from './home-components/LoggedInSites'
function Home() {
  return (
    <>
    <div className="p-6 flex items-center justify-between border-b">
        <Search classNames="w-full"/>
        <AddNewSite classNames=""/>
    </div>
    
    <LoggedInSites />
    </>
  )
}

export default Home
