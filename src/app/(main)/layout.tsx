import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShaffiAhuja from "@/data/ShaffiAhuja";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar data={ShaffiAhuja.Intro} resumeSlug="shaffiahuja" />
      {children}
      <Footer data={ShaffiAhuja.Footer} />
    </>
  );
}
