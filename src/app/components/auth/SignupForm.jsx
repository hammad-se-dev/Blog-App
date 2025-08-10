"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().min(2).required("Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .min(6)
    .required("Password must be at least 6 characters"),
});

export default function SignUpForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSignUp = async (data) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(result.error || "Signup failed");
        return;
      }

      alert("Signup successful. You can log in now.");
      router.push("/login");
    } catch (err) {
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      // Redirect to Google OAuth endpoint
      window.location.href = "/api/auth/google?type=signup";
    } catch (err) {
      setError("Google signup failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
      <form onSubmit={handleSubmit(handleSignUp)} className="space-y-6">
        <h2 className="text-2xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 tracking-tight drop-shadow">
          Sign Up
        </h2>

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="w-full bg-white border-2 border-slate-200 text-slate-700 font-semibold py-4 px-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 text-lg flex justify-center items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          {googleLoading ? (
            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          {googleLoading ? "Signing up..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/90 text-slate-500 font-medium">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Ron Larson"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
            placeholder="you@example.com"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
            placeholder="••••••••"
          />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500 text-center font-semibold">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-2xl hover:from-emerald-700 hover:via-emerald-800 hover:to-teal-800 transform hover:-translate-y-1 transition-all duration-300 text-lg flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none group"
          disabled={loading || googleLoading}
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* Redirect to login */}
        <p className="text-sm text-center text-slate-600 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold transition-colors duration-200"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
