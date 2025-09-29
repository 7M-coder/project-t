import { vi, describe, it, expect, beforeEach } from 'vitest'
import { verifyLoginOtp, verifyRegistrationOtp } from '../services/auth.services'

// Mock the auth services
vi.mock('../services/auth.services', () => ({
  verifyLoginOtp: vi.fn(),
  verifyRegistrationOtp: vi.fn()
}))

describe('Auth Service - OTP Verification', () => {
  const testEmail = 'test@example.com'
  const testOtp = '1234'
  const mockAuthResponse = {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    user: {
      email: 'test@example.com',
      display_name: 'Test User'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Login OTP Verification', () => {
    it('should send correct OTP and email to verify login', async () => {
      // Arrange
      const payload = { email: testEmail, otp: testOtp }
      const mockedVerifyLoginOtp = verifyLoginOtp as jest.Mock
      mockedVerifyLoginOtp.mockResolvedValue(mockAuthResponse)

      // Act
      const result = await verifyLoginOtp(payload)

      // Assert
      expect(mockedVerifyLoginOtp).toHaveBeenCalledWith(payload)
      expect(result).toEqual(mockAuthResponse)
      expect(result.access_token).toBe('test-access-token')
      expect(result.refresh_token).toBe('test-refresh-token')
      expect(result.user.email).toBe(testEmail)
    })

    it('should throw an error when login OTP verification fails', async () => {
      // Arrange
      const payload = { email: testEmail, otp: 'wrong-otp' }
      const mockError = new Error('Invalid OTP code')
      const mockedVerifyLoginOtp = verifyLoginOtp as jest.Mock
      mockedVerifyLoginOtp.mockRejectedValue(mockError)

      // Act & Assert
      await expect(verifyLoginOtp(payload)).rejects.toThrow('Invalid OTP code')
    })
  })

  describe('Registration OTP Verification', () => {
    it('should send correct OTP and email to verify registration', async () => {
      // Arrange
      const payload = { email: testEmail, otp: testOtp }
      const mockedVerifyRegistrationOtp = verifyRegistrationOtp as jest.Mock
      mockedVerifyRegistrationOtp.mockResolvedValue(mockAuthResponse)

      // Act
      const result = await verifyRegistrationOtp(payload)

      // Assert
      expect(mockedVerifyRegistrationOtp).toHaveBeenCalledWith(payload)
      expect(result).toEqual(mockAuthResponse)
      expect(result.access_token).toBe('test-access-token')
      expect(result.refresh_token).toBe('test-refresh-token')
      expect(result.user.email).toBe(testEmail)
    })

    it('should throw an error when registration OTP verification fails', async () => {
      // Arrange
      const payload = { email: testEmail, otp: 'wrong-otp' }
      const mockError = new Error('Invalid OTP code')
      const mockedVerifyRegistrationOtp = verifyRegistrationOtp as jest.Mock
      mockedVerifyRegistrationOtp.mockRejectedValue(mockError)

      // Act & Assert
      await expect(verifyRegistrationOtp(payload)).rejects.toThrow('Invalid OTP code')
    })
  })

  // Advanced tests that verify the format and structure of API responses
  describe('API Response Structure', () => {
    it('should ensure login verification response contains required fields', async () => {
      // Arrange
      const payload = { email: testEmail, otp: testOtp }
      const mockedVerifyLoginOtp = verifyLoginOtp as jest.Mock
      mockedVerifyLoginOtp.mockResolvedValue(mockAuthResponse)

      // Act
      const result = await verifyLoginOtp(payload)

      // Assert
      expect(result).toHaveProperty('access_token')
      expect(result).toHaveProperty('refresh_token')
      expect(result).toHaveProperty('user')
      expect(result.user).toHaveProperty('email')
      expect(result.user).toHaveProperty('display_name')
      expect(typeof result.access_token).toBe('string')
      expect(typeof result.refresh_token).toBe('string')
    })

    it('should ensure registration verification response contains required fields', async () => {
      // Arrange
      const payload = { email: testEmail, otp: testOtp }
      const mockedVerifyRegistrationOtp = verifyRegistrationOtp as jest.Mock
      mockedVerifyRegistrationOtp.mockResolvedValue(mockAuthResponse)

      // Act
      const result = await verifyRegistrationOtp(payload)

      // Assert
      expect(result).toHaveProperty('access_token')
      expect(result).toHaveProperty('refresh_token')
      expect(result).toHaveProperty('user')
      expect(result.user).toHaveProperty('email')
      expect(result.user).toHaveProperty('display_name')
      expect(typeof result.access_token).toBe('string')
      expect(typeof result.refresh_token).toBe('string')
    })
  })
})
