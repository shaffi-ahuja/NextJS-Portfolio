'use client';
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import WorkExperience from "@/components/WorkExperience";
import ContactMe from "@/components/ContactMe";
import React from "react";

// Define types for the structure of the data you're importing
interface UserData {
    Intro?: { title: string; description: string };
    AboutMe?: { description: string };
    Projects?: { name: string }[];
    WorkExperience?: { role: string; company: string }[];
    ContactMe?: { email: string };
}

interface UserHomeProps {
    params: Promise<{ id: string }>; // `params` is now a Promise
}

export default function UserHome({ params }: UserHomeProps) {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Unwrap `params` using `React.use()` to access the `id`
    const { id } = React.use(params);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let userModule: any; // Module export will be an object

                // Dynamically import the appropriate file based on the `id` from `params`
                if (id === "nimishmadan") {
                    userModule = (await import("@/data/NimishMadan")).default;
                } else if (id === "sahilahuja1729") {
                    userModule = (await import("@/data/SahilAhuja")).default;
                } else {
                    throw new Error("Unknown user ID");
                }

                // Now access the user data based on the key from the module
                setUserData(userModule); // Access the correct user data by the `id` key
            } catch (err: any) {
                setError(err.message); // Capture the error message
            } finally {
                setLoading(false); // Stop loading when the data is loaded or error occurs
            }
        };

        fetchData();
    }, [id]); // Dependency array to re-run when `params.id` changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const { Intro, AboutMe, Projects: MyProjects, WorkExperience: MyWorkExperience, ContactMe: Contactme } = userData!;

    return (
        <>
            {Intro && <Hero data={Intro} />}
            {AboutMe && <About data={AboutMe} />}
            {MyProjects && <Projects data={MyProjects} />}
            {MyWorkExperience && <WorkExperience data={MyWorkExperience} />}
            {Contactme && <ContactMe data={Contactme} />}
        </>
    );
}
