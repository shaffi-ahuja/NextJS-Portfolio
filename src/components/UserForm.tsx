'use client';
import React, { useState } from 'react';
import MultiSelect from "../components/ui/MultiSelect";
import Toast from './ui/Toast';

const skills = ['react', 'typescript', 'javascript', 'html', 'css', 'next', 'redux', 'mui', 'bootstrap', 'tailwind', 'figma', "dotnet", "cs", "python", "aws", "docker", "terraform", "sqlite", "git", "angular"];

const UserForm = () => {
    const [pending, setPending] = useState(false);
    const [showToast, setShowToast] = useState(true);

    return (
        <div className="user-form-container">
            {showToast && (
                <Toast
                    message="Preview Feature: Creating Portfolio is currently not available. Stay tuned for future updates!"
                    variant="info"
                />
            )}
            <p className="font-bold mb-3 text-2xl">Hey there, future portfolio superstar! </p>
            <p className='text-xl'>
                Let’s create a portfolio that screams “Hire me!” 🎉  Ready to dive in?
            </p>

            <form
                onSubmit={() => { }}
                className="form"
            >
                <h3 className='text-lg font-semibold'>
                    First things first:
                </h3>
                <div className="input-div">
                    <label htmlFor="full-name">
                        Who’s building this incredible portfolio?
                    </label>
                    <input
                        id="full-name"
                        name="full-name"
                        className="input xs:h-40"
                        required
                        placeholder='Use your full name to let recruiters or collaborators find you easily.'
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="located-at">
                        From which corner of the world are you? (city & country)
                    </label>
                    <input
                        id="located-at"
                        name="located-at"
                        className="input xs:h-40"
                        placeholder="Just the city and country will do—no need for full addresses!"
                        required
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="timezone">
                        What timezone works best for you?
                    </label>
                    <input
                        id="timezone"
                        name="timezone"
                        className="input xs:h-40"
                        placeholder="Preferred timezone for collaboration"
                        required
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="gender">
                        How do you identify?
                    </label>
                    <select id="gender" name="options" className='input'>
                        <option value="male">
                            Male
                        </option>
                        <option value="female">
                            Female
                        </option>
                        <option value="other">
                            Other
                        </option>
                    </select>
                </div>
                <div className="input-div">
                    <label htmlFor="theme">
                        If your portfolio was a mood, what color would it be?
                    </label>
                    <select id="theme" name="options" className='input'>
                        <option value="red">
                            Are you bold and vibrant with a fiery red?
                        </option>
                        <option value="blue">
                            Cool and confident with a navy blue?
                        </option>
                        <option value="pastel">
                            Or maybe creative and chill with a pastel palette?
                        </option>
                    </select>
                    <small className='text-zinc-500'>
                        Pick your vibe – this is your portfolio personality!
                    </small>
                </div>
                <div className="input-div">
                    <label htmlFor="one-liner-intro">
                        Alright, describe yourself in one unforgettable sentence.
                    </label>
                    <textarea
                        id="one-liner-intro"
                        name="one-liner-intro"
                        className="input xs:h-40"
                        placeholder="What’s your superpower? Think of it as the tagline on your movie poster! "
                        required
                    />
                    <small className='text-zinc-500'>
                        Example: “Creative problem-solver who turns coffee into code.”
                    </small>
                </div>

                <div className="input-div">
                    <h3 className='text-lg font-semibold'>
                        Now, give me a quick elevator pitch!
                    </h3>
                    <div className="input-div">
                        <label htmlFor="years-of-experience">
                            How many years of experience do you have?
                        </label>
                        <input
                            id="years-of-experience"
                            name="years-of-experience"
                            className="input xs:h-40"
                            required
                            type='number'
                        />
                    </div>
                    <div className="input-div">
                        <label htmlFor="experience-summary">
                            What do you bring to the table?
                        </label>
                        <input
                            id="experience-summary"
                            name="experience-summary"
                            className="input xs:h-40"
                            required
                            placeholder='Tell us about your work experience. Keep it impactful!'
                        />
                    </div>
                    <div className="input-div">
                        <label htmlFor="passion">
                            What are you passionate about?
                        </label>
                        <input
                            id="passion"
                            name="passion"
                            className="input xs:h-40"
                            required
                            placeholder='Keep it short and impactful!'
                        />
                    </div>
                    <div className="input-div">
                        <label htmlFor="passion-description">
                            Why should someone scroll further?
                        </label>
                        <input
                            id="passion-description"
                            name="passion-description"
                            className="input xs:h-40"
                            required
                            placeholder='Tell us how passionate about your work and what is coming up next to show that!'
                        />
                    </div>
                </div>

                <div className="input-div">
                    <label htmlFor="skills">
                        What’s in your toolkit?
                    </label>
                    <small className='text-zinc-500 mb-1'>
                        JavaScript, Python, React, Kubernetes – lay it out!
                    </small>
                    <MultiSelect id="skills" options={skills} />
                </div>
                <div className="input-div">
                    <label htmlFor="email">
                        How can people reach you?
                    </label>
                    <input
                        id="email"
                        type='email'
                        name="email"
                        className="input xs:h-40"
                        required
                        placeholder='Drop that email'
                    />
                </div>

                <div className="input-div">
                    <label htmlFor="contact-me-for">
                        And here’s a twist: Why should someone reach out to "you" ?
                    </label>
                    <input
                        id="contact-me-for"
                        name="contact-me-for"
                        className="input xs:h-40"
                        required
                        placeholder='Example: “Looking for a collaborative developer who can debug with a smile? Let’s connect!”'
                    />
                </div>

                <div className="input-div">
                    <h3 className='text-lg font-semibold'>
                        Show off your greatest hits!
                    </h3>
                    <div className="input-div">

                        <label htmlFor="projects">
                            What’s a project that made you go, “Wow, I built that!”?
                        </label>
                        <input
                            id="projects"
                            name="projects"
                            className="input xs:h-40"
                            required
                            placeholder='What is it called?'
                        />
                        <textarea
                            id="project-description"
                            name="project-description"
                            className="input xs:h-40"
                            required
                            placeholder='Add a fun story or challenge you solved to make it personal.'
                        />
                    </div>
                </div>

                <div className="input-div">
                    <h3 className='text-lg font-semibold'>
                        Time to shine!
                    </h3>
                    <div className="input-div">
                        <label htmlFor="work-experience">
                            Share where you’ve worked and what you crushed there.
                        </label>
                        <input
                            id="work-experience"
                            name="work-experience"
                            className="input xs:h-40"
                            required
                            placeholder='Where did you work?'
                        />
                        <textarea
                            id="work-experience-description"
                            name="work-experience-description"
                            className="input xs:h-40"
                            required
                            placeholder='Remember, results speak louder than responsibilities – showcase the impact you made! '
                        />
                    </div>
                </div>

                <div className="input-div">
                    <h3 className='text-lg font-semibold'>
                        Let’s wrap it up with your digital breadcrumbs:
                    </h3>
                    <div className="input-div">
                        <label htmlFor="linkedin-link">
                            LinkedIn: So they can connect with you professionally.
                        </label>
                        <input
                            id="linkedin-link"
                            name="linkedin-link"
                            className="input xs:h-40"
                            required
                        />
                    </div>
                    <div className="input-div">
                        <label htmlFor="github-link">
                            GitHub: To show off your code playground.
                        </label>
                        <input
                            id="github-link"
                            name="github-link"
                            className="input xs:h-40"
                            required
                        />
                    </div>
                    <div className="input-div">
                        <label htmlFor="leetcode-link">
                            LeetCode: For those jaw-dropping problem-solving skills.
                        </label>
                        <input
                            id="leetcode-link"
                            name="leetcode-link"
                            className="input xs:h-40"
                            required
                        />
                    </div>
                </div>
                <div className="input-div">

                    <h3 className='text-lg font-semibold'>
                        Okay! So are you ready?
                    </h3>
                    <button
                        className={`button ${pending && 'cursor-not-allowed opacity-50'
                            } mb-10`}
                        type="submit"
                        disabled={pending}
                    >
                        {!pending ? (
                            <>
                                <span>Lets take you to your dream portfolio!</span>

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
                            <span>It's getting ready...</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UserForm