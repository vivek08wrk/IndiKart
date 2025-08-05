import React, { Fragment, useContext, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { BsFillCloudSunFill } from "react-icons/bs";
import { FiSun } from "react-icons/fi";
import MyContext from "../../Context/data/MyContext";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const context = useContext(MyContext);
  const { toggleMode, mode } = context;

  const user = JSON.parse(localStorage.getItem("user"));
  const cartItems = useSelector((state) => state.cart);

  const logout = () => {
    localStorage.clear("user");
    window.location.href = "/login";
  };

  return (
    <div className="bg-white sticky top-0 z-50">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel
                className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl"
                style={{
                  maxWidth: "260px",
                  backgroundColor: mode === "dark" ? "rgb(40, 44, 52)" : "",
                  color: mode === "dark" ? "white" : "",
                }}
              >
                <div className="space-y-4 border-t border-gray-200 px-4 py-6 flex flex-col items-start w-full pt-28">
                  <img
                    className="w-16 h-16 rounded-full border-2 border-pink-600 mb-2"
                    src={
                      user?.user?.photoURL ||
                      "https://randomuser.me/api/portraits/men/75.jpg"
                    }
                    alt={user?.user?.email || "User"}
                  />

                  <Link to="/allproducts" onClick={() => setOpen(false)} className="menu-link">
                    All Products
                  </Link>
                  <Link to="/order" onClick={() => setOpen(false)} className="menu-link">
                    Order
                  </Link>
                  {user?.user?.email === "vivekrawat08wrk@gmail.com" && (
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="menu-link">
                      Admin
                    </Link>
                  )}
                  {user ? (
                    <button
                      onClick={logout}
                      className="menu-link w-full text-left"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link to="/signup" onClick={() => setOpen(false)} className="menu-link">
                      Signup
                    </Link>
                  )}
                </div>

                <div className="border-t border-gray-200 px-4 py-6">
                  <div className="flex items-center p-2">
                    <img
                      src="https://ecommerce-sk.vercel.app/img/indiaflag.png"
                      alt="India Flag"
                      className="block h-5 w-5 flex-shrink-0"
                    />
                    <span
                      className="ml-3 block text-base font-medium"
                      style={{ color: mode === "dark" ? "white" : "" }}
                    >
                      INDIA
                    </span>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop Navbar */}
      <header className="relative bg-white">
        <p
          className="flex h-10 items-center justify-center bg-pink-600 px-4 text-sm font-medium text-white"
          style={{
            backgroundColor: mode === "dark" ? "rgb(62 64 66)" : "",
            color: mode === "dark" ? "white" : "",
          }}
        >
          Get free delivery on orders over ₹300
        </p>

        <nav
          className="bg-gray-100 px-4 shadow-xl sm:px-6 lg:px-8"
          style={{
            backgroundColor: mode === "dark" ? "#282c34" : "",
            color: mode === "dark" ? "white" : "",
          }}
        >
          <div className="flex h-16 items-center">
            {/* Hamburger Toggle Button */}
            <button
              type="button"
              className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
              onClick={() => setOpen(!open)}
              style={{
                backgroundColor: mode === "dark" ? "rgb(80 82 87)" : "",
                color: mode === "dark" ? "white" : "",
              }}
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            {/* Logo */}
            <Link to="/" className="ml-4 flex lg:ml-0">
              <h1
                className="text-2xl font-bold px-2 py-1 rounded"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                IndiKart
              </h1>
            </Link>

            {/* Right Side */}
            <div className="ml-auto flex items-center">
              <div className="hidden lg:flex lg:space-x-6">
                <Link to="/allproducts" className="nav-link">All Products</Link>
                <Link to="/order" className="nav-link">Order</Link>
                {user?.user?.email === "vivekrawat08wrk@gmail.com" && (
                  <Link to="/dashboard" className="nav-link">Admin</Link>
                )}
                {user ? (
                  <span onClick={logout} className="nav-link cursor-pointer">Logout</span>
                ) : (
                  <Link to="/signup" className="nav-link">Signup</Link>
                )}
              </div>

              <div className="hidden lg:flex lg:ml-8">
                <div className="flex items-center text-gray-700">
                  <img
                    src="https://ecommerce-sk.vercel.app/img/indiaflag.png"
                    alt="India Flag"
                    className="block h-auto w-5 flex-shrink-0"
                  />
                  <span
                    className="ml-3 text-sm font-medium"
                    style={{ color: mode === "dark" ? "white" : "" }}
                  >
                    INDIA
                  </span>
                </div>
              </div>

              <div className="hidden lg:ml-8 lg:flex">
                <img
                  className="inline-block w-10 h-10 rounded-full"
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="User"
                />
              </div>

              <div className="flex lg:ml-6">
                <button onClick={toggleMode}>
                  {mode === "light" ? (
                    <FiSun size={30} />
                  ) : (
                    <BsFillCloudSunFill size={30} />
                  )}
                </button>
              </div>

              <div className="ml-4 flow-root lg:ml-6">
                <Link to="/cart" className="group -m-2 flex items-center p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  <span
                    className="ml-2 text-sm font-medium text-gray-700"
                    style={{ color: mode === "dark" ? "white" : "" }}
                  >
                    {cartItems.length}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
