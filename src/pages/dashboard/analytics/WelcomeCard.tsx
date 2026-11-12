import React from "react";
import illustrationJohn from "../../../assets/images/illustration-john-light.png";

interface WelcomeCardProps {
  greeting?: string;
  description?: React.ReactNode;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({
  greeting = "Congratulations John!",
  description = (
    <>
      You have done 72% more sales today.
      <br />
      Check your new badge in your profile.
    </>
  ),
}) => {
  const renderDescription = () => {
    if (typeof description === "string") {
      const trimmed = description.trim();
      const dotIndex = trimmed.indexOf(". ");
      if (dotIndex !== -1 && dotIndex < trimmed.length - 2) {
        return (
          <>
            {trimmed.slice(0, dotIndex + 1)}
            <br />
            {trimmed.slice(dotIndex + 2)}
          </>
        );
      }

      if (trimmed.includes("Check your new badge")) {
        const parts = trimmed.split("Check your new badge");
        return (
          <>
            {parts[0].trim()}
            <br />
            Check your new badge{parts[1]}
          </>
        );
      }

      const words = trimmed.split(" ");
      if (words.length >= 5) {
        const mid = Math.ceil(words.length / 2);
        return (
          <>
            {words.slice(0, mid).join(" ")}
            <br />
            {words.slice(mid).join(" ")}
          </>
        );
      }

      return trimmed;
    }

    return description;
  };

  return (
    <div className="bg-white rounded-[6px] p-5 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] relative overflow-hidden flex flex-col justify-between h-full">
      <div className="max-w-[62%] sm:max-w-[65%] z-10">
        <h2 className="text-fs20 font-bold text-[#696cff] tracking-normal">
          {greeting}
        </h2>
        <div className="text-fs14 text-[#6f6b7d] mt-2.5 leading-relaxed tracking-normal max-w-[340px]">
          {renderDescription()}
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="border border-[#696cff] text-[#696cff] hover:bg-[#696cff]/10 px-4 py-1.5 rounded-[6px] text-fs12 font-semibold uppercase tracking-wider transition cursor-pointer"
          >
            VIEW BADGES
          </button>
        </div>
      </div>

      <div className="absolute right-4 bottom-0 w-[170px] max-[1280px]:w-[145px] pointer-events-none select-none">
        <img
          src={illustrationJohn}
          alt="Congratulations"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default WelcomeCard;
