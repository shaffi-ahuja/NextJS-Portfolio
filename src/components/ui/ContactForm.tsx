'use client';


import Toast from './Toast';
import { FormEvent, useState } from 'react';
import { sendMail } from '../../pages/api/sendEmail';
import { BiArrowFromRight, BiRightTopArrowCircle } from 'react-icons/bi';
import { BsArrowClockwise, BsArrowUp } from 'react-icons/bs';
import { LuLink } from 'react-icons/lu';

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
        <div className="form-container">
            {showToast && (
                <Toast
                    message="Email has been successfully sent!"
                    variant="success"
                />
            )}
            <p className="form-heading">Let’s talk</p>
            <p>
                Whether you’re looking to build a new website, improve your existing platform, or bring a unique project to life, I’m here to help.
            </p>

            <form
                onSubmit={submitHandler}
                className="form"
            >
                <div className="input-div">
                    <label htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        name="name"
                        className="input"
                        placeholder="ex: john doe"
                        type="text"
                        required
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        name="email"
                        className="input"
                        placeholder="ex: john.doe@gmail.com"
                        type="email"
                        required
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                        id="message"
                        name="message"
                        className="input xs:h-40"
                        placeholder="Share your thoughts or enquiries"
                        required
                    />
                </div>

                <div className="input-div">
                    <button
                        className={`button ${pending && 'cursor-not-allowed opacity-50'
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
                                    className="go-to-arrow"
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
