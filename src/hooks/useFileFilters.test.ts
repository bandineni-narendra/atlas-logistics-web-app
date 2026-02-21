import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFileFilters } from './useFileFilters'
import * as navigation from 'next/navigation'

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useSearchParams: vi.fn(),
}))

describe('useFileFilters', () => {
    const mockPush = vi.fn()
    const mockReplace = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()

        // Default mocks
        vi.mocked(navigation.useRouter).mockReturnValue({
            push: mockPush,
            replace: mockReplace,
            back: vi.fn(),
        } as any)

        vi.mocked(navigation.usePathname).mockReturnValue('/files')
        vi.mocked(navigation.useSearchParams).mockReturnValue(new URLSearchParams() as any)
    })

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useFileFilters())

        expect(result.current.filters).toEqual({
            type: 'all',
            status: 'all',
            startDate: '',
            endDate: '',
            page: 1,
        })
    })

    it('should update filters and URL', () => {
        const { result } = renderHook(() => useFileFilters())

        act(() => {
            result.current.setFilter({ type: 'AIR' })
        })

        // Expect replace to be called with updated query params
        expect(mockReplace).toHaveBeenCalledWith(
            expect.stringContaining('type=AIR'),
            { scroll: false }
        )
    })

    it('should read initial state from URL', () => {
        vi.mocked(navigation.useSearchParams).mockReturnValue(
            new URLSearchParams('type=OCEAN&page=3') as any
        )

        const { result } = renderHook(() => useFileFilters())

        expect(result.current.filters.type).toBe('OCEAN')
        expect(result.current.filters.page).toBe(3)
    })
})
