import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useNavigate } from "react-router";

export const GeneralForm = ({ func }) => {
  const isSignup = func.name.toLowerCase().includes("signup");

  const [formData, handleChange] = useForm({
    email: "",
    ...isSignup ? { username: "" } : undefined,
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    func(formData);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 md:-mt-20">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-blue-500 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 mb-2">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {isSignup ? "Join us and start your betterment journey" : "Enter your credentials to access your account"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input 
            type="text" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="you@example.com" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {isSignup && (
          <div className="space-y-1.5 transform transition-all duration-300 ease-in-out">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Choose a username" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Enter your password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 pr-12"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1.5 rounded-lg focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <p className="flex gap-2 pt-3">{isSignup ? "already have an account? " : "don't have an account? "} <strong className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-500 cursor-pointer" onClick={() => {isSignup ? navigate("/signin") : navigate("/signup")}}>{isSignup ? "Sign In" : "Sign Up"}</strong></p>

        <button 
          type="submit" 
          className="w-full mt-2 bg-linear-to-r from-indigo-600 via-purple-600 to-blue-500 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          {isSignup ? "Create Account" : "Sign In"}
        </button>
      </form>
      </div>
    </div>
  );
};