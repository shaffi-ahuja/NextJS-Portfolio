import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-black py-10 xl:px-32 lg:px-24 md:px-16 px-8'>
      <div className="border border-0.5 border-zinc-800 mt-5 mb-10 " />
      <div className='md:flex grid grid-row-3 gap-5 justify-between'>
        <div className=''>
          <Link href='' className='text-zinc-600'>
            Terms & Conditions | Privacy Policy
          </Link>
        </div>
        <div className='flex gap-4'>
          <Link href='https://github.com/shaffi-ahuja'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-zinc-600 size-6 bi bi-github hover:text-[#fff]" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
          </Link>
          <Link href='https://www.linkedin.com/in/shaffi-ahuja/'>

            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-zinc-600 size-6 bi bi-linkedin hover:text-[#0a66c2] hover:bg-white hover:rounded-sm" viewBox="0 0 16 16">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
            </svg>
          </Link>
          <Link href='https://leetcode.com/u/user8200MW/'>
            <svg fill="#52525b" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" className='-ml-[2px] size-6 hover:fill-orange-300'>
              <g id="SVGRepo_bgCarrier" strokeWidth="0">
              </g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
              </g>
              <g id="SVGRepo_iconCarrier">
                <title>LeetCode icon</title>
                <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z">
                </path>
              </g>
            </svg>
          </Link>

        </div>
        <div className='text-zinc-600'>
          <p>© 2024 Shaffi Ahuja. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer