const Button = ({ textContent, type = "button", onClick, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="text-white w-full mt-2 bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mr-2 mb-2"
      {...props}
    >
      {textContent}
    </button>
  );
};

export default Button;
