'use client';


import Toast from './Toast';
import { FormEvent, useState } from 'react';
import { sendMail } from '../../pages/api/sendEmail';

const ContactForm = () => {
    const [pending, setPending] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = JSON.parse(JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message")
        }));

        try {
            setPending(true);

            const mailText = `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`;
            const response = await sendMail({
                email: data.email,
                subject: 'Someone from portfolio reached out to you!',
                text: mailText,
            });

            if (response?.messageId) {
                console.log('Mail Sent Successfully.');
                setShowToast(true);
                form.reset();
                setTimeout(() => setShowToast(false), 3000);

            } else {
                console.error('Failed to send mail.');
            }
        } catch (error) {
            console.error('Failed to send mail.', error);
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="mx-auto mt-10 justify-items-center w-1/2">
            {showToast && (
                <Toast
                    message="Email has been successfully sent!"
                    variant="success"
                />
            )}
            <p className="text-3xl font-bold mb-3">Let’s talk</p>
            <p>
                Whether you’re looking to build a new website, improve your existing platform, or bring a unique project to life, I’m here to help.
            </p>

            <form
                onSubmit={submitHandler}
                className="mt-10 w-full"
            >
                <div className="mt-5 flex flex-col">
                    <label htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        name="name"
                        className="border border-zinc-600 bg-zinc-900 px-5 py-4 rounded-md mt-3 placeholder:text-zinc-700"
                        placeholder="ex: john doe"
                        type="text"
                        required
                    />
                </div>
                <div className="mt-5 flex flex-col">
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        name="email"
                        className="border border-zinc-600 bg-zinc-900 px-5 py-4 rounded-md mt-3 placeholder:text-zinc-700"
                        placeholder="ex: john.doe@gmail.com"
                        type="email"
                        required
                    />
                </div>
                <div className="mt-5 flex flex-col">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                        id="message"
                        name="message"
                        className="border border-zinc-600 bg-zinc-900 px-5 py-4 rounded-md mt-3 placeholder:text-zinc-700"
                        placeholder="Share your thoughts or enquiries"
                        required
                    />
                </div>

                <div className="mt-5 flex flex-col">
                    <button
                        className={`border border-zinc-900 bg-zinc-600 px-5 py-4 rounded-md mt-3 flex items-center justify-center hover:bg-zinc-700 ${pending && 'cursor-not-allowed opacity-50'
                            }`}
                        type="submit"
                        disabled={pending}
                    >
                        {!pending ? (
                            <>
                                <span>Send message</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-3 ml-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                                    />
                                </svg>
                            </>
                        ) : (
                            <span>Sending...</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
