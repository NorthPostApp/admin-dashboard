// import { useAppContext } from "@/hooks/useAppContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CreateAddressesManual from "@/pages/addresses/CreateAddressManual";

export default function CreateAddresses() {
  // const { language } = useAppContext();
  return (
    <Tabs defaultValue="manual" className="h-full">
      <TabsList className="mx-auto w-64">
        <TabsTrigger value="prompt">Prompt</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="prompt">Create with prompt</TabsContent>
      <TabsContent value="manual" className="flex justify-center">
        <CreateAddressesManual />
      </TabsContent>
    </Tabs>
  );
}
