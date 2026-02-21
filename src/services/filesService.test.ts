import { describe, it, expect, vi, beforeEach } from 'vitest'
import { filesService } from './filesService'
import { apiClient } from './apiClient'

// Mock apiClient methods
vi.mock('./apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}))

describe('filesService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getFiles', () => {
        it('should call generic endpoint without params', async () => {
            await filesService.getFiles()
            expect(apiClient.get).toHaveBeenCalledWith('/files', {})
        })

        it('should serialize query parameters correctly', async () => {
            await filesService.getFiles({ type: 'AIR', page: 2 })
            expect(apiClient.get).toHaveBeenCalledWith('/files', { type: 'AIR', page: 2 })
        })
    })

    describe('createFile', () => {
        it('should post data to /files', async () => {
            const mockData = { name: 'Test File', type: 'AIR' } as any
            await filesService.createFile(mockData)
            expect(apiClient.post).toHaveBeenCalledWith('/files', mockData)
        })
    })
})
