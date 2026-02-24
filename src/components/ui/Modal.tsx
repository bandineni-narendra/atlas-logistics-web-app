"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    /** Maximum width of the modal container (e.g., max-w-md, max-w-2xl) */
    maxWidth?: string;
    /** Custom class for the modal content container */
    className?: string;
    /** Prevent clicking the backdrop from closing the modal (useful for forcing actions) */
    preventBackdropClose?: boolean;
}

/**
 * High-performance, accessible Modal Primitive.
 * Uses React Portals to break out of DOM stacking contexts and render at the document root level.
 */
export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    maxWidth = "max-w-md",
    className = "bg-surface",
    preventBackdropClose = false,
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !preventBackdropClose) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, preventBackdropClose]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-200"
                onClick={preventBackdropClose ? undefined : onClose}
                role="presentation"
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                <div
                    className={`${className} border border-border rounded-xl shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-in fade-in zoom-in duration-200`}
                    role="dialog"
                    aria-modal="true"
                >
                    {children}
                </div>
            </div>
        </>,
        document.body
    );
};
