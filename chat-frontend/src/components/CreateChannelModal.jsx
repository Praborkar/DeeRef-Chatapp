import React from "react";
import { useForm } from "react-hook-form";
import { useChannels } from "../hooks/useChannels";

export default function CreateChannelModal({ onClose }) {
  const { register, handleSubmit } = useForm();
  const { createChannel } = useChannels();

  async function onSubmit(values) {
    try {
      await createChannel.mutateAsync(values);
      onClose();
    } catch (err) {
      alert("Failed to create channel");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fadeIn">

        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Create a New Channel
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Channel Name
            </label>

            <input
              {...register("name", { required: true })}
              type="text"
              placeholder="e.g. general, team-chat, marketing"
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-3 rounded-lg text-sm outline-none transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
            >
              Create
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
