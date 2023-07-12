import React, { useState } from 'react';
import DashboardAccess from './body-components/DashboardAccess';
import ExtensionToken from './body-components/ExtensionToken';

function Body() {
  const [showDashboardAccess, setShowDashboardAccess] = useState(true);
  const [showExtensionToken, setShowExtensionToken] = useState(false);

  const handleDashboardAceess = () => {
    setShowDashboardAccess(true);
    setShowExtensionToken(false);
  };

  const handleExtensionToken = () => {
    setShowDashboardAccess(false);
    setShowExtensionToken(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-[22px] text-center py-5">Authenticate Login Using</h1>

      <div className="flex justify-center">
        <button
          className={`mr-3 border-b-2 ${
            showDashboardAccess ? 'border-b-[#264093]' : ''
          } hover:border-b-[#264093] pb-2 px-2`}
          onClick={handleDashboardAceess}
        >
          Dashboard Access
        </button>
        <button
          className={`ml-3 border-b-2 ${
            showExtensionToken ? 'border-b-[#264093]' : ''
          } hover:border-b-[#264093] pb-2 px-2`}
          onClick={handleExtensionToken}
        >
          Extension Token
        </button>
      </div>

      {showDashboardAccess && <DashboardAccess />}
      {showExtensionToken && <ExtensionToken />}
    </div>
  );
}

export default Body;
