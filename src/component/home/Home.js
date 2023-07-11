import React from 'react'
import Search from './home-component/Search'
import AddNewSite from './home-component/AddNewSite'
import LoggedInSites from './home-component/LoggedInSites'
function Home() {
  return (
    <>
    <div className="p-8 flex items-center justify-between border-b">
        <Search classNames="w-full"/>
        <AddNewSite classNames=""/>
    </div>
    
    <LoggedInSites />
    </>
  )
}

export default Home
