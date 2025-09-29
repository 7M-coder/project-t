import { z } from "zod";
import type { RuleObject } from "antd/es/form";
import type { StoreValue } from "antd/es/form/interface";
import { useTranslation } from "react-i18next";

// Define the form field types
export interface SignInFormFields {
  phone: string;
  password: string;
}

// Define the Zod schema type
export type SignInSchema = z.ZodObject<{
  phone: z.ZodString;
  password: z.ZodString;
}>;

// Types for the messages
interface ValidationMessages {
  phone: {
    required: string;
    invalid: string;
    format: string;
  };
  password: {
    required: string;
    minLength: string;
    maxLength: string;
    format: string;
  };
}

/**
 * Creates a field validator function compatible with Ant Design Form validation.
 *
 * @param schema - The Zod schema for form validation
 * @param fieldName - The name of the field being validated (must be 'phone' or 'password')
 * @returns An Ant Design compatible validator function
 */
export const createFieldValidator = (
  schema: SignInSchema,
  fieldName: keyof SignInFormFields
) => {
  return async (_rule: RuleObject, value: StoreValue): Promise<void> => {
    const fieldSchema = schema.shape[fieldName];

    try {
      await fieldSchema.parseAsync(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw new Error("Validation failed");
    }
  };
};

/**
 * Retrieves validation messages using i18n translation keys.
 *
 * @returns Validation messages in the appropriate language
 */
export const useValidationMessages = (): ValidationMessages => {
  const { t } = useTranslation(["auth"]);

  return {
    phone: {
      required: t("phoneRequired"),
      invalid: t("phoneInvalid"),
      format: t("phoneInvalid"),
      maxLength: t("phoneTooLong"),
      minLength: t("phoneTooShort"),
    },
    password: {
      required: t("passwordRequired"),
      minLength: t("passwordTooShort"),
      maxLength: t("passwordTooLong"),
      format: t("passwordFormat"),
    },
  };
};

/**
 * Creates a Zod validation schema for the sign-in form.
 *
 * @param messages - Validation messages in the appropriate language
 * @returns A Zod schema for validating sign-in form data.
 */
export const createSignInValidationSchema = (
  messages: ValidationMessages
): SignInSchema => {
  return z.object({
    phone: z
      .string({
        required_error: messages.phone.required,
      })
      .min(10, messages.phone.minLength)
      .max(10, messages.phone.maxLength)
      .regex(/^[0-9]+$/, messages.phone.format),

    password: z
      .string({
        required_error: messages.password.required,
      })
      .min(8, messages.password.minLength)
      .max(50, messages.password.maxLength)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, messages.password.format),
  });
};
