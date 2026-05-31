import { useTranslation } from "react-i18next";
import { useLoaderData, useRevalidator } from "react-router";
import { RefreshCcw } from "lucide-react";
import clsx from "clsx";
import type { TypesenseInfoSchema } from "@/schemas/typesense";
import Subheader from "@/pages/Subheader";
import TypesenseInfoCard from "@/components/address/overview/TypesenseInfoCard";
import { Button } from "@/components/ui/button";

const styles = {
  view: clsx("flex-1 flex justify-center overflow-y-auto"),
  contentBody: clsx("flex flex-col justify-between w-full max-h-full text-left pt-6"),
  cardGrid: clsx("px-6 flex flex-wrap gap-3"),
};

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
      <div className={styles.view}>
        <div className={styles.contentBody}>
          <div className={styles.cardGrid}>
            <TypesenseInfoCard systemInfo={typesenseSystemInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}
