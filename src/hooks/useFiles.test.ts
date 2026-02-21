import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useFiles } from './useFiles'
import { filesService } from '@/services/filesService'

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    })
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children)
}


// Mock filesService
vi.mock('@/services/filesService', () => ({
    filesService: {
        getFiles: vi.fn(),
    },
}))

describe('useFiles', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should load files on mount', async () => {
        const mockFiles = [{ id: '1', name: 'Test File' }]
        vi.mocked(filesService.getFiles).mockResolvedValue({
            files: mockFiles as any,
            total: 1,
            page: 1,
            pageSize: 50
        })

        const { result } = renderHook(() => useFiles({ type: 'all' }), { wrapper: createWrapper() })

        // Initial state
        expect(result.current.loading).toBe(true)

        // Wait for update
        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.files).toHaveLength(2)
        expect(result.current.files[0].id).toBe('1')
    })

    it('should handle API errors', async () => {
        vi.mocked(filesService.getFiles).mockRejectedValue(new Error('API Error'))

        const { result } = renderHook(() => useFiles({ type: 'all' }), { wrapper: createWrapper() })

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        expect(result.current.files).toEqual([])
    })
})
