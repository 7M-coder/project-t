import { vi, describe, it, expect, beforeEach } from 'vitest'
import { signUp, checkNickname } from '../services/auth.services'

// Mock the auth services
vi.mock('../services/auth.services', () => ({
  signUp: vi.fn(),
  checkNickname: vi.fn()
}))

describe('Auth Service - Sign Up', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should send correct registration data to the API', async () => {
    // Arrange
    const mockRegistrationData = {
      email: 'newuser@example.com',
      password1: 'Password123',
      password2: 'Password123',
      nick_name: 'newuser',
      marital_status: 'SINGLE',
      gender: 'MALE',
      birthday: '2000-01-01',
      registered_from: 'WEB'
    }
    const mockResponse = {
      detail: 'OTP sent to your email. Please verify to activate your account.'
    }
    const mockedSignUp = signUp as jest.Mock
    mockedSignUp.mockResolvedValue(mockResponse)

    // Act
    const result = await signUp(mockRegistrationData)

    // Assert
    expect(mockedSignUp).toHaveBeenCalledWith(mockRegistrationData)
    expect(result).toEqual(mockResponse)
  })

  it('should throw an error when API returns error during registration', async () => {
    // Arrange
    const mockRegistrationData = {
      email: 'existing@example.com',
      password1: 'Password123',
      password2: 'Password123',
      nick_name: 'existing',
      marital_status: 'SINGLE',
      gender: 'MALE',
      birthday: '2000-01-01',
      registered_from: 'WEB'
    }
    const mockError = new Error('Email already exists')
    const mockedSignUp = signUp as jest.Mock
    mockedSignUp.mockRejectedValue(mockError)

    // Act & Assert
    await expect(signUp(mockRegistrationData)).rejects.toThrow('Email already exists')
  })

  it('should check nickname availability correctly', async () => {
    // Arrange
    const availableNickname = {
      nickname: 'available_username'
    }
    const availableResponse = {
      is_available: true,
      message: 'Nickname is available',
      suggestions: [],
      errors: []
    }
    const mockedCheckNickname = checkNickname as jest.Mock
    mockedCheckNickname.mockResolvedValue(availableResponse)

    // Act
    const result = await checkNickname(availableNickname)

    // Assert
    expect(mockedCheckNickname).toHaveBeenCalledWith(availableNickname)
    expect(result).toEqual(availableResponse)
  })

  it('should return suggestions when nickname is unavailable', async () => {
    // Arrange
    const unavailableNickname = {
      nickname: 'taken_username'
    }
    const unavailableResponse = {
      is_available: false,
      message: 'Nickname is already taken',
      suggestions: ['taken_username123', 'taken_username456'],
      errors: []
    }
    const mockedCheckNickname = checkNickname as jest.Mock
    mockedCheckNickname.mockResolvedValue(unavailableResponse)

    // Act
    const result = await checkNickname(unavailableNickname)

    // Assert
    expect(mockedCheckNickname).toHaveBeenCalledWith(unavailableNickname)
    expect(result).toEqual(unavailableResponse)
    expect(result.is_available).toBe(false)
    expect(result.suggestions.length).toBe(2)
  })
})
