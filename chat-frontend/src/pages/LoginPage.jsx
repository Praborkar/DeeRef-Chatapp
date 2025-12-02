import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";

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
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">

        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
          />

          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
