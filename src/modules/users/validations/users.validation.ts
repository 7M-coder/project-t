import { z } from "zod";
import { useTranslation } from "react-i18next";

export const useValidationMessages = () => {
  const { t } = useTranslation("messages");
  return {
    name: {
      min: t("name_min"),
      max: t("name_max"),
      letters: t("name_letters"),
    },
    phone: {
      length: t("phone_length"),
      numbers: t("phone_numbers"),
      noLettersSpecial: t("phone_no_letters_special"),
      requiredWithCode: t("phone_requiredWithCode"),
    },
    country_code: {
      min: t("country_code_min"),
      max: t("country_code_max"),
      numbers: t("country_code_numbers"),
      noLettersSpecial: t("country_code_no_letters_special"),
      requiredWithPhone: t("country_code_requiredWithPhone"),
    },
  };
};

export const createUserInfoSchema = (messages: ReturnType<typeof useValidationMessages>) =>
  z.object({
    name: z.string().optional()
      .refine((val) => !val || val.length >= 3, { message: messages.name.min })
      .refine((val) => !val || val.length <= 15, { message: messages.name.max })
      .refine((val) => !val || /^[A-Za-zء-ي]+$/.test(val), { message: messages.name.letters }),
    phone: z.string().optional()
      .refine((val) => !val || /^\d{9}$/.test(val), { message: messages.phone.length })
      .refine((val) => !val || /^\d+$/.test(val), { message: messages.phone.numbers })
      .refine((val) => !val || /^[0-9]+$/.test(val), { message: messages.phone.noLettersSpecial }),
    country_code: z.string().optional()
      .refine((val) => !val || (/^\d{3,5}$/.test(val)), { message: messages.country_code.min })
      .refine((val) => !val || val.length <= 5, { message: messages.country_code.max })
      .refine((val) => !val || /^\d+$/.test(val), { message: messages.country_code.numbers })
      .refine((val) => !val || /^[0-9]+$/.test(val), { message: messages.country_code.noLettersSpecial }),
  })
  .refine(
    (data) => {
      if ((data.phone && !data.country_code) || (!data.phone && data.country_code)) {
        return false;
      }
      return true;
    },
    {
      message: (data) => {
        if (data.phone && !data.country_code) return messages.country_code.requiredWithPhone;
        if (!data.phone && data.country_code) return messages.phone.requiredWithCode;
        return "";
      },
      path: ["phone"],
    }
  );

export const createFieldValidator = (schema: ReturnType<typeof createUserInfoSchema>, field: string) => {
  return async (_: any, value: any, allValues: any) => {
    try {
      await schema.parseAsync({ ...allValues, [field]: value });
      return Promise.resolve();
    } catch (err: any) {
      const fieldError = err.errors?.find((e: any) => e.path.includes(field));
      if (fieldError) return Promise.reject(fieldError.message);
      return Promise.resolve();
    }
  };
};