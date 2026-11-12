import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import type { RootState } from "../../store";
import {
  useProfileQuery,
  useToggleConnectionMutation,
} from "../../hooks/useProfileQuery";
import type { ProfileProject, ProfileTeam } from "../../api/types";
import { getMemberAvatar } from "../../utils/userAvatars";
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomInput } from "../../components/ui/CustomInput";
import { CustomCheckbox } from "../../components/ui/CustomCheckbox";
import { CustomTable, type TableColumn } from "../../components/ui/Table";
import { AnchoredPortal } from "../../components/ui/FloatingPortal";
import { CustomImage } from "../../components/ui/CustomImage";
import profileBg from "../../assets/images/profile-bg.jpg";
import socialBannersIcon from "../../assets/images/Social Banners.png";
import sketchLogo from "../../assets/images/sketch-logo.png";
import vueLogo from "../../assets/images/Vue.js_Logo_2 1.png";
import xdLogo from "../../assets/images/Adobe_XD_CC_icon 1.png";
import supportLogo from "../../assets/images/Support Team.png";
import figmaLogo from "../../assets/images/Figma-logo 1.png";
import htmlLogo from "../../assets/images/Html.png";
import reactLogo from "../../assets/images/React-icon.svg.png";

export type ProfileTabType = "profile" | "teams" | "projects" | "connections";

interface ProfilePageProps {
  initialTab?: ProfileTabType;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  initialTab,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { data: profile, isLoading } = useProfileQuery();
  const toggleConnectionMutation = useToggleConnectionMutation();

