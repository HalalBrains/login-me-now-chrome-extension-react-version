import React from 'react'

function ExtensionToken() {
  return (
    <div className='mt-5'>
      <textarea placeholder='Paste your extension token here...' className='w-full p-2 focus:outline-[#1976d2] border border-[#C4C4C4] rounded' rows={9}/>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded w-full mt-2">
        Save
      </button>
    </div>
  )
}

export default ExtensionToken
