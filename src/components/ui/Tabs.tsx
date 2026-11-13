import React, { useState } from "react";
import { CustomButton } from "./CustomButton";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  tabListClassName?: string;
  tabButtonClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  contentClassName?: string;
  renderContent?: boolean;
  children?: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab: controlledActiveTab,
  defaultTab,
  onChange,
  className = "",
  tabListClassName = "flex items-center gap-1.5 p-1 bg-[#f8f7fa] rounded-lg w-fit",
  tabButtonClassName = "!px-3.5 !py-1.5 rounded-md text-fs13 font-semibold transition cursor-pointer flex items-center gap-2 select-none",
  activeTabClassName = "!bg-[#696cff] !text-white shadow-[0_2px_4px_rgba(105,108,255,0.4)]",
  inactiveTabClassName = "!bg-transparent !text-[#6f6b7d] hover:!text-[#32475c] hover:!bg-[#ecebfd]/50",
  contentClassName = "mt-5",
  renderContent = true,
  children,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    defaultTab || tabs[0]?.id || "",
  );

  const isControlled = controlledActiveTab !== undefined;
  const currentTabId = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tab: TabItem) => {
    if (tab.disabled) return;
    if (!isControlled) {
      setInternalActiveTab(tab.id);
    }
    onChange?.(tab.id);
  };

  const activeTabItem = tabs.find((t) => t.id === currentTabId) || tabs[0];

  return (
    <div className={className}>
      <div className={tabListClassName} role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === currentTabId;
          const statusClass = isActive
            ? activeTabClassName
            : inactiveTabClassName;

          return (
            <CustomButton
              key={tab.id}
              type="button"
              role="tab"
              variant={isActive ? "primary" : "ghost"}
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab)}
              className={`!h-auto ${tabButtonClassName} ${statusClass} ${
                tab.disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span>{tab.badge}</span>}
            </CustomButton>
          );
        })}
      </div>

      {renderContent && activeTabItem?.content && (
        <div className={contentClassName} role="tabpanel">
          {activeTabItem.content}
        </div>
      )}

      {children}
    </div>
  );
};

export const CustomTabs = Tabs;
export default Tabs;
