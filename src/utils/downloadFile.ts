/**
 * Download File Utility
 *
 * Calls the backend GET /files/:fileId/download-pdf endpoint,
 * receives the PDF as a binary blob, and triggers a browser download.
 *
 * Replaces the previous xlsx-based approach (which had empty data because
 * rows are stored in a separate Firestore sub-collection, not in sheet.data).
 */

import { firebaseTokenProvider } from '@/infrastructure/firebase';

/**
 * Downloads a file as a PDF by calling the backend PDF generation endpoint.
 *
 * @param fileId - The file ID to download
 * @param fileName - Used as the suggested filename for the download
 */
export async function downloadFileAsXlsx(
    fileId: string,
    fileName: string,
): Promise<void> {
    // Get the current auth token
    const token = await firebaseTokenProvider.getToken();

    const response = await fetch(`/api/v1/files/${fileId}/download-pdf`, {
        method: 'GET',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!response.ok) {
        let message = `Download failed (${response.status})`;
        try {
            const errData = await response.json();
            message = errData?.message ?? message;
        } catch {
            // ignore parse errors
        }
        throw new Error(message);
    }

    // Convert the response to a Blob and trigger a download
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const safeFileName = fileName.replace(/[^a-z0-9_\-. ]/gi, '_');
    const downloadName = safeFileName.endsWith('.pdf')
        ? safeFileName
        : `${safeFileName}.pdf`;

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = downloadName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Release the object URL after a short delay
    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}
