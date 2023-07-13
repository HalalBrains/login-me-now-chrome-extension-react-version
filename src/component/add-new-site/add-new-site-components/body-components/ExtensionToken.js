import React from 'react'

function ExtensionToken() {
  return (
    <div className='mt-5'>
      <textarea placeholder='Paste your extension token here...' className='w-full p-2 focus:outline-[#005E54] border border-[#005e55ef] rounded' rows={9}/>
      <button className="bg-[#005E54] hover:bg-[#005e55ef] text-white font-bold py-3 rounded w-full mt-4">
        Save
      </button>
    </div>
  )
}

export default ExtensionToken
