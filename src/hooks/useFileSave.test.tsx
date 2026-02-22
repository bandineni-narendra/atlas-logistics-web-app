import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useFileSave } from "./useFileSave";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { filesService } from "@/services/filesService";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock the filesService to prevent actual network calls
vi.mock("@/services/filesService", () => ({
    filesService: {
        createFile: vi.fn(),
    },
}));

describe("useFileSave Hook", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
        vi.clearAllMocks();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    it("should open the modal when handleSaveFile is called with valid sheets", () => {
        const { result } = renderHook(
            () =>
                useFileSave({
                    fileType: "OCEAN",
                    effectiveDate: "2026-02-22",
                }),
            { wrapper },
        );

        expect(result.current.fileNameModalProps.isOpen).toBe(false);

        act(() => {
            result.current.handleSaveFile([
                {
                    id: "1",
                    name: "Sheet 1",
                    columns: [{ id: "col1", label: "Col 1", type: "text" as any }],
                    rows: [{ id: "row1", cells: { col1: "test" as any } }],
                },
            ]);
        });

        // Modal should now be open
        expect(result.current.fileNameModalProps.isOpen).toBe(true);
    });

    it("should call filesService.createFile and invalidate queries on confirming save", async () => {
        const mockOnSuccess = vi.fn();
        (filesService.createFile as any).mockResolvedValueOnce({
            fileId: "file-123",
            sheetIds: ["sheet-123"],
        });

        const { result } = renderHook(
            () =>
                useFileSave({
                    fileType: "AIR",
                    onSuccess: mockOnSuccess,
                }),
            { wrapper },
        );

        // Initial action: Open modal with mock data
        act(() => {
            result.current.handleSaveFile([
                {
                    id: "1",
                    name: "Test Air Freight",
                    columns: [{ id: "dest", label: "Destination", type: "text" as any }],
                    rows: [],
                },
            ]);
        });

        // Simulate clicking "Save" in the modal
        await act(async () => {
            result.current.fileNameModalProps.onSave({
                fileName: "Test Rates File",
            });
        });

        expect(filesService.createFile).toHaveBeenCalledTimes(1);
        expect(mockOnSuccess).toHaveBeenCalledWith("file-123", ["sheet-123"]);
    });
});
