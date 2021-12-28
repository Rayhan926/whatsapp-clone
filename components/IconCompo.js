function IconCompo({ Icon, className, onClick }) {
  return (
    <div
      className={`w-8 h-8 p-[8px] text-white rounded-full overflow-hidden cursor-pointer hover:bg-[#ffffff1a] duration-200 flex justify-center items-center ${
        className || ""
      }`}
      onClick={onClick}
    >
      <Icon className="w-full h-auto" />
    </div>
  );
}

export default IconCompo;
