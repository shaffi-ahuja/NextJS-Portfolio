'use client';
import Footer from "@/components/Footer";
import "../../globals.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import React from "react";

interface UserHomeProps {
  params: Promise<{ id: string }>; // `params` is now a Promise
  children: any
}

interface UserData {
  Intro?: any;
  Footer?: any
}

export default function UserHome({ params, children }: UserHomeProps) {
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

  const { Intro, Footer: FooterData } = userData!;


  return (
    <>
      <div
        className={`antialiased text-black bg-white dark:text-white dark:bg-black font-sans`}
      >
        <Navbar data={Intro} />
        {children}
        <Footer data={FooterData} />
      </div>
    </>

  );
}

