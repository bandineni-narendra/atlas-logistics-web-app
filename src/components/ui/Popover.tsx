"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

interface PopoverProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement | null>;
    children: React.ReactNode;
    className?: string;
    collisionPadding?: number; // Padding from screen edges
}

/**
 * Popover Component
 * Renders content in a Portal to avoid clipping by parent overflow.
 * positions itself relative to the anchor element.
 */
export const Popover: React.FC<PopoverProps> = ({
    isOpen,
    onClose,
    anchorRef,
    children,
    className = "",
    collisionPadding = 16,
}) => {
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [isPositioned, setIsPositioned] = useState(false); // New state to track if we have calculated position
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset positioning state when closed
    useEffect(() => {
        if (!isOpen) {
            setIsPositioned(false);
        }
    }, [isOpen]);

    // Update position when opened or resized
    useEffect(() => {
        if (!isOpen || !anchorRef.current || !mounted) return;

        const updatePosition = () => {
            const anchor = anchorRef.current!.getBoundingClientRect();
            const popover = popoverRef.current; // Might be null on first render if we hide it, but we need it for width/height

            let top = anchor.bottom + 8;
            let left = anchor.left;

            // We need to render once to get dimensions, but keep it invisible
            if (popover) {
                const { width } = popover.getBoundingClientRect();

                // Prevent going off right edge
                if (left + width > window.innerWidth - collisionPadding) {
                    left = window.innerWidth - width - collisionPadding;
                }
                // Prevent going off left edge
                if (left < collisionPadding) {
                    left = collisionPadding;
                }
            }

            setPosition({ top: top + window.scrollY, left: left + window.scrollX });

            // Only mark as positioned if we have valid coordinates (non-zero or explicitly handled)
            // Using setTimeout to ensure the browser has painted the position before we show it and animate
            requestAnimationFrame(() => {
                setIsPositioned(true);
            });
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [isOpen, anchorRef, mounted, collisionPadding]);

    // Handle click outside
    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                anchorRef.current &&
                !anchorRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose, anchorRef]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div
            ref={popoverRef}
            // Use invisible to ensure it is not seen at all until positioned
            // 'animate-in' handles the entrance animation once visible
            className={`absolute z-[9999] ${className} ${isPositioned ? "animate-in fade-in zoom-in-95 duration-100" : "invisible"
                }`}
            style={{
                top: position.top,
                left: position.left,
            }}
        >
            {children}
        </div>,
        document.body
    );
};
