import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { BsMicrosoft } from "react-icons/bs";
const SignIn = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };
  return (
    // <div className="flex min-h-screen">
    //   {/* Left Section */}
    //   <div className="flex flex-col flex-1 justify-center items-center text-white">
    //     <div className="top-[348.57px] left-[99.6px] absolute gap-0 opacity-0 w-[499.33px] h-[182.31px]">
    //       <img
    //         src="../assets/signin.svg"
    //         alt="Sign In to Botchat"
    //         className="w-full h-full object-contain"
    //       />
    //     </div>
    //   </div>

    //   {/* Right Section */}
    //   <div className="flex flex-1 justify-center items-center bg-gray-100">
    //     <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
    //       <h3 className="font-semibold text-2xl text-center">Welcome back</h3>
    //       <p className="mb-6 text-center text-gray-500">
    //         Enter your details to continue
    //       </p>
    //       <form>
    //         {/* Email Input */}
    //         <div className="mb-4">
    //           <label
    //             htmlFor="email"
    //             className="block font-medium text-gray-700 text-sm"
    //           >
    //             Email
    //           </label>
    //           <input
    //             type="email"
    //             id="email"
    //             placeholder="Enter your email"
    //             className="block border-gray-300 shadow-sm mt-1 px-4 py-2 border focus:border-teal-500 rounded-md focus:ring-teal-500 w-full"
    //           />
    //         </div>
    //         {/* Password Input */}
    //         <div className="mb-4">
    //           <div className="flex justify-between items-center content-center">
    //             <label
    //               htmlFor="password"
    //               className="font-medium text-gray-700 text-sm"
    //             >
    //               Password
    //             </label>
    //             <span>
    //               <a
    //                 href="/forgot-password"
    //                 className="text-sm text-teal-600 hover:underline"
    //               >
    //                 Forgot Password?
    //               </a>
    //             </span>
    //           </div>
    //           <input
    //             type="password"
    //             id="password"
    //             placeholder="Enter your password"
    //             className="block border-gray-300 shadow-sm mt-1 px-4 py-2 border focus:border-teal-500 rounded-md focus:ring-teal-500 w-full"
    //           />
    //         </div>

    //         {/* Log In Button */}
    //         <button
    //           type="submit"
    //           className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md w-full text-white transition"
    //         >
    //           Log In
    //         </button>
    //       </form>
    //       <div className="mt-4 text-end">
    //         <a
    //           href="/signup"
    //           className="text-sm text-teal-600 hover:underline"
    //         >
    //           Create Account
    //         </a>
    //       </div>
    //       {/* Divider */}
    //       <div className="flex items-center mt-6">
    //         <hr className="flex-1 border-gray-300" />
    //         <span className="mx-4 text-gray-500">Or continue with</span>
    //         <hr className="flex-1 border-gray-300" />
    //       </div>
    //       {/* OAuth Buttons */}
    //       <div className="flex gap-4 mt-6">
    //         <button
    //           type="button"
    //           className="flex flex-1 justify-center items-center gap-2 border-gray-300 bg-gray-100 hover:bg-gray-200 px-4 py-2 border rounded-md transition"
    //         >
    //           <img
    //             src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
    //             alt="Google"
    //             className="w-5 h-5"
    //           />
    //           Google
    //         </button>
    //         <button
    //           type="button"
    //           className="flex flex-1 justify-center items-center gap-2 border-gray-300 bg-gray-100 hover:bg-gray-200 px-4 py-2 border rounded-md transition"
    //         >
    //           <img
    //             src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
    //             alt="Microsoft"
    //             className="w-5 h-5"
    //           />
    //           Microsoft
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>

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
            SIGN IN
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
                  placeholder="Enter your email"
                  className="px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-[#008D9C] w-full focus:outline-none"
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
              Log In
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

export default SignIn;
