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

    it("should include shipmentDetails in the createFile request (regression: stale closure)", async () => {
        (filesService.createFile as any).mockResolvedValueOnce({
            fileId: "file-456",
            sheetIds: ["sheet-456"],
        });

        const shipment = {
            rows: [
                {
                    id: "row-1",
                    qty: 5,
                    weight: 25,
                    weightUnit: "kg",
                    length: 60,
                    lengthUnit: "cm",
                    width: 40,
                    widthUnit: "cm",
                    height: 30,
                    heightUnit: "cm",
                },
            ],
            stats: {
                totalQty: 5,
                grossWeight: 25,
                totalVolWeight: 28.8,
                chargeableWeight: 28.8,
                totalVolume: 0.072,
            },
        };

        const { result } = renderHook(
            () =>
                useFileSave({
                    fileType: "AIR",
                    effectiveDate: "2026-03-01",
                }),
            { wrapper },
        );

        // Open modal, passing shipmentDetails
        act(() => {
            result.current.handleSaveFile(
                [
                    {
                        id: "sheet-1",
                        name: "Rates",
                        columns: [{ id: "origin", label: "Origin", type: "text" as any }],
                        rows: [{ id: "r1", cells: { origin: "BOM" as any } }],
                    },
                ],
                shipment,
            );
        });

        // Confirm save in modal
        await act(async () => {
            result.current.fileNameModalProps.onSave({
                fileName: "Shipment Test File",
            });
        });

        // Verify shipmentDetails was forwarded to the API
        expect(filesService.createFile).toHaveBeenCalledTimes(1);
        const callArg = (filesService.createFile as any).mock.calls[0][0];
        expect(callArg.shipmentDetails).toEqual(shipment);
    });
});
