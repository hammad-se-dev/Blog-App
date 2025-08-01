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
        body: JSON.stringify(data), // data includes name, email, password
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

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
      <form onSubmit={handleSubmit(handleSignUp)} className="space-y-6">
        <h2 className="text-2xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 tracking-tight drop-shadow">
          Sign Up
        </h2>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-indigo-700 mb-2"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Ron Larson"
            className="w-full px-4 py-3 border-2 border-indigo-100 rounded-xl bg-indigo-50 placeholder:text-indigo-300 text-lg focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition"
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>

          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-indigo-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-4 py-3 border-2 border-indigo-100 rounded-xl bg-indigo-50"
            placeholder="you@example.com"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-indigo-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full px-4 py-3 border-2 border-indigo-100 rounded-xl bg-indigo-50"
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
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:from-indigo-700 hover:to-pink-600 transition-all duration-200 text-lg flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "Creating Account..." : "Signup"}
        </button>

        {/* Redirect to login */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-600 hover:underline font-semibold"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
