import React from "react";

const ProductsIntroduction = ({ name, description, image }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 bg-white shadow-md rounded-lg">
      <img
        src={image}
        alt={`${name} banner`}
        className="w-full h-150 object-cover rounded-t-lg mb-4"
      />
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{name}</h2>
      <p className="text-gray-600 mb-4 whitespace-pre-line">{description}</p>
    </div>
  );
};

export default ProductsIntroduction;