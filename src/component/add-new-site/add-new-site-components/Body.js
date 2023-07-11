import React from 'react';
import DashboardAccess from './body-components/DashboardAccess';

function Body() {
  return (
    <div className='p-6'>
      <h1 className='text-[22px] text-center py-5'>Authenticate Login Using</h1>

      <div className="flex justify-center">
      <button className='mr-3 border-b-2 border-b-[#264093] hover:border-b-[#264093] pb-2 px-2'>Dashboard Access</button>
      <button className='ml-3 border-b-2 hover:border-b-[#264093] pb-2 px-2'>Extension Token</button>
      </div>
      <DashboardAccess />
    </div>
  )
}

export default Body
