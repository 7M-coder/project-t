import { z } from 'zod'
import type { RuleObject } from 'antd/es/form'
import type { StoreValue } from 'antd/es/form/interface'
import { useTranslation } from 'react-i18next'

// Define the form field types
export interface forgotPasswordFormFields {
  email: string
}

// Define the Zod schema type
export type forgotPasswordSchema = z.ZodObject<{
  email: z.ZodString
}>

// Types for the messages
interface ValidationMessages {
  email: {
    required: string
    invalid: string
    format: string
  }
}

/**
 * Creates a field validator function compatible with Ant Design Form validation.
 *
 * @param schema - The Zod schema for form validation
 * @param fieldName - The name of the field being validated (must be 'email')
 * @returns An Ant Design compatible validator function
 */
export const createFieldValidator = (
  schema: forgotPasswordSchema,
  fieldName: keyof forgotPasswordFormFields
) => {
  return async (_rule: RuleObject, value: StoreValue): Promise<void> => {
    const fieldSchema = schema.shape[fieldName]

    try {
      await fieldSchema.parseAsync(value)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message)
      }
      throw new Error('Validation failed')
    }
  }
}

/**
 * Retrieves validation messages using i18n translation keys.
 *
 * @returns Validation messages in the appropriate language
 */
export const useValidationMessages = (): ValidationMessages => {
  const { t } = useTranslation(['auth'])

  return {
    email: {
      required: t('emailRequired'),
      invalid: t('emailInvalid'),
      format: t('emailInvalid')
    }
  }
}

/**
 * Creates a Zod validation schema for the sign-in form.
 *
 * @param messages - Validation messages in the appropriate language
 * @returns A Zod schema for validating sign-in form data.
 */
export const createForgotPasswordValidationSchema = (
  messages: ValidationMessages
): forgotPasswordSchema => {
  return z.object({
    email: z
      .string({
        required_error: messages.email.required
      })
      .min(1, messages.email.required)
      .email(messages.email.format)
      .max(255, messages.email.invalid)
  })
}
