import { Outlet } from "react-router-dom";
import Logo from "/logo.png";
import Header from "../Header";

const Layout = () => {
  return (
    <>
      <Header />
      <div className="flex h-screen">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gray-100 text-center p-6 sticky top-0 h-screen">
          <img src={Logo} alt="Logo" className="w-32 mb-4" />
          <h1 className="text-2xl font-bold">Welcome to The Platform</h1>
          <p className="text-gray-600">
            Your best platform to <span className="text-pink-600"> Donate</span>{" "}
            Who they need.
          </p>
        </div>

        {/* Right Panel (Form Section) */}
        <div className="flex items-center justify-center w-full md:w-1/2 p-6">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
