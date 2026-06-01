import { useTranslation } from "react-i18next";
import Subheader from "@/pages/Subheader";
// import { useGetAddressRequestQuery } from "@/hooks/queries/useGetAddressRequestsQuery";

export default function AddressRequests() {
  const { t } = useTranslation("address:request");
  // const { data } = useGetAddressRequestQuery("ZH", "pending");
  return (
    <div className="body">
      <Subheader title={t("title")}></Subheader>
    </div>
  );
}
