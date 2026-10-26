import React, { useState } from "react";

export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Label to display on the tab button */
  label: React.ReactNode;
  /** Optional content to render when this tab is active */
  content?: React.ReactNode;
  /** Optional icon to display before the label */
  icon?: React.ReactNode;
  /** Optional badge to display next to the label */
  badge?: React.ReactNode;
  /** Whether this tab is disabled */
  disabled?: boolean;
}

export interface TabsProps {
  /** Array of tab configuration items */
  tabs: TabItem[];
  /** Controlled active tab ID */
  activeTab?: string;
  /** Default active tab ID for uncontrolled usage */
  defaultTab?: string;
  /** Callback invoked when the active tab changes */
  onChange?: (tabId: string) => void;
  /** Overall container className */
  className?: string;
  /** Tab list container className */
  tabListClassName?: string;
  /** Base className applied to every tab button */
  tabButtonClassName?: string;
  /** ClassName applied to the active tab button */
  activeTabClassName?: string;
  /** ClassName applied to inactive tab buttons */
  inactiveTabClassName?: string;
  /** ClassName for the content container */
  contentClassName?: string;
  /** Whether to render active tab content directly (defaults to true) */
  renderContent?: boolean;
  /** Additional children rendered after tab list / content */
  children?: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab: controlledActiveTab,
  defaultTab,
  onChange,
  className = "",
  tabListClassName = "flex items-center gap-1.5 p-1 bg-[#f8f7fa] rounded-lg w-fit",
  tabButtonClassName = "px-3 py-1.5 rounded-md text-fs12 font-semibold transition cursor-pointer flex items-center gap-2 select-none",
  activeTabClassName = "bg-[#696cff] text-white shadow-xs",
  inactiveTabClassName = "text-[#6f6b7d] hover:text-[#32475c]",
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
      {/* Tab Buttons Navigation */}
      <div className={tabListClassName} role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === currentTabId;
          const statusClass = isActive
            ? activeTabClassName
            : inactiveTabClassName;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab)}
              className={`${tabButtonClassName} ${statusClass} ${
                tab.disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span>{tab.badge}</span>}
            </button>
          );
        })}
      </div>

      {/* Render Active Tab Content if enabled and provided */}
      {renderContent && activeTabItem?.content && (
        <div className={contentClassName} role="tabpanel">
          {activeTabItem.content}
        </div>
      )}

      {/* Render optional children */}
      {children}
    </div>
  );
};

export const CustomTabs = Tabs;
export default Tabs;
