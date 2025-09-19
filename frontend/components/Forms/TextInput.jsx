const TextInput = () => {
  return (
    <>
      <div>
        <label
          for="full-name"
          className="block text-sm text-gray-900"
        >
          Họ và tên
        </label>

        <input
          type="email"
          id="full-name"
          placeholder="Nguyễn Văn A"
          className="block  mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
        />
      </div>
    </>
  );
};

export default TextInput;
