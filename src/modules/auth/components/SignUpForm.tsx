import React, { useState, useCallback } from 'react'
import type { FormProps } from 'antd'
import { Alert, Button, Form, Input, Select, DatePicker, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { z } from 'zod'
import dayjs, { Dayjs } from 'dayjs'
import { signUp, checkNickname } from '../services/auth.services'
import { SignUpPayload } from '../types/auth.types'
import {
  createSignUpValidationSchema,
  createFieldValidator,
  useValidationMessages,
  type ValidationMessages
} from '../validations/signup.validation'
import { useNavigateTo } from '@/hooks/useNavigateTo'
import { Link } from 'react-router-dom'
import i18n from '@/i18n/config'

interface FieldType {
  email: string
  password1: string
  password2: string
  nick_name: string
  marital_status: string
  gender: string
  // DatePicker now returns a Dayjs object or a string.
  birthday: string | Dayjs
  registered_from: string
}

/**
 * SignUpForm Component
 *
 * This component handles the user registration process, including form validation,
 * submission, and error handling. It uses Ant Design for the UI and Zod for validation.
 *
 * @returns {React.FC} The SignUpForm component.
 */
const SignUpForm: React.FC = () => {
  const { t } = useTranslation(['auth'])
  const [form] = Form.useForm<FieldType>()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [, contextHolder] = message.useMessage()
  const [nicknameHelp, setNicknameHelp] = useState<
    { message: string; isAvailable: boolean } | undefined
  >(undefined)
  const [isNicknameLoading, setIsNicknameLoading] = useState<boolean>(false)
  const navigate = useNavigateTo()

  // Use i18n validation messages
  const validationMessages = useValidationMessages()
  const validationSchema = createSignUpValidationSchema(validationMessages)

  const processError = useCallback(
    (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status >= 500) {
          setErrorMsg(t('registrationFailed'))
          return
        }

        // Check for detail field in response
        const backendData = error.response.data as Record<string, unknown>
        if (backendData.detail && typeof backendData.detail === 'string') {
          setErrorMsg(backendData.detail)
          return
        }

        // Otherwise, process field errors
        const msgs = Object.values(backendData).flat()
        if (msgs.length > 0) {
          setErrorMsg(msgs.join('\n'))
          return
        }

        setErrorMsg(t('registrationFailed'))
      } else if (error instanceof Error) {
        setErrorMsg(error.message)
      } else {
        setErrorMsg(t('unknownError'))
      }
    },
    [t]
  )

  // Create a separate Zod schema just for nickname validation
  const createNicknameSchema = (messages: ValidationMessages) => {
    return z
      .string({ required_error: messages.nick_name.required })
      .min(3, messages.nick_name.minLength)
      .regex(/[a-zA-Z\u0621-\u064A]/, messages.nick_name.containsLetter)
  }

  // Handler for nickname field blur event
  const handleNicknameBlur = useCallback(
    async (e: React.FocusEvent<HTMLInputElement>) => {
      const nickname: string = e.target.value.trim()

      if (!nickname) return

      // Use the validation messages from the top level
      const nicknameSchema = createNicknameSchema(validationMessages)

      try {
        // First validate with Zod schema
        nicknameSchema.parse(nickname)

        // If Zod validation passes, proceed with API call
        setIsNicknameLoading(true)
        const response = await checkNickname({ nickname })

        if (!response.is_available) {
          let suggestionMsg = response.message
          if (response.suggestions.length > 0) {
            suggestionMsg += '\nSuggestions: ' + response.suggestions.join(', ')
          }
          setNicknameHelp({ message: suggestionMsg, isAvailable: false })
          form.setFields([{ name: 'nick_name', errors: [suggestionMsg] }])
        } else {
          setNicknameHelp({ message: response.message, isAvailable: true })
          form.setFields([{ name: 'nick_name', errors: [] }])
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Handle Zod validation errors
          const errorMessage = error.errors[0].message
          setNicknameHelp({ message: errorMessage, isAvailable: false })
          form.setFields([{ name: 'nick_name', errors: [errorMessage] }])
        } else if (axios.isAxiosError(error)) {
          // Handle Axios error
          const genericError = t('nicknameCheckError')
          setNicknameHelp({ message: genericError, isAvailable: false })
          form.setFields([{ name: 'nick_name', errors: [genericError] }])
        }
      } finally {
        setIsNicknameLoading(false)
      }
    },
    [form, t, validationMessages]
  )

  const handleFinish = useCallback(
    (values: FieldType) => {
      void (async () => {
        setErrorMsg(null)
        setLoading(true)
        try {
          // Convert the birthday to a string if it's a Dayjs object.
          const transformedValues: FieldType = {
            ...values,
            birthday: dayjs.isDayjs(values.birthday)
              ? values.birthday.format('YYYY-MM-DD')
              : values.birthday
          }

          validationSchema.parse(transformedValues)

          const payload: SignUpPayload = {
            email: transformedValues.email,
            password1: transformedValues.password1,
            password2: transformedValues.password2,
            nick_name: transformedValues.nick_name,
            marital_status: transformedValues.marital_status,
            gender: transformedValues.gender,
            birthday:
              typeof transformedValues.birthday === 'string'
                ? transformedValues.birthday
                : transformedValues.birthday.format('YYYY-MM-DD'),
            registered_from: 'WEB'
          }

          // Call the registration API, which now returns an OTP verification message
          const response = await signUp(payload)

          // Store email for OTP verification page
          // localStorage.setItem('USER_EMAIL', payload.email)

          // Display success message about OTP being sent
          if (response.detail) {
            message.success(response.detail)
          } else {
            message.success(t('otpSent'))
          }

          // Reset the form
          form.resetFields()
          navigate('verify-register', { email: payload.email })
        } catch (error: unknown) {
          if (error instanceof z.ZodError) {
            setErrorMsg(error.errors[0].message)
          } else {
            processError(error)
          }
        } finally {
          setLoading(false)
        }
      })()
    },
    [form, validationSchema, processError, navigate, i18n.resolvedLanguage, t]
  )

  const onFinishFailed: NonNullable<FormProps<FieldType>['onFinishFailed']> = useCallback(
    (errorInfo) => {
      void errorInfo
    },
    []
  )

  const renderNickNameLabel = () => (
    <div className="flex items-center gap-2">
      <span>{t('nickName')}</span>
      <span className="text-xs text-gray-500">({t('nicknameHelpText')})</span>
    </div>
  )

  return (
    <>
      {contextHolder}
      {errorMsg && (
        <Alert
          data-testid="error-alert"
          message={errorMsg}
          type="error"
          style={{ whiteSpace: 'pre-line' }}
          closable
          onClose={() => {
            setErrorMsg(null)
          }}
          className="mb-4"
        />
      )}
      <Form<FieldType>
        form={form}
        name="register"
        layout="vertical"
        initialValues={{ marital_status: 'SINGLE', registered_from: 'WEB' }}
        onFinish={handleFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
        data-testid="signup-form"
      >
        {/* Email Field */}
        <Form.Item
          name="email"
          label={t('email')}
          rules={[{ validator: createFieldValidator(validationSchema, 'email') }]}
        >
          <Input
            type="email"
            placeholder={t('emailPlaceholder')}
            className="px-3 py-2"
            data-testid="email-input"
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          name="password1"
          label={t('password')}
          rules={[{ validator: createFieldValidator(validationSchema, 'password1') }]}
        >
          <Input.Password
            placeholder={t('passwordPlaceholder')}
            className="px-3 py-2"
            data-testid="password1-input"
          />
        </Form.Item>

        {/* Confirm Password Field */}
        <Form.Item
          name="password2"
          label={t('confirmPassword')}
          dependencies={['password1']}
          rules={[
            { required: true, message: t('confirmPasswordRequired') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password1') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(t('passwordMismatch')))
              }
            })
          ]}
        >
          <Input.Password
            placeholder={t('confirmPasswordPlaceholder')}
            className="px-3 py-2"
            data-testid="password2-input"
          />
        </Form.Item>

        {/* Nick Name Field */}
        <Form.Item
          label={renderNickNameLabel()}
          name="nick_name"
          help={
            nicknameHelp && (
              <span
                style={{ color: nicknameHelp.isAvailable ? 'green' : 'red' }}
                data-testid="nickname-help"
              >
                {nicknameHelp.message}
              </span>
            )
          }
          rules={[
            {
              required: true,
              message: t('nickNameRequired')
            }
          ]}
        >
          <Input
            onBlur={(e) => {
              void handleNicknameBlur(e)
            }}
            suffix={isNicknameLoading ? <LoadingOutlined /> : null}
            data-testid="nickname-input"
          />
        </Form.Item>

        {/* Marital Status Field */}
        <Form.Item
          name="marital_status"
          label={t('maritalStatus')}
          rules={[{ required: true, message: t('maritalStatusRequired') }]}
        >
          <Select placeholder={t('maritalStatusPlaceholder')} data-testid="marital-status-select">
            <Select.Option value="SINGLE">{t('single')}</Select.Option>
            <Select.Option value="MARRIED">{t('married')}</Select.Option>
            <Select.Option value="DIVORCED">{t('divorced')}</Select.Option>
            <Select.Option value="WIDOWED">{t('widowed')}</Select.Option>
          </Select>
        </Form.Item>

        {/* Gender Field */}
        <Form.Item
          name="gender"
          label={t('gender')}
          rules={[{ required: true, message: t('genderRequired') }]}
        >
          <Select placeholder={t('genderPlaceholder')} data-testid="gender-select">
            <Select.Option value="MALE">{t('male')}</Select.Option>
            <Select.Option value="FEMALE">{t('female')}</Select.Option>
          </Select>
        </Form.Item>

        {/* Birthday Field */}
        <Form.Item
          name="birthday"
          label={t('birthday')}
          rules={[{ validator: createFieldValidator(validationSchema, 'birthday') }]}
        >
          <DatePicker
            placeholder={t('birthdayPlaceholder')}
            className="w-full"
            format="YYYY-MM-DD"
            disabledDate={(current) => current > dayjs().endOf('day')}
            data-testid="birthday-picker"
          />
        </Form.Item>

        {/* Hidden Field: Registered From */}
        <Form.Item name="registered_from" hidden>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            loading={loading}
            data-testid="submit-button"
          >
            {t('createAccount')}
          </Button>
          <div className="text-center mt-4">
            {t('alreadyHaveAccount')}{' '}
            <Link
              to={`/${i18n.resolvedLanguage ?? 'ar'}/login`}
              className="font-semibold"
              data-testid="login-link"
            >
              {t('logIn')}
            </Link>
          </div>
        </Form.Item>
      </Form>
    </>
  )
}

export default SignUpForm
