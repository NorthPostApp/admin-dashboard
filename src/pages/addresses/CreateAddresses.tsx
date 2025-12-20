import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CreateAddressesManual from "@/pages/addresses/CreateAddressManual";
import "./AddressPage.css";

export default function CreateAddresses() {
  const { t } = useTranslation("address:newAddress");
  return (
    <Tabs defaultValue="manual" className="address-tab">
      <TabsList className="address-tab__list">
        <TabsTrigger value="prompt">{t("tabs.prompt")}</TabsTrigger>
        <TabsTrigger value="manual">{t("tabs.manual")}</TabsTrigger>
      </TabsList>
      <TabsContent value="prompt">Create with prompt</TabsContent>
      <TabsContent value="manual" className="address-content__manual">
        <CreateAddressesManual />
      </TabsContent>
    </Tabs>
  );
}
