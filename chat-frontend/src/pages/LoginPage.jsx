import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";

// IMPORT YOUR LOCAL BACKGROUND
import bgImage from "../assets/background.png";

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  async function onSubmit(values) {
    try {
      const { data } = await api.post("/auth/login", values);
      login(data.token, data.user);
      navigate("/app");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex justify-center items-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="bg-[#313338] p-10 rounded-lg shadow-2xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Welcome back!
        </h2>

        <p className="text-gray-300 text-center mb-8">
          We're so excited to see you again!
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="text-xs text-gray-400 font-semibold">EMAIL</label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email"
              className="w-full mt-1 bg-[#1e1f22] border border-[#3c3f45] text-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs text-gray-400 font-semibold">PASSWORD</label>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password"
              className="w-full mt-1 bg-[#1e1f22] border border-[#3c3f45] text-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded transition">
            Login
          </button>
        </form>

        {/* <div className="mt-4 text-sm">
          <button className="text-indigo-400 hover:underline">Forgot your password?</button>
        </div> */}

        <p className="mt-2 text-sm text-gray-400">
          Need an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
