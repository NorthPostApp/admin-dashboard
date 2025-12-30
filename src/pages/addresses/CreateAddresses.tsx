import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CreateAddressesManual from "@/pages/addresses/CreateAddressManual";
import CreateAddressPrompt from "@/pages/addresses/CreateAddressPrompt";
import "./AddressPage.css";

export default function CreateAddresses() {
  const { t } = useTranslation("address:newAddress");

  // using url hash to navigate between tabs
  const location = useLocation();
  const navigate = useNavigate();
  const hash = location.hash.replace("#", "");
  const activeTab = hash === "manual" ? "manual" : "prompt";
  const handleHashChange = (value: string) => {
    navigate({ hash: value });
  };

  return (
    <Tabs
      defaultValue={activeTab}
      className="address-tab"
      onValueChange={handleHashChange}
    >
      <TabsList className="address-tab__list">
        <TabsTrigger value="prompt">{t("tabs.prompt")}</TabsTrigger>
        <TabsTrigger value="manual">{t("tabs.manual")}</TabsTrigger>
      </TabsList>
      <TabsContent value="prompt" className="address-create">
        <CreateAddressPrompt />
      </TabsContent>
      <TabsContent value="manual" className="address-create">
        <CreateAddressesManual />
      </TabsContent>
    </Tabs>
  );
}
