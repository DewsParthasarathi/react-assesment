import { CustomImage } from "../../../components/ui/CustomImage";
import member1 from "../../../assets/images/member1.jpg";
import member2 from "../../../assets/images/member2.jpg";
import member3 from "../../../assets/images/member3.jpg";
import member4 from "../../../assets/images/member4.jpg";
import member5 from "../../../assets/images/member5.jpg";
import member6 from "../../../assets/images/member6.jpg";
import member8 from "../../../assets/images/member8.jpg";

const memberImageMap: Record<string, string> = {
  member1,
  "member1.jpg": member1,
  member2,
  "member2.jpg": member2,
  member3,
  "member3.jpg": member3,
  member4,
  "member4.jpg": member4,
  member5,
  "member5.jpg": member5,
  member6,
  "member6.jpg": member6,
  member8,
  "member8.jpg": member8,
};

export const renderChatAvatar = (
  avatarKey?: string,
  name?: string,
  sizeClass = "w-10 h-10",
  showOnline = true,
  isOnline = true,
) => {
  if (avatarKey === "gemini" || avatarKey?.includes("ai")) {
    return (
      <div className={`relative ${sizeClass} shrink-0`}>
        <div
          className={`w-full h-full rounded-full bg-gradient-to-tr from-[#696cff] via-[#7367f0] to-[#03c3ec] text-white flex items-center justify-center shadow-xs border border-white`}
          title="Google Gemini AI"
        >
          <svg
            className="w-5 h-5 fill-current text-white animate-pulse"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
        </div>
        {showOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#71dd37] ring-2 ring-white" />
        )}
      </div>
    );
  }

  const imageSrc = memberImageMap[avatarKey || ""] || memberImageMap["member2"];

  return (
    <div className={`relative ${sizeClass} shrink-0`}>
      <CustomImage
        src={imageSrc}
        alt={name || "User Avatar"}
        containerClassName="w-full h-full rounded-full"
        className="w-full h-full rounded-full border border-[#dbdade]/50"
        objectFit="cover"
      />
      {showOnline && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
            isOnline ? "bg-[#71dd37]" : "bg-[#a5a3ae]"
          }`}
        />
      )}
    </div>
  );
};
