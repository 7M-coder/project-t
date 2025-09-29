import React, { useState, useCallback } from 'react'
import type { FormProps } from 'antd'
import { Alert, Button, Form, Input, Space, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { signIn } from '../services/auth.services'
import axios from 'axios'
import { z } from 'zod'
import { BackendErrorResponse } from '../types/auth.types'
import {
  createSignInValidationSchema,
  createFieldValidator,
  useValidationMessages
} from '../validations/signin.validation'
import { useNavigateTo } from '@/hooks/useNavigateTo'
import i18n from '@/i18n/config'

interface FieldType {
  phone: string
  password: string
}

/**
 * SignInForm component handles user authentication through phone and password.
 *
 * @description
 * This component features:
 * - Localized form fields and validation messages using react-i18next
 * - Zod schema validation for form inputs
 * - Error handling for API calls and validation errors
 * - Loading state management during form submission
 * - Initiates OTP verification flow upon successful authentication
 * - Password recovery and registration navigation links
 *
 * @returns {React.ReactElement} A form component with phone/password inputs and submission handling
 *
 */
const SignInForm: React.FC = () => {
  const { t } = useTranslation(['auth'])
  const [form] = Form.useForm()
  const [, contextHolder] = message.useMessage()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigateTo()

  // Use i18n validation messages
  const validationMessages = useValidationMessages()

  // Create validation schema with localized messages
  const validationSchema = createSignInValidationSchema(validationMessages)

  const processError = useCallback(
    (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const backendData = error.response.data as BackendErrorResponse

        // Handle different error formats
        if (backendData.error && Array.isArray(backendData.error)) {
          setErrorMsg(backendData.error.join(' '))
          return
        }

        if (backendData.detail) {
          setErrorMsg(backendData.detail)
          return
        }

        setErrorMsg(t('loginFailed'))
      } else if (error instanceof Error) {
        setErrorMsg(error.message)
      } else {
        setErrorMsg(t('unknownError'))
      }
    },
    [t]
  )

  const handleFinish = useCallback(
    (values: FieldType) => {
      void (async () => {
        setErrorMsg(null)
        setLoading(true)
        try {
          // form sent data (values)
          const { phone, password } = values
          // Validate all form data
          validationSchema.parse({ phone, password })

          // Log the payload being sent to the API
          console.log('Sign In Payload:', { country_code: '966', phone, password })

          // Call the login endpoint to request OTP
          const response = await signIn({ country_code: '966', phone, password })

          // Log the response from the API
          console.log('Sign In Response:', response)

          // Store the phone for OTP verification
          localStorage.setItem('ACCESS_TOKEN', response.access_token)
          localStorage.setItem('REFRESH_TOKEN', response.refresh_token)
          localStorage.setItem('USER_INFO', JSON.stringify(response.user))

          // Show message about OTP being sent
          if (response) {
            message.success(t('loginSuccess'))
          } 
          form.resetFields()
          // Comment out navigation to prevent redirect
          navigate()
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
    [form, processError, validationSchema, navigate, i18n.resolvedLanguage, t]
  )

  const onFinishFailed: NonNullable<FormProps<FieldType>['onFinishFailed']> = useCallback(
    (errorInfo) => {
      void errorInfo
    },
    []
  )

  return (
    <>
      {contextHolder}
      {errorMsg && (
        <Alert
          message={errorMsg}
          type="error"
          closable
          onClose={() => {
            setErrorMsg(null)
          }}
          className="mb-4"
        />
      )}

      <Form
        form={form}
        name="login"
        layout="vertical"
        initialValues={{}}
        onFinish={handleFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="phone"
          label={t('phone')}
          rules={[
            {
              validator: createFieldValidator(validationSchema, 'phone')
            }
          ]}
        >
          <Input
            type="phone"
            placeholder={t('phonePlaceholder')}
            autoComplete="phone"
            className="px-3 py-2"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={t('password')}
          rules={[
            {
              validator: createFieldValidator(validationSchema, 'password')
            }
          ]}
        >
          <Input.Password
            placeholder={t('passwordPlaceholder')}
            autoComplete="current-password"
            className="px-3 py-2"
          />
        </Form.Item>

        <Form.Item>
          <Space style={{ width: '100%' }}>
            <Link to={`/${i18n.resolvedLanguage ?? 'ar'}/forgot-password`}>
              {t('forgotPassword')}
            </Link>
          </Space>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            {t('logIn')}
          </Button>
          <div className="text-center mt-4">
            {t('or')}{' '}
            <Link to={`/${i18n.resolvedLanguage ?? 'ar'}/register`} className="font-semibold">
              {t('registerNow')}
            </Link>
          </div>
        </Form.Item>
      </Form>
    </>
  )
}

export default SignInForm
