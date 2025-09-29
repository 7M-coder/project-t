import MainLayout from "@/modules/core/layouts/MainLayout";
import { useTranslation } from "react-i18next";
import UpdateUserInfoForm from "../components/UpdateUserInfoForm";

const ChangeInfoPage: React.FC = () => {
  const { t } = useTranslation("users");
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4 text-primary">
        {t("change_user_info.title")}
      </h1>
      <UpdateUserInfoForm />
    </MainLayout>
  );
};
export default ChangeInfoPage;
