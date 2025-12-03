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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* MODAL CARD */}
      <div
        className="
          w-full max-w-md
          bg-[#1c1d21]
          rounded-xl
          p-6
          border border-[#2a2b2f]
          shadow-[0_12px_32px_rgba(0,0,0,0.55)]
          text-[#f2f3f5]
        "
      >
        {/* TITLE */}
        <h2 className="text-lg font-semibold tracking-wide">
          Create Channel
        </h2>

        <p className="text-sm text-[#8b8e94] mt-1 mb-5">
          Choose a short, descriptive name for your channel.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* INPUT FIELD */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase font-semibold text-[#9da0a6] tracking-wide">
              Channel Name
            </label>

            <input
              {...register("name", { required: true })}
              type="text"
              placeholder="general, team-chat, updates"
              className="
                w-full p-3 rounded-md
                bg-[#232427]
                border border-[#323337]
                text-sm
                text-[#f2f3f5]
                placeholder-[#6f7276]
                outline-none
                focus:border-[#5865f2]
                focus:ring-1 focus:ring-[#5865f2]
                transition
              "
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2 rounded-md
                bg-[#2a2c2f]
                border border-[#3a3b3f]
                text-[#c1c3c6]
                hover:bg-[#34363a]
                transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-5 py-2 rounded-md
                bg-[#5865f2]
                text-white font-medium
                hover:bg-[#4a54d1]
                transition
                shadow-[0_4px_12px_rgba(88,101,242,0.3)]
              "
            >
              Create
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
