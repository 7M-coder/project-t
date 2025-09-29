import MainLayout from "@/modules/core/layouts/MainLayout";
import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import { useUsersData } from "@/hooks/useUsersData";
import { useTranslation } from "react-i18next";


/**
 * UsersPage displays a table of users using Ant Design and Tailwind CSS.
 */
export const UsersPage: React.FC = () => {
  const { users } = useUsersData();
  const { t } = useTranslation("users");
  // Define columns for the Ant Design Table.
  const columns = [
    {
      title: t("table.id"),
      dataIndex: "id",
      key: "id",
      width: 80,
      className: "text-center",
    },
    {
      title: t("table.name"),
      dataIndex: "name",
      key: "name",
      className: "font-semibold",
    },
    {
      title: t("table.country_code"),
      dataIndex: "country_code",
      key: "country_code",
    },
    {
      title: t("table.phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("table.role"),
      dataIndex: "role",
      key: "role",
    },
    {
      title: t("table.created_at"),
      dataIndex: "created_at",
      key: "created_at",
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: t("table.updated_at"),
      dataIndex: "updated_at",
      key: "updated_at",
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: t("table.is_blocked"),
      dataIndex: "is_blocked",
      key: "is_blocked",
      render: (value: boolean) => (value ? t("table.yes") : t("table.no")),
    },
    {
      title: t("table.phone_verified"),
      dataIndex: "phone_verified",
      key: "phone_verified",
      render: (value: boolean) => (value ? t("table.yes") : t("table.no")),
    }
  ];

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-primary">
          {t("table.users")}
        </h1>
        <div className="bg-white dark:bg-theme-surface rounded-lg shadow p-4">
          <Table
            dataSource={users}
            columns={columns}
            pagination={{ pageSize: 10 }}
            className="antd-table-custom"
          />
        </div>
      </div>
    </MainLayout>
  );
};
