import { vi, describe, it, expect, beforeEach } from 'vitest'
import { signIn } from '../services/auth.services'

// Mock the auth service
vi.mock('../services/auth.services', () => ({
  signIn: vi.fn()
}))

describe('Auth Service - Sign In', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should send correct credentials to the API', async () => {
    // Arrange
    const mockCredentials = {
      email: 'user@example.com',
      password: 'Password123'
    }
    const mockResponse = {
      detail: 'OTP sent to email. Please verify OTP to complete login.'
    }
    const mockedSignIn = signIn as jest.Mock
    mockedSignIn.mockResolvedValue(mockResponse)

    // Act
    const result = await signIn(mockCredentials)

    // Assert
    expect(mockedSignIn).toHaveBeenCalledWith(mockCredentials)
    expect(result).toEqual(mockResponse)
  })

  it('should throw an error when API returns error', async () => {
    // Arrange
    const mockCredentials = {
      email: 'user@example.com',
      password: 'WrongPassword'
    }
    const mockError = new Error('Invalid credentials')
    const mockedSignIn = signIn as jest.Mock
    mockedSignIn.mockRejectedValue(mockError)

    // Act & Assert
    await expect(signIn(mockCredentials)).rejects.toThrow('Invalid credentials')
  })
})
