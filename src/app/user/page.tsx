'use client';
import React, { useState } from 'react';
import MultiSelect from "../../components/ui/MultiSelect";

const skills = ['react', 'typescript', 'javascript', 'html', 'css', 'next', 'redux', 'mui', 'bootstrap', 'tailwind', 'git', 'figma'];

const UserHomePage = () => {
  const [pending, setPending] = useState(false);

  return (
    <div className="user-form-container">

      <p className="form-heading">Hey there, future portfolio superstar! </p>
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
          <label htmlFor="message">
            Alright, describe yourself in one unforgettable sentence.
          </label>
          <textarea
            id="message"
            name="message"
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
            <label htmlFor="message">
              Who are you?
            </label>
            <input
              id="message"
              name="message"
              className="input xs:h-40"
              required
              placeholder='We’re going for short, sweet, and impactful!'
            />
          </div>
          <div className="input-div">
            <label htmlFor="message">
              What do you bring to the table?
            </label>
            <input
              id="message"
              name="message"
              className="input xs:h-40"
              required
              placeholder='Keep it impactful!'
            />
          </div>
          <div className="input-div">
            <label htmlFor="message">
              Why should someone scroll further?
            </label>
            <input
              id="message"
              name="message"
              className="input xs:h-40"
              required
              placeholder='Tell me something interesting about what coming up next!'
            />
          </div>
        </div>

        <div className="input-div">
          <label htmlFor="message">
            What’s in your toolkit?
          </label>
          <small className='text-zinc-500 mb-1'>
            JavaScript, Python, React, Kubernetes – lay it out!
          </small>
          <MultiSelect options={skills} />
        </div>
        <div className="input-div">
          <label htmlFor="message">
            How can people reach you?
          </label>
          <input
            id="message"
            name="message"
            className="input xs:h-40"
            required
            placeholder='Drop that email, LinkedIn, or Twitter handle!'
          />
        </div>

        <div className="input-div">
          <label htmlFor="message">
            And here’s a twist: Why should someone reach out to "you" ?
          </label>
          <input
            id="message"
            name="message"
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

            <label htmlFor="message">
              What’s a project that made you go, “Wow, I built that!”?
            </label>
            <input
              id="message"
              name="message"
              className="input xs:h-40"
              required
              placeholder='What is it called?'
            />
            <textarea
              id="message"
              name="message"
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
            <label htmlFor="message">
              Share where you’ve worked and what you crushed there.
            </label>
            <input
              id="message"
              name="message"
              className="input xs:h-40"
              required
              placeholder='Where did you work?'
            />
            <textarea
              id="message"
              name="message"
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
            <label htmlFor="message">
              LinkedIn: So they can connect with you professionally.
            </label>
            <input
              id="message"
              name="message"
              className="input xs:h-40"
              required
            />
          </div>
          <div className="input-div">
            <label htmlFor="message">
              GitHub: To show off your code playground.
            </label>
            <input
              id="message"
              name="message"
              className="input xs:h-40"
              required
            />
          </div>
          <div className="input-div">
            <label htmlFor="message">
              LeetCode: For those jaw-dropping problem-solving skills.
            </label>
            <input
              id="message"
              name="message"
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
              }`}
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

export default UserHomePage