import { z } from 'zod'
import dayjs, { Dayjs } from 'dayjs'
import type { RuleObject } from 'antd/es/form'
import type { StoreValue } from 'antd/es/form/interface'
import { useTranslation } from 'react-i18next'

/**
 * Interface for the sign-up form fields.
 */
export interface SignUpFormFields {
  email: string
  password1: string
  password2: string
  nick_name: string
  marital_status: string
  gender: string
  birthday: string
  registered_from: string
}

/**
 * Underlying Zod object for the sign-up schema.
 *
 * This type defines the shape of the base object used for sign-up validation.
 */
type UnderlyingSignUpSchema = z.ZodObject<{
  email: z.ZodString
  password1: z.ZodString
  password2: z.ZodString
  nick_name: z.ZodString
  marital_status: z.ZodString
  gender: z.ZodString
  // Accept any Zod type that outputs a string:
  birthday: z.ZodType<string, z.ZodTypeDef, unknown>
  registered_from: z.ZodString
}>

/**
 * The Zod validation schema for sign-up forms.
 *
 * This is represented as a ZodEffects wrapper around an UnderlyingSignUpSchema.
 */
export type SignUpSchema = z.ZodEffects<UnderlyingSignUpSchema>

/**
 * Interface for validation messages in different languages
 */
export interface ValidationMessages {
  email: { required: string; invalid: string; format: string }
  password: {
    required: string
    minLength: string
    maxLength: string
    format: string
    mismatch: string
  }
  nick_name: {
    required: string
    minLength: string
    containsLetter: string
  }
  marital_status: { required: string }
  gender: { required: string }
  birthday: { required: string; cannotBeFuture: string; minimumAge: string }
}

/**
 * Retrieves validation messages using i18n translation keys.
 *
 * @returns {ValidationMessages} Validation messages in the appropriate language
 */
export const useValidationMessages = (): ValidationMessages => {
  const { t } = useTranslation(['auth'])

  return {
    email: {
      required: t('emailRequired'),
      invalid: t('emailInvalid'),
      format: t('emailInvalid')
    },
    password: {
      required: t('passwordRequired'),
      minLength: t('passwordTooShort'),
      maxLength: t('passwordTooLong'),
      format: t('passwordFormat'),
      mismatch: t('passwordMismatch')
    },
    nick_name: {
      required: t('nickNameRequired'),
      minLength: t('nickNameTooShort'),
      containsLetter: t('nickNameContainsLetter')
    },
    marital_status: {
      required: t('maritalStatusRequired')
    },
    gender: {
      required: t('genderRequired')
    },
    birthday: {
      required: t('birthdayRequired'),
      cannotBeFuture: t('birthdayCannotBeFuture'),
      minimumAge: t('birthdayMinimumAge')
    }
  }
}

/**
 * Creates the underlying Zod schema for sign-up form validation.
 * Uses a preprocessor and refinements to validate the birthday field.
 *
 * @param {ValidationMessages} messages - The validation messages to use.
 * @returns {z.ZodObject<{
 *   email: z.ZodString;
 *   password1: z.ZodString;
 *   password2: z.ZodString;
 *   nick_name: z.ZodString;
 *   marital_status: z.ZodString;
 *   gender: z.ZodString;
 *   birthday: z.ZodType<string, z.ZodTypeDef, unknown>;
 *   registered_from: z.ZodString;
 * }>} The Zod schema object for form validation
 */
const createUnderlyingSchema = (messages: ValidationMessages) =>
  z.object({
    email: z
      .string({ required_error: messages.email.required })
      .min(1, messages.email.required)
      .email(messages.email.format)
      .max(255, messages.email.invalid),
    password1: z
      .string({ required_error: messages.password.required })
      .min(8, messages.password.minLength)
      .max(50, messages.password.maxLength)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, messages.password.format),
    password2: z.string({ required_error: messages.password.required }),
    nick_name: z
      .string({ required_error: messages.nick_name.required })
      .min(3, messages.nick_name.minLength)
      .regex(/[a-zA-Z\u0621-\u064A]/, messages.nick_name.containsLetter),
    marital_status: z.string({
      required_error: messages.marital_status.required
    }),
    gender: z.string({ required_error: messages.gender.required }),
    birthday: z.preprocess(
      (arg) => {
        if (typeof arg === 'string') {
          return dayjs(arg, 'YYYY-MM-DD', true)
        } else if (dayjs.isDayjs(arg)) {
          return arg
        }
        return null
      },
      z
        .custom<Dayjs>((val) => dayjs.isDayjs(val), {
          message: messages.birthday.required
        })
        .refine((val) => val.isBefore(dayjs(), 'day'), {
          message: messages.birthday.cannotBeFuture
        })
        .refine((val) => dayjs().diff(val, 'year') >= 7, {
          message: messages.birthday.minimumAge
        })
        .transform((date: Dayjs) => date.format('YYYY-MM-DD'))
    ),
    registered_from: z.string()
  })

/**
 * Creates a Zod validation schema for the sign-up form.
 *
 * @param {ValidationMessages} messages - The validation messages to use.
 * @returns {SignUpSchema} The Zod schema for sign-up form validation.
 */
export const createSignUpValidationSchema = (messages: ValidationMessages): SignUpSchema => {
  const underlyingSchema = createUnderlyingSchema(messages)
  return underlyingSchema.refine((data) => data.password1 === data.password2, {
    message: messages.password.mismatch,
    path: ['password2']
  })
}

/**
 * Creates a field validator function compatible with Ant Design Form.
 *
 * @param {SignUpSchema} schema - The Zod schema for sign-up form validation.
 * @param {keyof SignUpFormFields} fieldName - The name of the field to validate.
 * @returns {(rule: RuleObject, value: StoreValue) => Promise<void>} A field validator function.
 */
export const createFieldValidator = (schema: SignUpSchema, fieldName: keyof SignUpFormFields) => {
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
