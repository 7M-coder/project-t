import { z } from 'zod'
import type { RuleObject } from 'antd/es/form'
import type { StoreValue } from 'antd/es/form/interface'
import { useTranslation } from 'react-i18next'

/**
 * Interface for the reset password form fields.
 */
export interface ResetPasswordFormFields {
  newPassword: string
  confirmPassword: string
}

/**
 * Underlying Zod object for the reset password schema.
 *
 * This type defines the shape of the base object used for reset password validation.
 */
type UnderlyingResetPasswordSchema = z.ZodObject<{
  newPassword: z.ZodString
  confirmPassword: z.ZodString
}>

/**
 * The Zod validation schema for reset password forms.
 *
 * This is represented as a ZodEffects wrapper around an UnderlyingResetPasswordSchema.
 */
export type ResetPasswordSchema = z.ZodEffects<UnderlyingResetPasswordSchema>

/**
 * Interface for reset password validation messages in different languages
 */
export interface ResetPasswordValidationMessages {
  password: {
    required: string
    minLength: string
    maxLength: string
    format: string
    mismatch: string
  }
}

/**
 * Retrieves reset password validation messages using i18n translation keys.
 *
 * @returns {ResetPasswordValidationMessages} Validation messages in the appropriate language
 */
export const useResetPasswordValidationMessages = (): ResetPasswordValidationMessages => {
  const { t } = useTranslation(['auth'])

  return {
    password: {
      required: t('passwordRequired'),
      minLength: t('passwordTooShort'),
      maxLength: t('passwordTooLong'),
      format: t('passwordFormat'),
      mismatch: t('passwordMismatch')
    }
  }
}

/**
 * Creates the underlying Zod schema for reset password form validation.
 *
 * @param {ResetPasswordValidationMessages} messages - The validation messages to use.
 * @returns {UnderlyingResetPasswordSchema} The Zod schema object for form validation
 */
const createUnderlyingResetPasswordSchema = (messages: ResetPasswordValidationMessages) =>
  z.object({
    newPassword: z
      .string({ required_error: messages.password.required })
      .min(8, messages.password.minLength)
      .max(50, messages.password.maxLength)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, messages.password.format),
    confirmPassword: z.string({ required_error: messages.password.required })
  })

/**
 * Creates a Zod validation schema for the reset password form.
 *
 * @param {ResetPasswordValidationMessages} messages - The validation messages to use.
 * @returns {ResetPasswordSchema} The Zod schema for reset password form validation.
 */
export const createResetPasswordValidationSchema = (
  messages: ResetPasswordValidationMessages
): ResetPasswordSchema => {
  const underlyingSchema = createUnderlyingResetPasswordSchema(messages)
  return underlyingSchema.refine((data) => data.newPassword === data.confirmPassword, {
    message: messages.password.mismatch,
    path: ['confirmPassword']
  })
}

/**
 * Creates a field validator function compatible with Ant Design Form.
 *
 * @param {ResetPasswordSchema} schema - The Zod schema for reset password form validation.
 * @param {keyof ResetPasswordFormFields} fieldName - The name of the field to validate.
 * @returns {(rule: RuleObject, value: StoreValue) => Promise<void>} A field validator function.
 */
export const createResetPasswordFieldValidator = (
  schema: ResetPasswordSchema,
  fieldName: keyof ResetPasswordFormFields
) => {
  return async (_rule: RuleObject, value: StoreValue): Promise<void> => {
    // Extract the underlying ZodObject from the effects wrapper.
    const objectSchema = schema._def.schema
    const fieldSchema = objectSchema.shape[fieldName]
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
