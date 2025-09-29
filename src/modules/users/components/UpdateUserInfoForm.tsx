import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { updateUser } from "../services/users.services";
import { useUsersData } from "@/hooks/useUsersData";
import {
  useValidationMessages,
  createUserInfoSchema,
  createFieldValidator,
} from "../validations/users.validation";
import { useTranslation } from "react-i18next";

interface UpdateUserInfoFormProps {
  initialValues?: {
    name?: string;
    phone?: string;
    country_code?: string;
  };
}

const UpdateUserInfoForm: React.FC<UpdateUserInfoFormProps> = ({
  initialValues,
}) => {
  const [form] = Form.useForm();
  const { refetch } = useUsersData();
  const [fields, setFields] = useState({
    name: "",
    phone: "",
    country_code: "",
  });
  const [loading, setLoading] = useState(false);
  const messages = useValidationMessages();
  const schema = createUserInfoSchema(messages);
  const { t } = useTranslation("users");

  const onValuesChange = (_: any, all: any) => {
    setFields(all);
  };

  const onFinish = async (values: any) => {
    const payload: Record<string, string> = {};
    if (values.name) payload.name = values.name;
    if (values.phone) payload.phone = values.phone;
    if (values.country_code) payload.country_code = values.country_code;
    setLoading(true);
    try {
      const data = await updateUser(payload);
      localStorage.setItem("USER_INFO", JSON.stringify(data));
      message.success("User info updated successfully");
      refetch();
      form.resetFields();
      setFields({ name: "", phone: "", country_code: "" });
    } catch (error) {
      message.error("Failed to update user info");
    } finally {
      setLoading(false);
    }
  };

  const isAllEmpty = !fields.name && !fields.phone && !fields.country_code;

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      className="w-full"
    >
      <Form.Item
        label={t("info.name")}
        name="name"
        validateTrigger="onChange"
        rules={[
          {
            validator: (_rule, value) =>
              createFieldValidator(schema, "name")(
                _rule,
                value,
                form.getFieldsValue()
              ),
          },
        ]}
      >
        <Input className="w-full" />
      </Form.Item>
      <Form.Item
        label={t("info.phone")}
        name="phone"
        validateTrigger="onChange"
        rules={[
          {
            validator: (_rule, value) =>
              createFieldValidator(schema, "phone")(
                _rule,
                value,
                form.getFieldsValue()
              ),
          },
        ]}
      >
        <Input className="w-full" />
      </Form.Item>
      <Form.Item
        label={t("info.country_code")}
        name="country_code"
        validateTrigger="onChange"
        rules={[
          {
            validator: (_rule, value) =>
              createFieldValidator(schema, "country_code")(
                _rule,
                value,
                form.getFieldsValue()
              ),
          },
        ]}
      >
        <Input className="w-full" />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          disabled={isAllEmpty}
          loading={loading}
        >
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateUserInfoForm;
