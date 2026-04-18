import { useTranslation } from "react-i18next";
import { useLoaderData, useRevalidator } from "react-router";
import { RefreshCcw } from "lucide-react";
import type { TypesenseInfoSchema } from "@/schemas/typesense";
import Subheader from "@/pages/Subheader";
import TypesenseInfoCard from "@/components/address/overview/TypesenseInfoCard";
import { Button } from "@/components/ui/button";
import "./AddressPage.css";

export default function Overview() {
  const { t } = useTranslation("address:overview");
  const typesenseSystemInfo = useLoaderData<TypesenseInfoSchema>();
  const { revalidate } = useRevalidator();
  return (
    <div className="body">
      <Subheader
        title={t("title")}
        sideComponent={
          <Button onClick={revalidate} variant="ghost" size="icon-lg">
            <RefreshCcw />
          </Button>
        }
      ></Subheader>
      <div className="address-view">
        <div className="address-content__body__unbound">
          <div className="px-6 flex flex-wrap gap-3">
            <TypesenseInfoCard systemInfo={typesenseSystemInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}
