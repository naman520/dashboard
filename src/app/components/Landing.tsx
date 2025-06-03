import React from 'react'

export default function Navbar() {
  return (
    <>
        <div>
            <div className='text-center text-3xl '>Please Login to Search</div>
            <div className='p-4 rounded-lg bg-red-500'>
              <input type="text" name="SEARCH" id="" placeholder='search'/>
            </div>
        </div>
    </>
  )
}
