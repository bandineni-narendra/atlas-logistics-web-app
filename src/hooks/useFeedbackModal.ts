import { useState, useCallback } from "react";

export interface FeedbackModalState {
  isOpen: boolean;
  type: "success" | "error" | "warning" | "info" | null;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function useFeedbackModal() {
  const [state, setState] = useState<FeedbackModalState>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
  });

  const openModal = useCallback(
    (
      type: FeedbackModalState["type"],
      title: string,
      message?: string | (() => void),
      onConfirm?: () => void,
      confirmText?: string
    ) => {
      // Handle overloaded parameters
      let finalMessage = "";
      let finalOnConfirm = onConfirm;

      // If message is a function, it's the callback (old signature)
      if (typeof message === "function") {
        finalMessage = title;
        finalOnConfirm = message;
      } else {
        finalMessage = message || "";
      }

      setState({
        isOpen: true,
        type,
        title: finalMessage,
        message: typeof message === "function" ? "" : finalMessage,
        onConfirm: finalOnConfirm,
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const openSuccessModal = useCallback(
    (title: string = "Success", message: string = "") => {
      openModal("success", title, message);
    },
    [openModal]
  );

  const openErrorModal = useCallback(
    (title: string = "Error", message: string = "") => {
      openModal("error", title, message);
    },
    [openModal]
  );

  const openWarningModal = useCallback(
    (
      title: string = "Warning",
      onConfirmOrMessage?: string | (() => void),
      confirmText?: string
    ) => {
      if (typeof onConfirmOrMessage === "function") {
        // Called as openWarningModal(message, callback, title)
        setState({
          isOpen: true,
          type: "warning",
          title: title,
          message: title,
          onConfirm: onConfirmOrMessage,
        });
      } else {
        // Called as openWarningModal(title, message)
        openModal("warning", title, onConfirmOrMessage);
      }
    },
    []
  );

  const openInfoModal = useCallback(
    (title: string = "Information", message: string = "") => {
      openModal("info", title, message);
    },
    [openModal]
  );

  return {
    state,
    openModal,
    closeModal,
    closeSuccessModal: closeModal,
    closeErrorModal: closeModal,
    closeWarningModal: closeModal,
    closeInfoModal: closeModal,
    openSuccessModal,
    openErrorModal,
    openWarningModal,
    openInfoModal,
  };
}
