import Link from 'next/link'
import React from 'react'
import { BsLinkedin } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();
 
  return (
    <footer className=' py-10 xl:px-32 lg:px-24 md:px-16 px-8'>
      <div className="border border-0.5 border-zinc-800 mt-5 mb-10 " />
      <div className='md:flex grid grid-row-3 gap-5 justify-between'>
        <div className=''>
          <Link href='' className='text-zinc-600'>
            Terms & Conditions | Privacy Policy
          </Link>
        </div>
        <div className='flex gap-4'>
          <Link href='https://github.com/shaffi-ahuja'>
            <FaGithub className="text-zinc-600 size-6 bi bi-github hover:text-[#fff]" />

          </Link>
          <Link href='https://www.linkedin.com/in/shaffi-ahuja/'>
         
            <BsLinkedin className="text-zinc-600 size-6 bi bi-linkedin hover:text-[#0a66c2] hover:bg-white hover:rounded-sm" />
            
          </Link>
          <Link href='https://leetcode.com/u/user8200MW/'>
            <SiLeetcode className='-ml-[2px] size-6 hover:fill-orange-300 fill-[#52525b]' />
          </Link>

        </div>
        <div className='text-zinc-600'>
          <p>&copy; {currentYear} Shaffi Ahuja. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer