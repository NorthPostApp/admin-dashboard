import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CreateAddressesManual from "@/pages/addresses/CreateAddressManual";
import "./AddressPage.css";
import CreateAddressPrompt from "./CreateAddressPrompt";

export default function CreateAddresses() {
  const { t } = useTranslation("address:newAddress");
  return (
    <Tabs defaultValue="prompt" className="address-tab">
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
