import React, { useState } from "react";
import type {
  EmailComposePayload,
  EmailFolder,
  EmailItem,
  EmailLabel,
} from "../../api/types";
import {
  useBatchDeleteEmailsMutation,
  useBatchUpdateEmailsMutation,
  useCreateEmailMutation,
  useDeleteEmailMutation,
  useEmailsQuery,
  useEmptyTrashMutation,
  useUpdateEmailMutation,
} from "../../hooks/useEmailsQuery";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import EmailComposeModal from "./components/EmailComposeModal";
import EmailDetailsView from "./components/EmailDetailsView";
import EmailList from "./components/EmailList";
import EmailSidebar from "./components/EmailSidebar";
import EmailToolbar from "./components/EmailToolbar";

export const EmailDashboard: React.FC = () => {
  const [currentFolder, setCurrentFolder] = useState<EmailFolder>("inbox");
  const [selectedLabel, setSelectedLabel] = useState<EmailLabel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeEmail, setActiveEmail] = useState<EmailItem | null>(null);

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeInitialData, setComposeInitialData] =
    useState<EmailItem | null>(null);
  const [isEmptyTrashConfirmOpen, setIsEmptyTrashConfirmOpen] = useState(false);
  const [isBatchDeleteConfirmOpen, setIsBatchDeleteConfirmOpen] =
    useState(false);

  const { data, isLoading, refetch } = useEmailsQuery({
    folder: currentFolder,
    search: searchQuery,
    label: selectedLabel || undefined,
  });

  const updateMutation = useUpdateEmailMutation();
  const batchUpdateMutation = useBatchUpdateEmailsMutation();
  const createMutation = useCreateEmailMutation();
  const deleteMutation = useDeleteEmailMutation();
  const batchDeleteMutation = useBatchDeleteEmailsMutation();
  const emptyTrashMutation = useEmptyTrashMutation();

  const emails = data?.emails || [];
  const counts = data?.counts || {
    inbox: 0,
    sent: 0,
    draft: 0,
    starred: 0,
    spam: 0,
    trash: 0,
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(emails.map((e) => e.id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleToggleStar = (
    id: string,
    currentStarred: boolean,
    e?: React.MouseEvent,
  ) => {
    if (e) e.stopPropagation();
    updateMutation.mutate({
      id,
      updates: { isStarred: !currentStarred },
    });
    if (activeEmail && activeEmail.id === id) {
      setActiveEmail((prev) =>
        prev ? { ...prev, isStarred: !currentStarred } : null,
      );
    }
  };

  const handleOpenEmail = (email: EmailItem) => {
    if (email.folder === "draft") {
      setComposeInitialData(email);
      setIsComposeOpen(true);
      return;
    }

    if (!email.isRead) {
      updateMutation.mutate({
        id: email.id,
        updates: { isRead: true },
      });
      email.isRead = true;
    }
    setActiveEmail(email);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    if (currentFolder === "trash") {
      setIsBatchDeleteConfirmOpen(true);
    } else {
      batchUpdateMutation.mutate({
        ids: selectedIds,
        updates: { folder: "trash" },
      });
      setSelectedIds([]);
    }
  };

  const handleConfirmBatchDelete = () => {
    batchDeleteMutation.mutate(selectedIds);
    setSelectedIds([]);
    setIsBatchDeleteConfirmOpen(false);
  };

  const handleMarkAsReadSelected = () => {
    if (selectedIds.length === 0) return;
    batchUpdateMutation.mutate({
      ids: selectedIds,
      updates: { isRead: true },
    });
    setSelectedIds([]);
  };

  const handleMarkAsUnreadSelected = () => {
    if (selectedIds.length === 0) return;
    batchUpdateMutation.mutate({
      ids: selectedIds,
      updates: { isRead: false },
    });
    setSelectedIds([]);
  };

  const handleMoveToFolder = (
    folder: "inbox" | "sent" | "draft" | "spam" | "trash",
  ) => {
    if (selectedIds.length === 0) return;
    batchUpdateMutation.mutate({
      ids: selectedIds,
      updates: { folder },
    });
    setSelectedIds([]);
  };

  const handleToggleLabel = (label: EmailLabel) => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => {
      const email = emails.find((e) => e.id === id);
      if (!email) return;
      const currentLabels = email.labels || [];
      const newLabels = currentLabels.includes(label)
        ? currentLabels.filter((l) => l !== label)
        : [...currentLabels, label];
      updateMutation.mutate({
        id,
        updates: { labels: newLabels },
      });
    });
    setSelectedIds([]);
  };

  const handleDeleteSingle = (id: string) => {
    if (currentFolder === "trash") {
      deleteMutation.mutate(id);
    } else {
      updateMutation.mutate({
        id,
        updates: { folder: "trash" },
      });
    }
    setActiveEmail(null);
  };

  const handleMarkAsUnreadSingle = (id: string) => {
    updateMutation.mutate({
      id,
      updates: { isRead: false },
    });
    setActiveEmail(null);
  };

  const handleReplySingle = (email: EmailItem, replyText: string) => {
    createMutation.mutate({
      to: email.from.email,
      subject: email.subject.startsWith("Re:")
        ? email.subject
        : `Re: ${email.subject}`,
      message: replyText,
      isDraft: false,
    });
  };

  const handleForwardSingle = (email: EmailItem) => {
    setComposeInitialData({
      ...email,
      to: "",
      subject: email.subject.startsWith("Fwd:")
        ? email.subject
        : `Fwd: ${email.subject}`,
      message: `\n\n---------- Forwarded message ---------\nFrom: ${email.from.name} <${email.from.email}>\nDate: ${email.timestamp}\nSubject: ${email.subject}\n\n${email.message}`,
    });
    setIsComposeOpen(true);
  };

  const handleSendCompose = (payload: EmailComposePayload) => {
    if (composeInitialData && composeInitialData.folder === "draft") {
      deleteMutation.mutate(composeInitialData.id);
    }
    createMutation.mutate(payload);
  };

  const handleSaveDraftCompose = (payload: EmailComposePayload) => {
    if (composeInitialData && composeInitialData.folder === "draft") {
      deleteMutation.mutate(composeInitialData.id);
    }
    createMutation.mutate(payload);
  };

  const handleSelectFolder = (folder: EmailFolder) => {
    setCurrentFolder(folder);
    setSelectedLabel(null);
    setSelectedIds([]);
    setActiveEmail(null);
  };

  const handleSelectLabel = (label: EmailLabel | null) => {
    setSelectedLabel(label);
    setSelectedIds([]);
    setActiveEmail(null);
  };

  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col">
      <div className="w-full h-full bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 overflow-hidden flex flex-row min-h-0">
        <EmailSidebar
          currentFolder={currentFolder}
          onSelectFolder={handleSelectFolder}
          selectedLabel={selectedLabel}
          onSelectLabel={handleSelectLabel}
          counts={counts}
          onCompose={() => {
            setComposeInitialData(null);
            setIsComposeOpen(true);
          }}
          onEmptyTrash={() => setIsEmptyTrashConfirmOpen(true)}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">
          {activeEmail ? (
            <EmailDetailsView
              email={activeEmail}
              onBack={() => setActiveEmail(null)}
              onToggleStar={(id, isStarred) => handleToggleStar(id, isStarred)}
              onDelete={handleDeleteSingle}
              onMarkAsUnread={handleMarkAsUnreadSingle}
              onReply={handleReplySingle}
              onForward={handleForwardSingle}
            />
          ) : (
            <>
              <div className="shrink-0 sticky top-0 z-10 bg-white">
                <div className="px-5 py-3.5 border-b border-[#dbdade]/50 flex items-center gap-3 bg-white">
                  <svg
                    className="w-5 h-5 text-[#a5a3ae] shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search mail"
                    className="w-full text-fs14 text-[#32475c] placeholder-[#a5a3ae] focus:outline-hidden bg-transparent"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-fs14 text-[#a5a3ae] hover:text-[#5d596c] p-1 font-bold cursor-pointer"
                      aria-label="Clear search"
                    >
                      &times;
                    </button>
                  )}
                </div>
                <EmailToolbar
                  totalCount={emails.length}
                  selectedCount={selectedIds.length}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                  onDeleteSelected={handleDeleteSelected}
                  onMarkAsReadSelected={handleMarkAsReadSelected}
                  onMarkAsUnreadSelected={handleMarkAsUnreadSelected}
                  onMoveToFolder={handleMoveToFolder}
                  onToggleLabel={handleToggleLabel}
                  onRefresh={() => refetch()}
                  currentFolder={currentFolder}
                />
              </div>

              <EmailList
                emails={emails}
                selectedIds={selectedIds}
                searchQuery={searchQuery}
                onToggleSelect={handleToggleSelect}
                onToggleStar={handleToggleStar}
                onOpenEmail={handleOpenEmail}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      </div>

      <EmailComposeModal
        isOpen={isComposeOpen}
        onClose={() => {
          setIsComposeOpen(false);
          setComposeInitialData(null);
        }}
        onSend={handleSendCompose}
        onSaveDraft={handleSaveDraftCompose}
        initialData={composeInitialData}
      />

      <ConfirmationModal
        isOpen={isEmptyTrashConfirmOpen}
        title="Empty Trash?"
        message="Are you sure you want to permanently delete all messages in the Trash? This action cannot be undone."
        confirmText="Empty Trash"
        cancelText="Cancel"
        variant="danger"
        onConfirm={() => {
          emptyTrashMutation.mutate();
          setIsEmptyTrashConfirmOpen(false);
        }}
        onCancel={() => setIsEmptyTrashConfirmOpen(false)}
      />

      <ConfirmationModal
        isOpen={isBatchDeleteConfirmOpen}
        title="Delete Permanently?"
        message={`Are you sure you want to permanently delete the ${selectedIds.length} selected message(s)? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmBatchDelete}
        onCancel={() => setIsBatchDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default EmailDashboard;
