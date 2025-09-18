import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedProductsList from "../components/FeaturedProductsList";
import ProductSections from "../components/ProductSections";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <ProductSections />
        <FeaturedProductsList />
      </div>
      <Footer />
    </div>
  );
};

export default Home;