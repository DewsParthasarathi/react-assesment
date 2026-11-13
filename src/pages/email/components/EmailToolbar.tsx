import React, { useState } from "react";
import type { EmailFolder, EmailLabel } from "../../../api/types";
import { AnchoredPortal } from "../../../components/ui/FloatingPortal";
import { CustomButton } from "../../../components/ui/CustomButton";

interface EmailToolbarProps {
  totalCount: number;
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  onMarkAsReadSelected: () => void;
  onMarkAsUnreadSelected: () => void;
  onMoveToFolder: (folder: "inbox" | "sent" | "draft" | "spam" | "trash") => void;
  onToggleLabel: (label: EmailLabel) => void;
  onRefresh: () => void;
  currentFolder: EmailFolder;
}

export const EmailToolbar: React.FC<EmailToolbarProps> = ({
  totalCount,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  onMarkAsReadSelected,
  onMarkAsUnreadSelected,
  onMoveToFolder,
  onToggleLabel,
  onRefresh,
  currentFolder,
}) => {
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalCount;
  const hasSelection = selectedCount > 0;

  const handleMasterCheckboxClick = () => {
    if (isAllSelected || isPartiallySelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  return (
    <div className="px-5 py-2.5 border-b border-[#dbdade]/50 flex items-center justify-between bg-white relative select-none">
      <div className="flex items-center gap-3">
        <CustomButton
          type="button"
          variant="ghost"
          onClick={handleMasterCheckboxClick}
          aria-label={isAllSelected ? "Deselect all" : "Select all"}
          className="!p-0 !h-auto cursor-pointer focus:outline-hidden"
        >
          {isAllSelected ? (
            <div className="w-5 h-5 rounded-[4px] bg-[#696cff] border border-[#696cff] flex items-center justify-center text-white">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : isPartiallySelected ? (
            <div className="w-5 h-5 rounded-[4px] bg-[#696cff] border border-[#696cff] flex items-center justify-center text-white">
              <span className="w-2.5 h-0.5 bg-white rounded-full" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-[4px] border-2 border-[#dbdade] hover:border-[#696cff] transition bg-white" />
          )}
        </CustomButton>

        <div className="flex items-center gap-1 ml-1 text-[#6f6b7d]">
          <CustomButton
            type="button"
            variant="ghost"
            disabled={!hasSelection}
            onClick={onDeleteSelected}
            title={currentFolder === "trash" ? "Delete Permanently" : "Move to Trash"}
            className="!p-1.5 !h-auto rounded-[4px] hover:bg-[#f8f7fa] hover:text-[#ea5455] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#6f6b7d] transition cursor-pointer"
          >
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </CustomButton>

          <CustomButton
            type="button"
            variant="ghost"
            disabled={!hasSelection}
            onClick={onMarkAsUnreadSelected}
            title="Mark as unread"
            className="!p-1.5 !h-auto rounded-[4px] hover:bg-[#f8f7fa] hover:text-[#5d596c] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#6f6b7d] transition cursor-pointer"
          >
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </CustomButton>

          <AnchoredPortal
            isOpen={showFolderMenu}
            onClose={() => setShowFolderMenu(false)}
            align="left"
            offset={4}
            trigger={
              <CustomButton
                type="button"
                variant="ghost"
                disabled={!hasSelection}
                onClick={() => {
                  setShowFolderMenu((prev) => !prev);
                  setShowLabelMenu(false);
                  setShowMoreMenu(false);
                }}
                title="Move to Folder"
                className="!p-1.5 !h-auto rounded-[4px] hover:bg-[#f8f7fa] hover:text-[#5d596c] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#6f6b7d] transition cursor-pointer"
              >
                <svg
                  className="w-4.5 h-4.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                  />
                </svg>
              </CustomButton>
            }
          >
            <div className="w-44 bg-white rounded-[6px] shadow-[0_4px_16px_rgba(47,43,61,0.14)] border border-[#dbdade]/50 py-1.5">
              <div className="px-3 py-1 text-fs12 font-semibold text-[#a5a3ae] uppercase">
                Move to
              </div>
              {currentFolder !== "inbox" && (
                <CustomButton
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onMoveToFolder("inbox");
                    setShowFolderMenu(false);
                  }}
                  className="w-full justify-start !h-auto !px-3 !py-1.5 text-left text-fs14 text-[#6f6b7d] hover:bg-[#f8f7fa] hover:text-[#696cff] transition cursor-pointer rounded-none font-normal"
                >
                  Inbox
                </CustomButton>
              )}
              {currentFolder !== "spam" && (
                <CustomButton
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onMoveToFolder("spam");
                    setShowFolderMenu(false);
                  }}
                  className="w-full justify-start !h-auto !px-3 !py-1.5 text-left text-fs14 text-[#6f6b7d] hover:bg-[#f8f7fa] hover:text-[#ea5455] transition cursor-pointer rounded-none font-normal"
                >
                  Spam
                </CustomButton>
              )}
              {currentFolder !== "trash" && (
                <CustomButton
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onMoveToFolder("trash");
                    setShowFolderMenu(false);
                  }}
                  className="w-full justify-start !h-auto !px-3 !py-1.5 text-left text-fs14 text-[#6f6b7d] hover:bg-[#f8f7fa] hover:text-[#ea5455] transition cursor-pointer rounded-none font-normal"
                >
                  Trash
                </CustomButton>
              )}
            </div>
          </AnchoredPortal>

          <AnchoredPortal
            isOpen={showLabelMenu}
            onClose={() => setShowLabelMenu(false)}
            align="left"
            offset={4}
            trigger={
              <CustomButton
                type="button"
                variant="ghost"
                disabled={!hasSelection}
                onClick={() => {
                  setShowLabelMenu((prev) => !prev);
                  setShowFolderMenu(false);
                  setShowMoreMenu(false);
                }}
                title="Apply Label"
                className="!p-1.5 !h-auto rounded-[4px] hover:bg-[#f8f7fa] hover:text-[#5d596c] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#6f6b7d] transition cursor-pointer"
              >
                <svg
                  className="w-4.5 h-4.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </CustomButton>
            }
          >
            <div className="w-44 bg-white rounded-[6px] shadow-[0_4px_16px_rgba(47,43,61,0.14)] border border-[#dbdade]/50 py-1.5">
              <div className="px-3 py-1 text-fs12 font-semibold text-[#a5a3ae] uppercase">
                Labels
              </div>
              {[
                { id: "personal" as EmailLabel, name: "Personal", color: "bg-[#71dd37]" },
                { id: "company" as EmailLabel, name: "Company", color: "bg-[#696cff]" },
                { id: "important" as EmailLabel, name: "important", color: "bg-[#ffab00]" },
                { id: "private" as EmailLabel, name: "Private", color: "bg-[#ea5455]" },
              ].map((lbl) => (
                <CustomButton
                  key={lbl.id}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onToggleLabel(lbl.id);
                    setShowLabelMenu(false);
                  }}
                  className="w-full justify-start !h-auto flex items-center gap-2.5 !px-3 !py-1.5 text-fs14 text-[#6f6b7d] hover:bg-[#f8f7fa] hover:text-[#32475c] transition cursor-pointer text-left rounded-none font-normal"
                >
                  <span className={`w-2 h-2 rounded-full ${lbl.color}`} />
                  <span>{lbl.name}</span>
                </CustomButton>
              ))}
            </div>
          </AnchoredPortal>
        </div>
      </div>

      <div className="flex items-center gap-1 text-[#a5a3ae]">
        <CustomButton
          type="button"
          variant="ghost"
          onClick={onRefresh}
          title="Refresh"
          className="!p-1.5 !h-auto rounded-[4px] hover:bg-[#f8f7fa] hover:text-[#5d596c] transition cursor-pointer"
        >
          <svg
            className="w-4.5 h-4.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </CustomButton>

        <AnchoredPortal
          isOpen={showMoreMenu}
          onClose={() => setShowMoreMenu(false)}
          align="right"
          offset={4}
          trigger={
            <CustomButton
              type="button"
              variant="ghost"
              onClick={() => {
                setShowMoreMenu((prev) => !prev);
                setShowFolderMenu(false);
                setShowLabelMenu(false);
              }}
              title="More Options"
              className="!p-1.5 !h-auto rounded-[4px] hover:bg-[#f8f7fa] hover:text-[#5d596c] transition cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </CustomButton>
          }
        >
          <div className="w-44 bg-white rounded-[6px] shadow-[0_4px_16px_rgba(47,43,61,0.14)] border border-[#dbdade]/50 py-1.5">
            <CustomButton
              type="button"
              variant="ghost"
              onClick={() => {
                onMarkAsReadSelected();
                setShowMoreMenu(false);
              }}
              disabled={!hasSelection}
              className="w-full justify-start !h-auto !px-3 !py-1.5 text-left text-fs14 text-[#6f6b7d] hover:bg-[#f8f7fa] hover:text-[#32475c] disabled:opacity-40 transition cursor-pointer rounded-none font-normal"
            >
              Mark as read
            </CustomButton>
            <CustomButton
              type="button"
              variant="ghost"
              onClick={() => {
                onMarkAsUnreadSelected();
                setShowMoreMenu(false);
              }}
              disabled={!hasSelection}
              className="w-full justify-start !h-auto !px-3 !py-1.5 text-left text-fs14 text-[#6f6b7d] hover:bg-[#f8f7fa] hover:text-[#32475c] disabled:opacity-40 transition cursor-pointer rounded-none font-normal"
            >
              Mark as unread
            </CustomButton>
          </div>
        </AnchoredPortal>
      </div>
    </div>
  );
};

export default EmailToolbar;
