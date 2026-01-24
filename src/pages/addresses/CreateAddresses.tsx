import { Activity } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router";
import CreateAddressesManual from "@/pages/addresses/CreateAddressManual";
import CreateAddressPrompt from "@/pages/addresses/CreateAddressPrompt";
import Subheader from "@/pages/Subheader";
import TabsTrigger, { type TabOption } from "@/components/ui/tabs-trigger";
import "./AddressPage.css";

type AddressCreationTab = "prompt" | "manual";

export default function CreateAddresses() {
  const { t } = useTranslation("address:newAddress");

  // using url hash to navigate between tabs
  const location = useLocation();
  const navigate = useNavigate();
  const hash = location.hash.replace("#", "");
  const activeTab: AddressCreationTab = hash === "manual" ? "manual" : "prompt";

  const handleHashChange = (value: AddressCreationTab) => {
    navigate({ hash: value });
  };

  const tabs: TabOption[] = [
    {
      id: "prompt",
      title: t("tabs.prompt"),
      action: () => handleHashChange("prompt"),
    },
    {
      id: "manual",
      title: t("tabs.manual"),
      action: () => handleHashChange("manual"),
    },
  ];

  return (
    <div className="address-body">
      <Subheader title={t("title")}>
        <TabsTrigger tabOptions={tabs} activeTab={activeTab} />
      </Subheader>
      <Activity mode={activeTab === "prompt" ? "visible" : "hidden"}>
        <CreateAddressPrompt />
      </Activity>
      <Activity mode={activeTab === "manual" ? "visible" : "hidden"}>
        <CreateAddressesManual />
      </Activity>
    </div>
  );
}
