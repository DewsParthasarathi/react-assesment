import member1 from "../assets/images/member1.jpg";
import member2 from "../assets/images/member2.jpg";
import member3 from "../assets/images/member3.jpg";
import member4 from "../assets/images/member4.jpg";
import member5 from "../assets/images/member5.jpg";
import member6 from "../assets/images/member6.jpg";
import member8 from "../assets/images/member8.jpg";

export const memberAvatars: Record<string, string> = {
  "1": member1,
  "2": member2,
  "3": member3,
  "4": member4,
  "5": member5,
  "6": member6,
  "8": member8,
  member1,
  member2,
  member3,
  member4,
  member5,
  member6,
  member8,
};

/**
 * Returns the resolved image asset for a given avatar key (e.g., 'member1') or user ID ('1').
 * Defaults to member1 if not found.
 */
export const getMemberAvatar = (avatarKeyOrUserId?: string | null): string => {
  if (!avatarKeyOrUserId) return member1;
  return memberAvatars[avatarKeyOrUserId] || member1;
};

export default getMemberAvatar;
