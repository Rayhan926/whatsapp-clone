function InputError({ errorType }) {
  return (
    <>
      <div className="bg-red-200 py-2 border-l-[3px] border-red-600 px-4 rounded mb-3">
        <p className="text-red-700">
          {errorType === "required" && "Email is required!"}
          {errorType === "invalid" && "Invalid email address!"}
          {errorType === "sameEmail" && "Can't use your own email!"}
          {errorType === "exist" && "Chat is already exist!"}
        </p>
      </div>
    </>
  );
}

export default InputError;
