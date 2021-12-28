function Layout({ children, className }) {
  return (
    <div
      className={`relative w-full h-screen sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:shadow-md sm:border sm:border-gray-200 sm:w-[420px] sm:h-[95vh] ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}

export default Layout;
