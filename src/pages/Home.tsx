import React from "react";
import { Navbar } from "../components/landing/Navbar"; // Importe a Navbar
import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { Footer } from "../components/landing/Footer";

const Home = () => {
  return (
    <main className="bg-[#050505] min-h-screen">
      <Navbar /> {/* Coloque ela aqui no topo */}
      <Hero />
      <div id="recursos">
        <Features />
      </div>
      <Footer />
    </main>
  );
};

export default Home;