import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../../components/ui/CustomInput";
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomImage } from "../../components/ui/CustomImage";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";
import { getMemberAvatar } from "../../utils/userAvatars";

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const avatarUrl = getMemberAvatar(currentUser?.avatar || currentUser?.id);
  const memberName = currentUser?.name || "John Doe";
  const memberEmail = currentUser?.email || "user1@example.com";
  const memberRole = currentUser?.role || "Administrator";
  const memberId = currentUser?.id || "1";

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowProfileMenu(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="shrink-0 sticky top-[2.5%] z-30 w-[95%] mx-auto mt-[2.5%] bg-white/95 backdrop-blur-md px-6 max-[1440px]:px-5 max-[1024px]:px-4 h-[62px] flex items-center justify-between border-b border-[#dbdade]/40 shadow-[0_2px_4px_rgba(165,163,174,0.1)] rounded-[5px]">
      {/* Search Input using CustomInput */}
      <div className="flex items-center flex-1 max-w-md">
        <CustomInput
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          leftIcon={
            <svg
              className="w-5 h-5 text-[#6f6b7d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
          className="!h-10 !border-transparent !bg-transparent hover:!border-[#dbdade] focus:!border-[#696cff] !text-fs14"
        />
      </div>

      {/* Right-aligned Navigation Controls using CustomButton */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language / Translation */}
        <CustomButton
          aria-label="Change Language"
          title="Language"
          variant="icon"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
        </CustomButton>

        {/* Dark Mode Toggle */}
        <CustomButton
          variant="icon"
          onClick={toggleDarkMode}
          aria-label={
            isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
          title="Toggle Theme"
        >
          {isDarkMode ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </CustomButton>

        {/* Application Grid */}
        <CustomButton
          variant="icon"
          aria-label="Applications"
          title="Applications"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </CustomButton>

        {/* Notifications */}
        <CustomButton
          variant="icon"
          aria-label="Notifications"
          title="Notifications"
          className="relative"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ea5455]" />
        </CustomButton>

        {/* Dynamic User Profile Avatar & Dropdown */}
        <div className="relative ml-2" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            aria-label="User Profile Menu"
            className="relative cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-[#696cff]/10 border border-[#dbdade] flex items-center justify-center overflow-hidden font-semibold text-fs14 text-[#696cff]">
              <CustomImage
                src={avatarUrl}
                alt={memberName}
                objectFit="cover"
                fallback={
                  <span className="select-none">{memberName.charAt(0)}</span>
                }
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#28c76f] border-2 border-white" />
          </button>

          {/* User Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-[5px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#dbdade]/60 py-3 z-50 animate-in fade-in duration-150">
              {/* Header Info */}
              <div className="flex items-center gap-3 px-4 pb-3 border-b border-[#dbdade]/40">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#dbdade] shrink-0">
                  <CustomImage
                    src={avatarUrl}
                    alt={memberName}
                    objectFit="cover"
                    fallback={<span>{memberName.charAt(0)}</span>}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-fs14 font-semibold text-[#32475c] truncate">
                    {memberName}
                  </p>
                  <p className="text-fs12 text-[#6f6b7d] truncate">
                    {memberEmail}
                  </p>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#696cff]/10 text-[#696cff] mt-0.5">
                    {memberRole} (Member #{memberId})
                  </span>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="pt-2 px-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/pages/profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-fs14 text-[#6f6b7d] hover:bg-[#f5f5f9] hover:text-[#32475c] transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-fs14 text-[#ea5455] hover:bg-red-50 transition font-medium mt-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
