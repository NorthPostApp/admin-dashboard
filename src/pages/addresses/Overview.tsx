import { useTranslation } from "react-i18next";
import Subheader from "@/pages/Subheader";

export default function Overview() {
  const { t } = useTranslation("address:overview");
  return (
    <div className="address-body">
      <Subheader title={t("title")}></Subheader>
    </div>
  );
}
