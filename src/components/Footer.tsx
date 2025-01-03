import Link from 'next/link'
import React from 'react'
import { BsLinkedin } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=' py-10 section-container xs:px-5'>
      <div className="border border-0.5 border-zinc-800 mt-5 mb-10" />
      <div className='footer-grid'>
        <div className='flex gap-4 md:order-last'>
          <Link href='https://github.com/shaffi-ahuja'>
            <FaGithub className="footer-icons bi bi-github hover:text-[#fff]" />

          </Link>
          <Link href='https://www.linkedin.com/in/shaffi-ahuja/'>

            <BsLinkedin className="footer-icons bi bi-linkedin hover:text-[#0a66c2] hover:bg-white hover:rounded-sm" />

          </Link>
          <Link href='https://leetcode.com/u/user8200MW/'>
            <SiLeetcode className='-ml-[2px] footer-icons hover:fill-orange-300' />
          </Link>

        </div>
        <p className='text-zinc-600'>&copy; {currentYear} | Shaffi Ahuja | All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer