'use client';

import Form from 'next/form';
import Toast from './Toast';
import { useState } from 'react';

const ContactForm = () => {
    const [pending, setPending] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const submitHandler = async (formData: FormData) => {
        const formValues = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message")
        }
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2000); 
    }

    return (

        <div className='mx-auto mt-10 justify-items-center w-1/2'>
            {
                showToast &&
                <Toast
                    message='Email has been successfuly sent!'
                    variant='success'
                />
            }
            <p className='text-3xl font-bold mb-3'>
                Let’s talk
            </p>

            <p>
                Whether you’re looking to build a new website, improve your existing platform, or bring a unique project to life, I’m here to help.
            </p>

            <Form action={submitHandler} className='mt-10 w-full'>
                <div className=' mt-5 flex flex-col'>
                    <label htmlFor='name'>Full Name</label>
                    <input
                        id='name'
                        name='name'
                        className='border border-zinc-600 bg-zinc-900 px-5 py-4  rounded-md  mt-3 placeholder:text-zinc-700'
                        placeholder='ex: john doe'
                        type='text'
                        required
                    />
                </div>
                <div className=' mt-5 flex flex-col'>
                    <label htmlFor='email'>Email address</label>
                    <input
                        id='email'
                        name='email'
                        className='border border-zinc-600 bg-zinc-900 px-5 py-4  rounded-md  mt-3 placeholder:text-zinc-700'
                        placeholder='ex: john.doe@gmail.com'
                        type='email'
                        required
                    />
                </div>
                <div className=' mt-5 flex flex-col'>
                    <label htmlFor='message'>Your Message</label>
                    <textarea
                        id='message'
                        name='message'
                        className='border border-zinc-600 bg-zinc-900 px-5 py-4  rounded-md  mt-3 placeholder:text-zinc-700'
                        placeholder='Share your thoughts or enquiries'
                        required
                    />
                </div>

                <div className=' mt-5 flex flex-col '>
                    <button className='border border-zinc-900 bg-zinc-600 px-5 py-4  rounded-md  mt-3  flex items-center justify-center' type='submit' >
                        {pending ? 'Sending...' : 'Send message'}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                    </button>
                </div>
            </Form>

        </div>
    )
}

export default ContactForm