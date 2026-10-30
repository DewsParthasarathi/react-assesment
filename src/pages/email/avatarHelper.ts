import member1 from "../../assets/images/member1.jpg";
import member2 from "../../assets/images/member2.jpg";
import member3 from "../../assets/images/member3.jpg";
import member4 from "../../assets/images/member4.jpg";
import member5 from "../../assets/images/member5.jpg";
import member6 from "../../assets/images/member6.jpg";
import member8 from "../../assets/images/member8.jpg";

const avatarMap: Record<string, string> = {
  "member1.jpg": member1,
  "member2.jpg": member2,
  "member3.jpg": member3,
  "member4.jpg": member4,
  "member5.jpg": member5,
  "member6.jpg": member6,
  "member8.jpg": member8,
};

export const getAvatarUrl = (avatarName?: string): string => {
  if (!avatarName) return member1;
  return avatarMap[avatarName] || avatarName;
};

