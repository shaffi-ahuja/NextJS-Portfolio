import React from 'react'
import Heading from './ui/Heading'
import Image from 'next/image'
import ContactForm from './ui/ContactForm'

const ContactMe = () => {
  return (
    <section className='xl:px-32 lg:px-24 md:px-16 px-8 pt-10 ' id='ContactMe'>
      <div className=' border border-zinc-800 rounded-xl pb-6'>
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