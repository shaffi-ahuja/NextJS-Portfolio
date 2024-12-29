import React from 'react'
import Heading from './ui/Heading'
import Image from 'next/image'
import ContactForm from './ui/ContactForm'

const ContactMe = () => {
  return (
    <section className='p-10 pt-10 bg-black'>
      <div className=' border border-zinc-800 rounded-3xl pb-6'>
        <Image src="/contactMeHeader.png"
          alt='Contact'
          height={10}
          width={2480}
          className='w-full'
        />
        <ContactForm />
      </div>
    </section>
  )
}

export default ContactMe