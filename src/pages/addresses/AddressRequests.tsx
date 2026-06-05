import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ListFilter } from "lucide-react";
import clsx from "clsx";
import Subheader from "@/pages/Subheader";
import { useLocation, useNavigate } from "react-router";
import {
  ADDRESS_REQUEST_STATUS,
  type AddressRequestStatus,
} from "@/schemas/address-request";
import { useGetAddressRequestQuery } from "@/hooks/queries/useGetAddressRequestsQuery";
import { useAppContext } from "@/hooks/useAppContext";
import TabsTrigger, { type TabOption } from "@/components/ui/tabs-trigger";
import { Button } from "@/components/ui/button";
import RequestsTable from "@/components/address/requests/RequestsTable";
import ProcessSidebar from "@/components/address/requests/ProcessSidebar";

const styles = {
  container: clsx("w-full h-full flex overflow-hidden"),
  table: clsx("flex-1 p-6"),
  sidebar: clsx("w-[30%] min-w-70 border-l"),
};

export default function AddressRequests() {
  const { t } = useTranslation("address:request");
  const { language } = useAppContext();
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const toggleShowSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  // tab control
  const navigate = useNavigate();
  const location = useLocation();
  const handleHashChange = (value: AddressRequestStatus) => {
    navigate({ hash: value });
  };
  const hash = location.hash.replace("#", "");
  const activeTab = hash.length > 0 ? hash : ADDRESS_REQUEST_STATUS[0];

  // get request query
  const { data: requests } = useGetAddressRequestQuery(
    language,
    activeTab as AddressRequestStatus,
  );
  const tabs: TabOption[] = ADDRESS_REQUEST_STATUS.map((status) => ({
    id: status,
    title: t(`status.${status}`),
    action: () => handleHashChange(status),
  }));

  return (
    <div className="body">
      <Subheader
        title={t("title")}
        centralComponent={<TabsTrigger tabOptions={tabs} activeTab={activeTab} />}
        sideComponent={
          <Button onClick={toggleShowSidebar} variant="ghost" size="icon-sm">
            <ListFilter width={20} />
          </Button>
        }
      ></Subheader>
      <div className={styles.container}>
        <div className={styles.table}>
          <RequestsTable requests={requests} />
        </div>
        {showSidebar && (
          <div className={styles.sidebar}>
            <ProcessSidebar />
          </div>
        )}
      </div>
    </div>
  );
}
