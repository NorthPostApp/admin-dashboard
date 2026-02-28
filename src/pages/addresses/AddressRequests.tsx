import { useTranslation } from "react-i18next";
import Subheader from "@/pages/Subheader";

export default function AddressRequests() {
  const { t } = useTranslation("address:request");
  return (
    <div className="address-body">
      <Subheader title={t("title")}></Subheader>
    </div>
  );
}
