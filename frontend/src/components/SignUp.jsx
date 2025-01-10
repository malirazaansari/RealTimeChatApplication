import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { BsMicrosoft } from "react-icons/bs";
import { BiUser } from "react-icons/bi";

const SignUp = () => {
  const handleSignUp = (e) => {
    e.preventDefault();
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
            SIGN UP
          </h1>
          <p className="font-medium text-[#008D9C] text-3xl md:text-4xl lg:text-6xl">
            TO BOTCHAT
          </p>
        </div>
      </div>

      <div className="relative z-10 flex justify-center items-center col-span-1 md:col-span-6 pt-15 pr-6">
        <div className="bg-white p-6 rounded-lg w-full max-w-[450px]">
          <h2 className="mb-2 font-bold text-3xl text-center text-gray-800 md:text-3xl">
            Create an Account
          </h2>
          <p className="mb-5 text-center text-gray-500 text-sm">
            {"Let's get started with your 30 days trial"}
          </p>

          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-black text-left text-sm">
                Name
              </label>
              <div className="relative">
                <BiUser className="top-1/2 left-3 absolute w-5 h-5 text-gray-500 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-[#008D9C] w-full focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-black text-left text-sm">
                Email
              </label>
              <div className="relative">
                <MdEmail className="top-1/2 left-3 absolute w-5 h-5 text-gray-500 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-[#008D9C] w-full focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-black text-left text-sm">
                Password
              </label>
              <div className="relative">
                <RiLockPasswordLine className="top-1/2 left-3 absolute w-5 h-5 text-gray-500 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-[#008D9C] w-full focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#008D9C] hover:bg-[#007483] mt-2 py-2 rounded-lg w-full text-white transition-colors"
            >
              Create Account
            </button>
          </form>

          <p className="text-right mt-3 text-gray-600 text-sm">
            <Link
              to="/signin"
              className="text-[#008D9C] underline"
            >
              Login
            </Link>
          </p>

          <div className="mt-5">
            <p className="mb-4 text-center text-gray-500 text-sm">
              or continue with
            </p>
            <div className="gap-4 grid grid-cols-2">
              <button className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-600 transition-colors">
                <FcGoogle className="mr-2 w-5 h-5" />
                Google
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

export default SignUp;
