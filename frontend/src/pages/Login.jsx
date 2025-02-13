import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLoader2Fill, RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { BsEye, BsMicrosoft } from "react-icons/bs";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLogginingIn } = useAuthStore();

  const validateForm = () => {
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email");
    if (!formData.password) return toast.error("Password is required");

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const sucess = validateForm();

    if (sucess === true) login(formData);
  };

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-12 bg-white min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <div className="top-[-133px] left-[-166px] absolute">
          <div className="md:block border-[#008D9C] border-[12px] hidden rounded-full w-[360px] h-[360px]"></div>
          <div className="md:block top-[4px] left-[4px] absolute border-[#008D9C] border-[12px] hidden rounded-full w-[303px] h-[303px]"></div>
        </div>

        <div className="md:block top-0 left-[390px] absolute hidden bg-[#008D9C] w-[136px] h-[180px]"></div>
        <div className="md:block bottom-0 left-0 absolute hidden bg-[#008D9C] w-[380px] h-[180px]"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center col-span-1 md:col-span-6 p-10">
        <div className="text-center">
          <h1 className="mb-2 font-bold text-5xl text-black md:text-6xl lg:text-8xl">
            LOGIN
          </h1>
          <p className="font-medium text-[#008D9C] text-3xl md:text-4xl lg:text-6xl">
            TO BOTCHAT
          </p>
        </div>
      </div>

      <div className="relative z-10 flex justify-center items-center col-span-1 md:col-span-6 pt-15 pr-6">
        <div className="bg-white p-6 rounded-lg w-full max-w-[450px]">
          <h2 className="p-2 font-bold text-3xl text-center text-gray-800 md:text-3xl">
            Welcome back
          </h2>
          <p className="mb-4 p-2 pt-0 text-center text-gray-500 text-sm">
            Enter your details to continue.
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-black text-left text-sm">
                Email
              </label>
              <div className="relative">
                <MdEmail className="top-1/2 left-3 absolute w-5 h-5 text-gray-500 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="bg-gray-300 px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-[#008D9C] w-full focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="flex justify-between items-center mb-1 font-medium text-black text-left text-sm">
                Password
                <a
                  href="#"
                  className="text-gray-500 text-sm hover:underline"
                >
                  Forgot password?
                </a>
              </label>
              <div className="relative">
                <RiLockPasswordLine className="top-1/2 left-3 absolute w-5 h-5 text-gray-500 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-gray-300 px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-[#008D9C] w-full focus:outline-none"
                />
                <button
                  type="button"
                  className="right-0 absolute inset-y-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-base-content/40 text-gray-900 size-5" />
                  ) : (
                    <BsEye className="text-base-content/40 text-gray-900 size-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLogginingIn}
              className="bg-[#008D9C] hover:bg-[#007483] mt-2 py-2 rounded-lg w-full text-white transition-colors"
            >
              {isLogginingIn ? (
                <>
                  <RiLoader2Fill className="animate-spin size-5" />
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p className="text-right mt-3 text-gray-600 text-sm">
            <Link
              to="/signup"
              className="text-[#008D9C] underline"
            >
              Create Account
            </Link>
          </p>

          <div className="mt-5">
            <p className="mb-4 text-center text-gray-500 text-sm">
              or continue with
            </p>
            <div className="gap-4 grid grid-cols-2">
              <button className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-600 transition-colors">
                <FcGoogle className="mr-2 w-5 h-5" />
                Connect with Google
              </button>
              <button className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-600 transition-colors">
                <BsMicrosoft className="mr-2 w-5 h-5" />
                Microsoft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
