import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import FeaturesStrip from "../components/FeaturesStrip";
import Footer from "../components/Footer";

const Home = ({isLoggedIn, setIsLoggedIn}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 scroll-smooth">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main>
        <section id="home">
          <Hero />
        </section>

        <section className="py-16 px-4 sm:px-8 lg:px-20 bg-[#05071f]">
          <FeaturedProducts isLoggedIn={isLoggedIn} />
        </section>

        <section className="bg-gradient-to-r from-fuchsia-900/20 via-transparent to-sky-900/20 border-y border-white/5">
          <FeaturesStrip />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;