  const activeTab: ProfileTabType = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.endsWith("/teams")) return "teams";
    if (path.endsWith("/projects")) return "projects";
    if (path.endsWith("/connections")) return "connections";
    if (path.endsWith("/profile")) return "profile";
    return initialTab ?? "profile";
  }, [location.pathname, initialTab]);

  const handleTabChange = useCallback(
    (tab: ProfileTabType) => {
      switch (tab) {
        case "teams":
          navigate("/pages/teams");
          break;
        case "projects":
          navigate("/pages/projects");
          break;
        case "connections":
          navigate("/pages/connections");
          break;
        case "profile":
        default:
          navigate("/pages/profile");
          break;
      }
    },
    [navigate],
  );
  const [projectSearch, setProjectSearch] = useState("");
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [starredTeamIds, setStarredTeamIds] = useState<string[]>([]);

  const handleToggleStarTeam = useCallback((id: string) => {
    setStarredTeamIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id],
    );
  }, []);

  // Toggle single project selection
  const handleToggleSelectProject = useCallback((id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id],
    );
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    const list = profile?.projects || [];
    if (!projectSearch.trim()) return list;
    const q = projectSearch.toLowerCase().trim();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.leader.toLowerCase().includes(q),
    );
  }, [profile?.projects, projectSearch]);

  // Select all projects
  const isAllProjectsSelected =
    filteredProjects.length > 0 &&
    filteredProjects.every((p) => selectedProjectIds.includes(p.id));

  const handleToggleSelectAllProjects = useCallback(() => {
    if (isAllProjectsSelected) {
      setSelectedProjectIds([]);
    } else {
      setSelectedProjectIds(filteredProjects.map((p) => p.id));
    }
  }, [isAllProjectsSelected, filteredProjects]);

  // Handle connection toggle
  const handleToggleConnection = async (id: string) => {
    try {
      await toggleConnectionMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to toggle connection:", err);
    }
  };

  // Project icon renderer matching reference UI
  const renderProjectIcon = (proj: ProfileProject) => {
    const nameLower = proj.name.toLowerCase();
    if (nameLower.includes("social banners")) {
      return (
        <div className="w-9 h-9 rounded-full bg-[#f1f0f2] flex items-center justify-center shrink-0 p-1.5">
          <CustomImage
            src={socialBannersIcon}
            alt={proj.name}
            objectFit="contain"
            className="w-full h-full"
            containerClassName="w-full h-full flex items-center justify-center"
          />
        </div>
      );
    }
    if (nameLower.includes("logo design")) {
      return (
        <div className="w-9 h-9 rounded-full bg-[#fff1e3] flex items-center justify-center shrink-0 p-1.5">
          <CustomImage
            src={sketchLogo}
            alt={proj.name}
            objectFit="contain"
            className="w-full h-full"
            containerClassName="w-full h-full flex items-center justify-center"
          />
        </div>
      );
    }
    if (nameLower.includes("figma")) {
      return (
        <div className="w-9 h-9 rounded-full bg-[#ffebee] flex items-center justify-center shrink-0 p-1.5">
          <CustomImage
            src={figmaLogo}
            alt={proj.name}
            objectFit="contain"
            className="w-full h-full"
            containerClassName="w-full h-full flex items-center justify-center"
          />
        </div>
      );
    }
    if (nameLower.includes("crypto") || nameLower.includes("admin")) {
      return (
        <div className="w-9 h-9 rounded-full bg-[#ffe0db] flex items-center justify-center shrink-0 p-1.5">
          <CustomImage
            src={htmlLogo}
            alt={proj.name}
            objectFit="contain"
            className="w-full h-full"
            containerClassName="w-full h-full flex items-center justify-center"
          />
        </div>
      );
    }
    if (nameLower.includes("website") && !nameLower.includes("seo")) {
      return (
        <div className="w-9 h-9 rounded-full bg-[#dcf6f8] flex items-center justify-center shrink-0 p-1.5">
          <CustomImage
            src={reactLogo}
            alt={proj.name}
            objectFit="contain"
            className="w-full h-full"
            containerClassName="w-full h-full flex items-center justify-center"
          />
        </div>
      );
    }

    return (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
        style={{
          backgroundColor: proj.iconBg || "#e8fadf",
          color: proj.name.toLowerCase().includes("seo")
            ? "#28c76f"
            : "#5d596c",
        }}
      >
        {proj.icon || "WS"}
      </div>
    );
  };

  const getTeamBadgeStyles = (label: string) => {
    switch (label.toUpperCase()) {
      case "REACT":
      case "TWITTER":
        return "bg-[#edeafd] text-[#7367F0]";
      case "MUI":
      case "ZENDESK":
      case "EMAIL":
      case "CSS":
        return "bg-[#d9f8fc] text-[#00cfe8]";
      case "VUEJS":
      case "HUBILO":
      case "UI/UX":
        return "bg-[#e8fadf] text-[#28c76f]";
      case "DEVELOPER":
      case "XD":
        return "bg-[#ffe2e3] text-[#ea5455]";
      case "SKETCH":
      case "HTML":
        return "bg-[#fff1e3] text-[#ff9f43]";
      case "FIGMA":
      default:
        return "bg-[#f1f1f2] text-[#82868b]";
    }
  };

  const renderTeamIcon = (team: ProfileTeam) => {
    const iconKey = team.icon?.toLowerCase() || "";
    if (iconKey.includes("react")) {
      return (
        <CustomImage
          src={reactLogo}
          alt={team.name}
          objectFit="contain"
          className="w-7 h-7"
          containerClassName="w-7 h-7 shrink-0"
        />
      );
    }
    if (iconKey.includes("vue")) {
      return (
        <CustomImage
          src={vueLogo}
          alt={team.name}
          objectFit="contain"
          className="w-7 h-7"
          containerClassName="w-7 h-7 shrink-0"
        />
      );
    }
    if (iconKey.includes("xd") || iconKey.includes("adobe")) {
      return (
        <CustomImage
          src={xdLogo}
          alt={team.name}
          objectFit="contain"
          className="w-7 h-7"
          containerClassName="w-7 h-7 shrink-0"
        />
      );
    }
    if (iconKey.includes("support")) {
      return (
        <CustomImage
          src={supportLogo}
          alt={team.name}
          objectFit="contain"
          className="w-7 h-7"
          containerClassName="w-7 h-7 shrink-0"
        />
      );
    }
    if (
      iconKey.includes("marketing") ||
      iconKey.includes("digital") ||
      iconKey.includes("twitter")
    ) {
      return (
        <CustomImage
          src={socialBannersIcon}
          alt={team.name}
          objectFit="contain"
          className="w-7 h-7"
          containerClassName="w-7 h-7 shrink-0"
        />
      );
    }
    if (
      iconKey.includes("event") ||
      iconKey.includes("hubilo") ||
      iconKey.includes("calendar")
    ) {
      return (
        <div className="w-7 h-7 rounded bg-[#e8fadf] text-[#28c76f] flex items-center justify-center shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
    if (iconKey.includes("figma")) {
      return (
        <CustomImage
          src={figmaLogo}
          alt={team.name}
          objectFit="contain"
          className="w-7 h-7"
          containerClassName="w-7 h-7 shrink-0"
        />
      );
    }
    if (
      iconKey.includes("html") ||
      iconKey.includes("beginner") ||
      iconKey.includes("css")
    ) {
      return (
        <CustomImage
          src={htmlLogo}
          alt={team.name}
          objectFit="contain"
          className="w-7 h-7"
          containerClassName="w-7 h-7 shrink-0"
        />
      );
    }
    return (
      <div className="w-7 h-7 rounded bg-[#7367F0]/10 text-[#7367F0] flex items-center justify-center font-bold text-xs shrink-0">
        {team.name.slice(0, 2).toUpperCase()}
      </div>
    );
  };

  const getDaysLeftBadgeStyles = (text: string) => {
    const upper = text.toUpperCase();
    if (
      upper.includes("45") ||
      upper.includes("EXPIRED") ||
      upper.includes("DUE")
    ) {
      return "bg-[#ffe2e3] text-[#ea5455]";
    }
    if (upper.includes("15") || upper.includes("SOON")) {
      return "bg-[#fff1e3] text-[#ff9f43]";
    }
    return "bg-[#e8fadf] text-[#28c76f]";
  };

  const renderProjectCardIcon = (proj: ProfileProject) => {
    const nameLower = proj.name.toLowerCase();
    if (nameLower.includes("banner") || nameLower.includes("social")) {
      return (
        <div className="w-10 h-10 rounded-full bg-[#f1f1f2] flex items-center justify-center shrink-0 p-2">
          <CustomImage
            src={socialBannersIcon}
            alt={proj.name}
            objectFit="contain"
            className="w-full h-full"
            containerClassName="w-full h-full flex items-center justify-center"
          />
        </div>
      );
    }
    if (nameLower.includes("template") || nameLower.includes("admin")) {
      return (
        <div className="w-10 h-10 rounded-full bg-[#dcf6f8] flex items-center justify-center shrink-0 p-2">
          <CustomImage
            src={reactLogo}
            alt={proj.name}
            objectFit="contain"
            className="w-full h-full"
            containerClassName="w-full h-full flex items-center justify-center"
          />
        </div>
      );
    }
    if (
      nameLower.includes("app") ||
      (nameLower.includes("design") && !nameLower.includes("logo"))
    ) {
      return (
        <div className="w-10 h-10 rounded-full bg-[#e8fadf] flex items-center justify-center shrink-0 p-2">
          <CustomImage
            src={vueLogo}
            alt={proj.name}
            objectFit="contain"
            className="w-full h-full"
            containerClassName="w-full h-full flex items-center justify-center"
          />
        </div>
      );
    }
    if (nameLower.includes("website") || nameLower.includes("create")) {
      return (
        <div className="w-10 h-10 rounded-full bg-[#fff1e3] flex items-center justify-center shrink-0 p-2">
          <CustomImage
            src={htmlLogo}
            alt={proj.name}
            objectFit="contain"
            className="w-full h-full"
            containerClassName="w-full h-full flex items-center justify-center"
          />
        </div>
      );
    }
    if (nameLower.includes("figma")) {
      return (
        <div className="w-10 h-10 rounded-full bg-[#ffe2e3] flex items-center justify-center shrink-0 p-2">
          <CustomImage
            src={figmaLogo}
            alt={proj.name}
            objectFit="contain"
            className="w-full h-full"
            containerClassName="w-full h-full flex items-center justify-center"
          />
        </div>
      );
    }
    if (nameLower.includes("logo") || nameLower.includes("xd")) {
      return (
        <div className="w-10 h-10 rounded-full bg-[#f3e8ff] flex items-center justify-center shrink-0 p-2">
          <CustomImage
            src={xdLogo}
            alt={proj.name}
            objectFit="contain"
            className="w-full h-full"
            containerClassName="w-full h-full flex items-center justify-center"
          />
        </div>
      );
    }
    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
        style={{
          backgroundColor: proj.iconBg || "#e8fadf",
          color: "#5d596c",
        }}
      >
        {proj.icon || "WS"}
      </div>
    );
  };

  // Project Table Columns
  const projectColumns: TableColumn<ProfileProject>[] = useMemo(
    () => [
      {
        id: "select",
        header: (
          <CustomCheckbox
            id="select-all-projects"
            checked={isAllProjectsSelected}
            onChange={handleToggleSelectAllProjects}
          />
        ),
        headerClassName:
          "w-14 sm:w-16 py-2.5 pl-5 sm:pl-6 pr-3 border-r border-[#dbdade]/60 text-left",
        className: "w-14 sm:w-16 py-3 pl-5 sm:pl-6 pr-3 text-left",
        render: (proj) => (
          <CustomCheckbox
            id={`proj-select-${proj.id}`}
            checked={selectedProjectIds.includes(proj.id)}
            onChange={() => handleToggleSelectProject(proj.id)}
          />
        ),
      },
      {
        id: "name",
        header: "NAME",
        headerClassName:
          "w-[160px] sm:w-[175px] py-2.5 px-3 border-r border-[#dbdade]/60 text-[11px] font-semibold text-[#5d596c] uppercase tracking-wider",
        className: "w-[160px] sm:w-[175px] px-3 py-3",
        render: (proj) => (
          <div className="flex items-center gap-2.5">
            {renderProjectIcon(proj)}
            <div className="min-w-0">
              <span className="block font-medium text-fs13 text-[#5d596c] hover:text-[#7367F0] cursor-pointer transition truncate">
                {proj.name}
              </span>
              <span className="block text-[11px] text-[#a5a3ae] mt-0.5">
                {proj.date}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "leader",
        header: "LEADER",
        headerClassName:
          "py-2.5 px-3 border-r border-[#dbdade]/60 text-[11px] font-semibold text-[#5d596c] uppercase tracking-wider",
        className: "px-3 py-3",
        render: (proj) => (
          <span className="text-fs13 text-[#a5a3ae] font-normal">
            {proj.leader}
          </span>
        ),
      },
      {
        id: "team",
        header: "TEAM",
        headerClassName:
          "py-2.5 px-3 border-r border-[#dbdade]/60 text-[11px] font-semibold text-[#5d596c] uppercase tracking-wider",
        className: "px-3 py-3",
        render: (proj) => (
          <div className="flex items-center -space-x-1.5">
            {proj.team.map((memberKey, idx) => (
              <CustomImage
                key={idx}
                src={getMemberAvatar(memberKey)}
                alt="Member"
                objectFit="cover"
                className="w-6 h-6 rounded-full border border-white"
                containerClassName="w-6 h-6 shrink-0"
              />
            ))}
          </div>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName:
          "py-2.5 px-3 border-r border-[#dbdade]/60 text-[11px] font-semibold text-[#5d596c] uppercase tracking-wider",
        className: "px-3 py-3",
        render: (proj) => (
          <div className="flex items-center gap-2">
            <div className="w-16 sm:w-20 bg-[#ecebfd] rounded-full h-1.5 overflow-hidden shrink-0">
              <div
                className="bg-[#7367F0] h-full rounded-full transition-all duration-300"
                style={{ width: `${proj.progress}%` }}
              />
            </div>
            <span className="text-[11px] text-[#a5a3ae] shrink-0">
              {proj.progress}%
            </span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "ACTIONS",
        headerClassName:
          "py-2.5 pl-2 pr-5 sm:pr-6 text-[11px] font-semibold text-[#5d596c] uppercase tracking-wider text-right",
        className: "py-3 pl-2 pr-5 sm:pr-6 text-right",
        render: (proj) => (
          <AnchoredPortal
            isOpen={openDropdownId === proj.id}
            onClose={() => setOpenDropdownId(null)}
            align="right"
            wrapperClassName="relative inline-flex items-center justify-end"
            trigger={
              <button
                type="button"
                onClick={() =>
                  setOpenDropdownId(openDropdownId === proj.id ? null : proj.id)
                }
                className="p-1 text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer"
                title="More actions"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            }
          >
            <div className="w-36 bg-white rounded-md shadow-lg border border-[#dbdade]/70 py-1 text-left">
              <button
                type="button"
                onClick={() => setOpenDropdownId(null)}
                className="w-full px-4 py-2 text-fs13 text-[#5d596c] hover:bg-[#f5f5f9] transition text-left cursor-pointer"
              >
                View Details
              </button>
              <button
                type="button"
                onClick={() => setOpenDropdownId(null)}
                className="w-full px-4 py-2 text-fs13 text-[#5d596c] hover:bg-[#f5f5f9] transition text-left cursor-pointer"
              >
                Edit Project
              </button>
            </div>
          </AnchoredPortal>
        ),
      },
    ],
    [
      isAllProjectsSelected,
      selectedProjectIds,
      openDropdownId,
      handleToggleSelectAllProjects,
      handleToggleSelectProject,
    ],
  );

  const user = useMemo(() => {
    const fallbackTeams: ProfileTeam[] = [
      {
        id: "team-1",
        name: "React Developer",
        membersCount: 25,
        extraMembers: 25,
        badge: "React",
        badgeColor: "primary",
        icon: "react",
        description:
          "we don't make assumptions about the rest of your technology stack,so you can develops new features in React.",
        avatarGroup: ["member1", "member2", "member3", "member4"],
        badges: [
          { label: "REACT", color: "purple" },
          { label: "MUI", color: "cyan" },
        ],
      },
      {
        id: "team-2",
        name: "Vue.js Dev Team",
        membersCount: 15,
        extraMembers: 15,
        badge: "Vuejs",
        badgeColor: "success",
        icon: "vue",
        description:
          "The development of vue and its ecosystem is guided by an international team,some of whom have chosen to be featured below.",
        avatarGroup: ["member5", "member6", "member1"],
        badges: [
          { label: "VUEJS", color: "green" },
          { label: "DEVELOPER", color: "red" },
        ],
      },
      {
        id: "team-3",
        name: "Creative Designers",
        membersCount: 55,
        extraMembers: 55,
        badge: "Sketch",
        badgeColor: "warning",
        icon: "xd",
        description:
          "A design or product team is more than just people on it.A team includes the people,the roles they Play.",
        avatarGroup: ["member2", "member3", "member4", "member8"],
        badges: [
          { label: "SKETCH", color: "orange" },
          { label: "XD", color: "red" },
        ],
      },
      {
        id: "team-4",
        name: "Support Team",
        membersCount: 35,
        extraMembers: 35,
        badge: "Zendesk",
        badgeColor: "info",
        icon: "support",
        description:
          "Support your team.Your Customer team is fielding the good,the bad,and the ugly day in and day out.",
        avatarGroup: ["member5", "member6", "member2", "member1"],
        badges: [{ label: "ZENDESK", color: "cyan" }],
      },
      {
        id: "team-5",
        name: "Digital Marketing",
        membersCount: 19,
        extraMembers: 19,
        badge: "Twitter",
        badgeColor: "primary",
        icon: "marketing",
        description:
          "Digital marketing refers to advertising delivered through digital channels such as search engines,websites...",
        avatarGroup: ["member3", "member4", "member5"],
        badges: [
          { label: "TWITTER", color: "purple" },
          { label: "EMAIL", color: "cyan" },
        ],
      },
      {
        id: "team-6",
        name: "Events",
        membersCount: 16,
        extraMembers: 16,
        badge: "Hubilo",
        badgeColor: "success",
        icon: "event",
        description:
          "Events id defined as a particular contest which is part of a program of contests.AN example of an events is the long...",
        avatarGroup: ["member1", "member2", "member3", "member4"],
        badges: [{ label: "HUBILO", color: "green" }],
      },
      {
        id: "team-7",
        name: "Figma Resources",
        membersCount: 45,
        extraMembers: 45,
        badge: "UI/UX",
        badgeColor: "success",
        icon: "figma",
        description:
          "Explore,install,use,and remix thousands of plugins and files published to the figma community by designers and developers.",
        avatarGroup: ["member5", "member6", "member8"],
        badges: [
          { label: "UI/UX", color: "green" },
          { label: "FIGMA", color: "secondary" },
        ],
      },
      {
        id: "team-8",
        name: "Only Beginners",
        membersCount: 45,
        extraMembers: 45,
        badge: "CSS",
        badgeColor: "info",
        icon: "html",
        description:
          "Learn the basics of how websites work,front-end vs back-end,and using code editor,learn basics HTML,CSS,and...",
        avatarGroup: ["member1", "member2"],
        badges: [
          { label: "CSS", color: "cyan" },
          { label: "HTML", color: "orange" },
        ],
      },
    ];

    const fallbackProjects: ProfileProject[] = [
      {
        id: "proj-1",
        name: "Social Banners",
        date: "14 Feb 2021",
        icon: "SB",
        iconBg: "#f1f1f2",
        leader: "Christian Jimenez",
        client: "Christian Jimenez",
        totalBudget: "$24.8k/$18.2k",
        startDate: "14/2/21",
        deadline: "28/2/22",
        description:
          "we are Consulting,software Development and Web Development Services.",
        allHours: "380/244",
        daysLeft: "28 DAYS LEFT",
        taskCount: "328/344",
        completedPercentage: 95,
        progress: 95,
        team: ["member1", "member2", "member3", "member4"],
        membersCountLabel: "280 members",
        commentsCount: 15,
      },
      {
        id: "proj-2",
        name: "Admin Template",
        date: "14 Feb 2021",
        icon: "AT",
        iconBg: "#dcf6f8",
        leader: "Jeffrey Philips",
        client: "Jeffrey Philips",
        totalBudget: "$24.8k/$18.2k",
        startDate: "14/2/21",
        deadline: "28/2/22",
        description:
          "we are Consulting,software Development and Web Development Services.",
        allHours: "380/244",
        daysLeft: "15 DAYS LEFT",
        taskCount: "328/344",
        completedPercentage: 42,
        progress: 42,
        team: ["member5", "member6", "member1"],
        membersCountLabel: "1.1k members",
        commentsCount: 15,
      },
      {
        id: "proj-3",
        name: "App Design",
        date: "14 Feb 2021",
        icon: "AD",
        iconBg: "#e8fadf",
        leader: "Ricky McDonald",
        client: "Ricky McDonald",
        totalBudget: "$24.8k/$18.2k",
        startDate: "14/2/21",
        deadline: "28/2/22",
        description:
          "App design combines the user interface (UI) and user experience (UX).",
        allHours: "380/244",
        daysLeft: "45 DAYS LEFT",
        taskCount: "328/344",
        completedPercentage: 68,
        progress: 68,
        team: ["member2", "member3", "member4", "member8"],
        membersCountLabel: "458 members",
        commentsCount: 98,
      },
      {
        id: "proj-4",
        name: "Create Website",
        date: "14 Feb 2021",
        icon: "CW",
        iconBg: "#fff1e3",
        leader: "Hulda Wright",
        client: "Hulda Wright",
        totalBudget: "$24.8k/$18.2k",
        startDate: "14/2/21",
        deadline: "28/2/22",
        description:
          "we are Consulting,software Development and Web Development Services.",
        allHours: "380/244",
        daysLeft: "25 DAYS LEFT",
        taskCount: "328/344",
        completedPercentage: 72,
        progress: 72,
        team: ["member1", "member2", "member5", "member6"],
        membersCountLabel: "280 members",
        commentsCount: 15,
      },
      {
        id: "proj-5",
        name: "Figma Dashboard",
        date: "14 Feb 2021",
        icon: "FD",
        iconBg: "#ffe2e3",
        leader: "Jeffrey Philips",
        client: "Jeffrey Philips",
        totalBudget: "$24.8k/$18.2k",
        startDate: "14/2/21",
        deadline: "28/2/22",
        description:
          "we are Consulting,software Development and Web Development Services.",
        allHours: "380/244",
        daysLeft: "15 DAYS LEFT",
        taskCount: "328/344",
        completedPercentage: 42,
        progress: 42,
        team: ["member3", "member4", "member1"],
        membersCountLabel: "1.1k members",
        commentsCount: 20,
      },
      {
        id: "proj-6",
        name: "Logo Design",
        date: "14 Feb 2021",
        icon: "LD",
        iconBg: "#f3e8ff",
        leader: "Olive Strickland",
        client: "Olive Strickland",
        totalBudget: "$24.8k/$18.2k",
        startDate: "14/2/21",
        deadline: "28/2/22",
        description:
          "Premium logo design created by top logo designers. Create the branding of business.",
        allHours: "380/244",
        daysLeft: "45 DAYS LEFT",
        taskCount: "328/344",
        completedPercentage: 88,
        progress: 88,
        team: ["member2", "member3", "member4", "member8"],
        membersCountLabel: "458 members",
        commentsCount: 98,
      },
    ];

    const fallback = {
      name: currentUser?.name || "John Doe",
      designation: currentUser?.role || "Administrator",
      location: "Vatican city",
      joinedDate: "Joined April 2021",
      avatar: currentUser?.avatar || currentUser?.id || "member1",
      isConnected: true,
      about: {
        fullName: currentUser?.name || "John Doe",
        status: "Active",
        role: currentUser?.role || "Administrator",
        country: "USA",
        language: "English",
      },
      contact: {
        phone: "(123) 456-7890",
        skype: "john.doe",
        email: currentUser?.email || "user1@example.com",
      },
      overview: {
        taskCompiled: "13.5k",
        connectionsCount: "897",
        projectsCompiled: "146",
      },
      sidebarTeams: [
        { name: "Backend Developer", membersCount: 126, icon: "github" },
        { name: "React Developer", membersCount: 98, icon: "react" },
      ],
      timeline: [],
      connections: [],
      teams: fallbackTeams,
      projects: fallbackProjects,
    };

    if (!profile) return fallback;

    return {
      ...profile,
      name: currentUser?.name || profile.name,
      avatar: currentUser?.avatar || currentUser?.id || profile.avatar,
      designation: currentUser?.role || profile.designation || "Administrator",
      about: {
        ...profile.about,
        fullName: currentUser?.name || profile.about?.fullName,
        role: currentUser?.role || profile.about?.role,
      },
      contact: {
        ...profile.contact,
        email: currentUser?.email || profile.contact?.email,
      },
      teams:
        profile.teams && profile.teams.length > 0
          ? profile.teams
          : fallbackTeams,
      projects:
        profile.projects && profile.projects.length > 0
          ? profile.projects
          : fallbackProjects,
    };
  }, [profile, currentUser]);

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex flex-col space-y-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg" />
        <div className="h-12 bg-gray-200 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-gray-200 rounded-lg" />
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col min-w-0 space-y-6">
      {/* 1. PROFILE HEADER CARD */}
      <div className="bg-white rounded-lg shadow-sm border border-[#dbdade]/60 overflow-hidden">
        {/* Banner with profile-bg image */}
        <div className="profile-bg-container  sm:h-60 relative overflow-hidden">
          <CustomImage
            src={profileBg}
            alt="Profile Background"
            objectFit="cover"
            className="w-full h-full"
            containerClassName="w-full h-[210px]"
          />
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 sm:px-8 pb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14 sm:-mt-16">
            {/* Avatar overlapping banner */}
            <div className="w-28 h-28 rounded-lg border-4 border-white shadow-md overflow-hidden bg-white shrink-0 z-10">
              <CustomImage
                src={getMemberAvatar(user.avatar)}
                alt={user.name}
                objectFit="cover"
                className="w-full h-full"
                containerClassName="w-full h-full"
              />
            </div>

            {/* Name and Basic Meta */}
            <div className="space-y-1 pt-1 sm:pt-0 sm:pb-1">
              <h1 className="text-[22px] font-bold text-[#5d596c] leading-tight">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-fs14 text-[#6f6b7d]">
                {/* Designation */}
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-[#a5a3ae]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <span>{user.designation}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-[#a5a3ae]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{user.location}</span>
                </div>

                {/* Joined Date */}
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-[#a5a3ae]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{user.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Button */}
          <div className="self-end sm:self-auto sm:pb-1">
            <CustomButton
              type="button"
              variant="primary"
              size="sm"
              className="!bg-[#7367F0] hover:!bg-[#685dd8] text-white font-medium text-xs tracking-wider uppercase px-4 !h-[30px] rounded-md shadow-sm flex items-center gap-2"
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
                  strokeWidth={2}
                  d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                />
                <circle cx="8.5" cy="7" r="4" strokeWidth={2} />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 11l2 2 4-4"
                />
              </svg>
              <span>CONNECTED</span>
            </CustomButton>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => handleTabChange("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-xs tracking-wider uppercase transition cursor-pointer select-none ${
            activeTab === "profile"
              ? "bg-[#7367F0] text-white shadow-sm"
              : "text-[#6f6b7d] hover:bg-[#f5f5f9] hover:text-[#5d596c] bg-transparent"
          }`}
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
              strokeWidth={1.75}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>PROFILE</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("teams")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-xs tracking-wider uppercase transition cursor-pointer select-none ${
            activeTab === "teams"
              ? "bg-[#7367F0] text-white shadow-sm"
              : "text-[#6f6b7d] hover:bg-[#f5f5f9] hover:text-[#5d596c] bg-transparent"
          }`}
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
              strokeWidth={1.75}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>TEAMS</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("projects")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-xs tracking-wider uppercase transition cursor-pointer select-none ${
            activeTab === "projects"
              ? "bg-[#7367F0] text-white shadow-sm"
              : "text-[#6f6b7d] hover:bg-[#f5f5f9] hover:text-[#5d596c] bg-transparent"
          }`}
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
              strokeWidth={1.75}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <span>PROJECTS</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("connections")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-xs tracking-wider uppercase transition cursor-pointer select-none ${
            activeTab === "connections"
              ? "bg-[#7367F0] text-white shadow-sm"
              : "text-[#6f6b7d] hover:bg-[#f5f5f9] hover:text-[#5d596c] bg-transparent"
          }`}
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
              strokeWidth={1.75}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <span>CONNECTIONS</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* 3.1 PROFILE TAB CONTENT (TWO ROWS + PROJECTS UNDER CONNECTIONS & TEAMS) */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* ROW 1 - LEFT: About Card */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-white rounded-lg shadow-sm border border-[#dbdade]/60 p-5 space-y-5 h-full flex flex-col justify-between">
              {/* About Section */}
              <div>
                <h3 className="text-xs font-semibold text-[#a5a3ae] uppercase tracking-wider mb-3">
                  ABOUT
                </h3>
                <ul className="space-y-3 text-fs14">
                  <li className="flex items-center gap-2.5">
                    <svg
                      className="w-4 h-4 text-[#6f6b7d] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-semibold text-[#5d596c]">
                      Full Name:
                    </span>
                    <span className="text-[#6f6b7d]">
                      {user.about?.fullName}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg
                      className="w-4 h-4 text-[#6f6b7d] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-semibold text-[#5d596c]">
                      Status:
                    </span>
                    <span className="text-[#6f6b7d]">{user.about?.status}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg
                      className="w-4 h-4 text-[#6f6b7d] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    <span className="font-semibold text-[#5d596c]">Role:</span>
                    <span className="text-[#6f6b7d]">{user.about?.role}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg
                      className="w-4 h-4 text-[#6f6b7d] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                      />
                    </svg>
                    <span className="font-semibold text-[#5d596c]">
                      Country:
                    </span>
                    <span className="text-[#6f6b7d]">
                      {user.about?.country}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg
                      className="w-4 h-4 text-[#6f6b7d] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                    <span className="font-semibold text-[#5d596c]">
                      Language:
                    </span>
                    <span className="text-[#6f6b7d]">
                      {user.about?.language}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Contact Section */}
              <div className="pt-2 border-t border-[#dbdade]/50">
                <h3 className="text-xs font-semibold text-[#a5a3ae] uppercase tracking-wider mb-3">
                  CONTACT
                </h3>
                <ul className="space-y-3 text-fs14">
                  <li className="flex items-center gap-2.5">
                    <svg
                      className="w-4 h-4 text-[#6f6b7d] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="font-semibold text-[#5d596c]">
                      Contact:
                    </span>
                    <span className="text-[#6f6b7d]">
                      {user.contact?.phone}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg
                      className="w-4 h-4 text-[#6f6b7d] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="font-semibold text-[#5d596c]">Skype:</span>
                    <span className="text-[#6f6b7d]">
                      {user.contact?.skype}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg
                      className="w-4 h-4 text-[#6f6b7d] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-semibold text-[#5d596c]">Email:</span>
                    <span className="text-[#6f6b7d] truncate">
                      {user.contact?.email}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Teams Section in Sidebar */}
              <div className="pt-2 border-t border-[#dbdade]/50">
                <h3 className="text-xs font-semibold text-[#a5a3ae] uppercase tracking-wider mb-3">
                  TEAMS
                </h3>
                <ul className="space-y-3 text-fs14">
                  {(user.sidebarTeams || []).map((t, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#f5f5f9] flex items-center justify-center shrink-0 text-[#7367F0]">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                      </div>
                      <span className="font-semibold text-[#5d596c]">
                        {t.name}:
                      </span>
                      <span className="text-[#a5a3ae]">
                        ({t.membersCount} Members)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ROW 1 - RIGHT: Activity Timeline Card */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="bg-white rounded-lg shadow-sm border border-[#dbdade]/60 p-5 md:p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-fs16 font-semibold text-[#5d596c]">
                  Activity Timeline
                </h3>
                <button
                  type="button"
                  className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-1"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>

              {/* Timeline Items */}
              <div className="relative">
                {/* Timeline Event 1 */}
                <div className="relative pl-7 pb-6">
                  <span className="absolute left-1.5 top-3 bottom-0 w-[2px] bg-[#dbdade]/70 -translate-x-1/2" />
                  <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#ffab00] border-2 border-white shadow-xs -translate-x-1/2 z-10" />
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-fs14 font-semibold text-[#5d596c]">
                      Client Meeting
                    </h4>
                    <span className="text-fs12 text-[#a5a3ae]">Today</span>
                  </div>
                  <p className="text-fs13 text-[#6f6b7d] mt-1">
                    Project meeting with John @10:15 am
                  </p>
                  {/* Embedded Client Card */}
                  <div className="mt-3 p-3 bg-[#fafafb] rounded-lg border border-[#dbdade]/50 flex items-center gap-3 w-full sm:w-auto">
                    <CustomImage
                      src={getMemberAvatar("member2")}
                      alt="Lester McCarthy"
                      objectFit="cover"
                      className="w-10 h-10 rounded-full"
                      containerClassName="w-10 h-10 shrink-0"
                    />
                    <div>
                      <span className="block text-fs14 font-semibold text-[#5d596c]">
                        Lester McCarthy (Client)
                      </span>
                      <span className="block text-fs12 text-[#a5a3ae]">
                        CEO of Infibeam
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline Event 2 */}
                <div className="relative pl-7 pb-6">
                  <span className="absolute left-1.5 top-0 bottom-0 w-[2px] bg-[#dbdade]/70 -translate-x-1/2" />
                  <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#00cfe8] border-2 border-white shadow-xs -translate-x-1/2 z-10" />
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-fs14 font-semibold text-[#5d596c]">
                      Create a new Project for client
                    </h4>
                    <span className="text-fs12 text-[#a5a3ae]">2 Days Ago</span>
                  </div>
                  <p className="text-fs13 text-[#6f6b7d] mt-1">
                    Add files to new design folder
                  </p>
                </div>

                {/* Timeline Event 3 */}
                <div className="relative pl-7 pb-6">
                  <span className="absolute left-1.5 top-0 bottom-0 w-[2px] bg-[#dbdade]/70 -translate-x-1/2" />
                  <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#7367F0] border-2 border-white shadow-xs -translate-x-1/2 z-10" />
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-fs14 font-semibold text-[#5d596c]">
                      Shared 2 New Project files
                    </h4>
                    <span className="text-fs12 text-[#a5a3ae]">6 days ago</span>
                  </div>
                  <p className="text-fs13 text-[#6f6b7d] mt-1">
                    Sent by Malic Dixon 👏
                  </p>
                  {/* File Attachments */}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#fafafb] border border-[#dbdade]/60 text-fs13 text-[#5d596c]">
                      <svg
                        className="w-4 h-4 text-[#ea5455]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">App Guidelines</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#fafafb] border border-[#dbdade]/60 text-fs13 text-[#5d596c]">
                      <svg
                        className="w-4 h-4 text-[#28c76f]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Testing Results</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Event 4 */}
                <div className="relative pl-7">
                  <span className="absolute left-1.5 top-0 h-3 w-[2px] bg-[#dbdade]/70 -translate-x-1/2" />
                  <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#28c76f] border-2 border-white shadow-xs -translate-x-1/2 z-10" />
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-fs14 font-semibold text-[#5d596c]">
                      Project status updated
                    </h4>
                    <span className="text-fs12 text-[#a5a3ae]">
                      10 days ago
                    </span>
                  </div>
                  <p className="text-fs13 text-[#6f6b7d] mt-1">
                    woocommerce iOS App Completed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2 - LEFT: Overview / Stats Card */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-white rounded-lg shadow-sm border border-[#dbdade]/60 p-5 space-y-4">
              <h3 className="text-xs font-semibold text-[#a5a3ae] uppercase tracking-wider">
                OVERVIEW
              </h3>
              <ul className="space-y-3.5 text-fs14">
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#e8fadf] text-[#28c76f] flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold text-[#5d596c]">
                    Task Compiled:
                  </span>
                  <span className="text-[#6f6b7d] font-semibold">
                    {user.overview?.taskCompiled}
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#e8e7fd] text-[#7367f0] flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold text-[#5d596c]">
                    Connections:
                  </span>
                  <span className="text-[#6f6b7d] font-semibold">
                    {user.overview?.connectionsCount}
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#dcf6f8] text-[#00cfe8] flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold text-[#5d596c]">
                    Projects Compiled:
                  </span>
                  <span className="text-[#6f6b7d] font-semibold">
                    {user.overview?.projectsCompiled}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* ROW 2 - RIGHT: Connections Card & Teams Card */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-stretch">
              {/* Connections Card */}
              <div className="bg-white rounded-lg shadow-sm border border-[#dbdade]/60 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-fs16 font-semibold text-[#5d596c]">
                      Connections
                    </h3>
                    <button
                      type="button"
                      className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(user.connections || []).slice(0, 5).map((conn) => (
                      <div
                        key={conn.id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <CustomImage
                            src={getMemberAvatar(conn.avatar)}
                            alt={conn.name}
                            objectFit="cover"
                            className="w-10 h-10 rounded-full"
                            containerClassName="w-10 h-10 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="block font-semibold text-fs14 text-[#5d596c] truncate">
                              {conn.name}
                            </span>
                            <span className="block text-fs12 text-[#a5a3ae]">
                              {conn.connectionsCount}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleConnection(conn.id)}
                          className={`w-9 h-9 rounded-md flex items-center justify-center transition cursor-pointer shrink-0 ${
                            conn.isConnected
                              ? "bg-[#7367F0] text-white hover:bg-[#685dd8]"
                              : "border border-[#dbdade] text-[#a5a3ae] hover:text-[#7367F0] hover:border-[#7367F0] bg-transparent"
                          }`}
                          title={conn.isConnected ? "Connected" : "Connect"}
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
                              strokeWidth={1.75}
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 text-center border-t border-[#dbdade]/50 mt-4">
                  <button
                    type="button"
                    onClick={() => handleTabChange("connections")}
                    className="text-fs14 font-medium text-[#7367F0] hover:underline cursor-pointer"
                  >
                    View all connections
                  </button>
                </div>
              </div>

              {/* Teams Card */}
              <div className="bg-white rounded-lg shadow-sm border border-[#dbdade]/60 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-fs16 font-semibold text-[#5d596c]">
                      Teams
                    </h3>
                    <button
                      type="button"
                      className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(user.teams || []).slice(0, 5).map((t) => {
                      let badgeClass = "bg-[#f5f5f9] text-[#8592a3]";
                      if (t.badge.toLowerCase().includes("developer")) {
                        badgeClass = "bg-[#ffe0db] text-[#ff4c51]";
                      } else if (t.badge.toLowerCase().includes("support")) {
                        badgeClass = "bg-[#ebe7fe] text-[#7367f0]";
                      } else if (t.badge.toLowerCase().includes("designer")) {
                        badgeClass = "bg-[#d7f5fc] text-[#00bad1]";
                      } else if (t.badge.toLowerCase().includes("marketing")) {
                        badgeClass = "bg-[#f5f5f9] text-[#8592a3]";
                      }

                      return (
                        <div
                          key={t.id}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-[#f5f5f9] flex items-center justify-center shrink-0 text-[#7367F0] font-bold text-xs">
                              {t.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="block font-semibold text-fs14 text-[#5d596c] truncate">
                                {t.name}
                              </span>
                              <span className="block text-fs12 text-[#a5a3ae]">
                                {t.membersCount} Members
                              </span>
                            </div>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded text-fs11 font-bold tracking-wider uppercase shrink-0 ${badgeClass}`}
                          >
                            {t.badge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 text-center border-t border-[#dbdade]/50 mt-4">
                  <button
                    type="button"
                    onClick={() => handleTabChange("teams")}
                    className="text-fs14 font-medium text-[#7367F0] hover:underline cursor-pointer"
                  >
                    View all teams
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3: Projects Table Card (positioned under Connections & Teams in cols 5-12) */}
          <div className="col-span-1 lg:col-start-5 lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-[#dbdade]/60 overflow-hidden">
              <div className="p-4 md:p-6 pb-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <h3 className="text-fs16 font-semibold text-[#5d596c]">
                  Projects
                </h3>

                <div className="w-full sm:w-60">
                  <CustomInput
                    type="text"
                    placeholder="Search User"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    sizeVariant="sm"
                    className="!h-[38px] text-fs14 placeholder:text-[#a5a3ae]"
                  />
                </div>
              </div>

              <CustomTable<ProfileProject>
                columns={projectColumns}
                data={filteredProjects}
                keyExtractor={(p) => p.id}
                className="w-full overflow-x-auto"
                tableClassName="w-full text-left border-collapse"
                headerRowClassName="bg-white border-y border-[#dbdade]/60 text-[11px] font-semibold text-[#5d596c] uppercase tracking-wider"
                bodyClassName="divide-y divide-[#dbdade]/40"
                bodyRowClassName="hover:bg-[#fafafb]/70 transition"
                emptyText="No projects found."
              />
            </div>
          </div>
        </div>
      )}

      {/* 3.2 TEAMS TAB CONTENT (FULL GRID VIEW) */}
      {activeTab === "teams" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(user.teams || []).map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-lg shadow-sm border border-[#dbdade]/60 p-5 flex flex-col justify-between space-y-3.5 hover:shadow-md transition"
            >
              {/* Header: Icon + Title on left, Star + 3-dots on right */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {renderTeamIcon(t)}
                  <h4 className="text-fs15 font-semibold text-[#5d596c] truncate">
                    {t.name}
                  </h4>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleStarTeam(t.id)}
                    className="p-1 text-[#a5a3ae] hover:text-[#ffab00] transition cursor-pointer"
                    title="Star team"
                  >
                    <svg
                      className="w-4 h-4"
                      fill={starredTeamIds.includes(t.id) ? "#ffab00" : "none"}
                      stroke={
                        starredTeamIds.includes(t.id)
                          ? "#ffab00"
                          : "currentColor"
                      }
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="p-1 text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer"
                    title="More options"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-fs13 text-[#6f6b7d] leading-relaxed line-clamp-2">
                {t.description}
              </p>

              {/* Footer: Avatars + Extra count on left, Badges on right */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center">
                  <div className="flex items-center -space-x-1.5">
                    {(t.avatarGroup || ["member1", "member2", "member3"]).map(
                      (av, idx) => (
                        <CustomImage
                          key={idx}
                          src={getMemberAvatar(av)}
                          alt="Avatar"
                          objectFit="cover"
                          className="w-6 h-6 rounded-full border border-white"
                          containerClassName="w-6 h-6 shrink-0"
                        />
                      ),
                    )}
                  </div>
                  {(t.extraMembers || t.membersCount) && (
                    <span className="text-fs12 text-[#a5a3ae] font-medium ml-1.5">
                      +{t.extraMembers || t.membersCount}
                    </span>
                  )}
                </div>

                {/* Badges / Chips */}
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {(
                    t.badges || [
                      { label: t.badge || "DEVELOPER", color: t.badgeColor },
                    ]
                  ).map((badge, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide ${getTeamBadgeStyles(badge.label)}`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3.3 PROJECTS TAB CONTENT (FULL GRID VIEW MATCHING ATTACHED SCREENSHOT) */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(user.projects || []).map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-lg shadow-sm border border-[#dbdade]/60 p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              {/* 1. Header: Icon + Title + Client on left, 3-dots on right */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  {renderProjectCardIcon(proj)}
                  <div className="min-w-0">
                    <h4 className="text-fs15 font-semibold text-[#5d596c] hover:text-[#7367F0] transition cursor-pointer truncate">
                      {proj.name}
                    </h4>
                    <p className="text-fs12 text-[#a5a3ae] truncate">
                      <span className="font-normal text-[#6f6b7d]">
                        Client:
                      </span>{" "}
                      {proj.client || proj.leader}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="p-1 text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer shrink-0"
                  title="More options"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>

              {/* 2. Budget & Dates Box */}
              <div className="flex items-center justify-between gap-3 text-fs12">
                {/* Left: Total Budget Pill */}
                <div className="bg-[#f8f7fa] px-3 py-1.5 rounded-md min-w-[120px]">
                  <div className="font-semibold text-fs13 text-[#5d596c]">
                    {proj.totalBudget || "$24.8k/$18.2k"}
                  </div>
                  <div className="text-[10px] font-semibold text-[#a5a3ae] uppercase tracking-wider">
                    Total Budget
                  </div>
                </div>

                {/* Right: Start Date & Deadline */}
                <div className="space-y-0.5 text-right sm:text-left">
                  <div>
                    <span className="text-[#a5a3ae]">Start Date: </span>
                    <span className="font-medium text-[#6f6b7d]">
                      {proj.startDate || "14/2/21"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#a5a3ae]">Deadline: </span>
                    <span className="font-medium text-[#6f6b7d]">
                      {proj.deadline || "28/2/22"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Description */}
              <p className="text-fs13 text-[#6f6b7d] leading-relaxed line-clamp-2">
                {proj.description ||
                  "we are Consulting,software Development and Web Development Services."}
              </p>

              {/* 4. Stats & Progress */}
              <div className="pt-2 border-t border-[#dbdade]/50 space-y-2">
                {/* All Hours & Days Left Badge */}
                <div className="flex items-center justify-between text-fs12">
                  <span className="text-[#6f6b7d]">
                    <span className="font-semibold text-[#5d596c]">
                      All Hours:
                    </span>{" "}
                    {proj.allHours || "380/244"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${getDaysLeftBadgeStyles(
                      proj.daysLeft || "28 DAYS LEFT",
                    )}`}
                  >
                    {proj.daysLeft || "28 DAYS LEFT"}
                  </span>
                </div>

                {/* Task Count & Percentage Completed */}
                <div className="flex items-center justify-between text-fs12 text-[#a5a3ae]">
                  <span>Task: {proj.taskCount || "328/344"}</span>
                  <span className="font-medium text-[#5d596c]">
                    {proj.completedPercentage ?? proj.progress}% Completed
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#ecebfd] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#7367F0] h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${proj.completedPercentage ?? proj.progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* 5. Footer: Avatars + Members count on left, Chat comments on right */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <div className="flex items-center -space-x-1.5">
                    {(
                      proj.team || ["member1", "member2", "member3", "member4"]
                    ).map((m, idx) => (
                      <CustomImage
                        key={idx}
                        src={getMemberAvatar(m)}
                        alt="Member"
                        objectFit="cover"
                        className="w-6 h-6 rounded-full border border-white"
                        containerClassName="w-6 h-6 shrink-0"
                      />
                    ))}
                  </div>
                  <span className="text-fs12 text-[#a5a3ae] ml-2">
                    {proj.membersCountLabel || "280 members"}
                  </span>
                </div>

                {/* Comments Icon + Count */}
                <div className="flex items-center gap-1.5 text-fs12 text-[#a5a3ae]">
                  <svg
                    className="w-4 h-4 text-[#a5a3ae]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>{proj.commentsCount || 15}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3.4 CONNECTIONS TAB CONTENT (FULL GRID VIEW) */}
      {activeTab === "connections" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(user.connections || []).map((conn) => (
            <div
              key={conn.id}
              className="bg-white rounded-lg shadow-sm border border-[#dbdade]/60 p-6 flex flex-col items-center text-center space-y-3 hover:shadow-md transition"
            >
              <CustomImage
                src={getMemberAvatar(conn.avatar)}
                alt={conn.name}
                objectFit="cover"
                className="w-20 h-20 rounded-full border-2 border-[#dbdade]/50"
                containerClassName="w-20 h-20 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-fs15 text-[#5d596c] truncate">
                  {conn.name}
                </h4>
                <p className="text-fs13 text-[#a5a3ae]">
                  {conn.department || "Design & Tech"}
                </p>
              </div>

              <div className="flex items-center gap-4 text-fs13 text-[#6f6b7d] py-1">
                <div>
                  <span className="font-bold text-[#5d596c]">
                    {conn.projectsCount || 18}
                  </span>{" "}
                  <span className="text-[#a5a3ae]">Projects</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#dbdade]" />
                <div>
                  <span className="font-bold text-[#5d596c]">
                    {conn.connectionsCount.split(" ")[0]}
                  </span>{" "}
                  <span className="text-[#a5a3ae]">Tasks</span>
                </div>
              </div>

              <CustomButton
                type="button"
                variant={conn.isConnected ? "primary" : "outline"}
                size="sm"
                onClick={() => handleToggleConnection(conn.id)}
                className={`w-full mt-2 font-medium text-xs tracking-wider uppercase !h-[36px] rounded-md ${
                  conn.isConnected
                    ? "!bg-[#7367F0] hover:!bg-[#685dd8] text-white"
                    : "border border-[#dbdade] text-[#6f6b7d] hover:border-[#7367F0] hover:text-[#7367F0]"
                }`}
              >
                {conn.isConnected ? "CONNECTED" : "CONNECT"}
              </CustomButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
