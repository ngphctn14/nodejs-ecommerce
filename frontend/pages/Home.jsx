import React from "react";
import Navbar from "../components/Shared/Navbar";
import Hero from "../components/Home/Hero";
import FeaturedProductsList from "../components/Home/FeaturedProductsList";
import ProductSections from "../components/Home/ProductSections";
import Footer from "../components/Shared/Footer";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Helmet>
        <title>{`Shop bóng đá`}</title>
      </Helmet>
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