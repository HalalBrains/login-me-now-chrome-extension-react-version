import React from "react";
import Search from "./home-components/Search";
import AddNewSite from "./home-components/AddNewSite";
import LoggedInSites from "./home-components/LoggedInSites";
import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <div className="py-6 pl-6 pr-3 flex items-center justify-between border-b">
        <Search classNames="w-full" handleSearchChange={handleSearchChange} />
        <Link to="/add-new-site">
          <AddNewSite classNames="" />
        </Link>
      </div>

      <LoggedInSites
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </>
  );
}

export default Home;
