import type { TypesenseInfoSchema } from "@/schemas/typesense";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getPercentage, parseBytes } from "@/lib/utils";
import ProgressBar from "@/components/address/overview/ProgressBar";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSyncTypesenseMutation } from "@/hooks/mutations/useSyncTypesenseMutation";

type TypesenseInfoProps = {
  systemInfo: TypesenseInfoSchema;
};

const styles = {
  card: "w-md h-fit gap-3",
  title: "w-full flex items-center justify-between",
  healthIndicator: "w-2.5 h-2.5 rounded-full animate-pulse",
  content: "flex flex-col gap-3 px-1",
  infoRow: "w-full flex justify-between items-center text-sm",
  network: "flex gap-4 items-center text-xs",
  networkItem: "flex items-center gap-1",
  button: "h-8 mt-2",
};

export default function TypesenseInfoCard({ systemInfo }: TypesenseInfoProps) {
  const { t } = useTranslation("address:overview");
  const { mutate, isPending } = useSyncTypesenseMutation();
  const {
    health,
    systemCpuActivePercentage,
    systemDiskTotalBytes,
    systemDiskUsedBytes,
    systemMemoryTotalBytes,
    systemMemoryUsedBytes,
    systemNetworkSentBytes,
    systemNetworkReceivedBytes,
  } = systemInfo;
  return (
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle>
          <div className={styles.title}>
            <p>{t("typesense.title")}</p>
            <span
              className={cn(styles.healthIndicator, health ? "bg-chart-2" : "bg-chart-1")}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.content}>
          <div className={styles.infoRow}>
            <p>{t("typesense.cpu")}</p>
            <ProgressBar
              value={systemCpuActivePercentage}
              bodyLabel={`${systemCpuActivePercentage}%`}
            />
          </div>
          <div className={styles.infoRow}>
            <p>{t("typesense.disk")}:</p>
            <ProgressBar
              value={getPercentage(systemDiskUsedBytes, systemDiskTotalBytes) * 100}
              bodyLabel={`${parseBytes(systemDiskUsedBytes)}`}
              label={`${parseBytes(systemDiskTotalBytes)}`}
            />
          </div>
          <div className={styles.infoRow}>
            <p>{t("typesense.memory")}:</p>
            <ProgressBar
              value={getPercentage(systemMemoryUsedBytes, systemMemoryTotalBytes) * 100}
              bodyLabel={`${parseBytes(systemMemoryUsedBytes)}`}
              label={`${parseBytes(systemMemoryTotalBytes)}`}
            />
          </div>
          <div className={styles.infoRow}>
            <p>{t("typesense.network")}:</p>
            <div className={styles.network}>
              <div className={styles.networkItem}>
                <ArrowUp size={16} />
                <p>{parseBytes(systemNetworkSentBytes)}</p>
              </div>
              <div className={styles.networkItem}>
                <ArrowDown size={16} />
                <p>{parseBytes(systemNetworkReceivedBytes)}</p>
              </div>
            </div>
          </div>
          <Button
            className={styles.button}
            variant="outline"
            disabled={isPending}
            onClick={() => mutate()}
          >
            {isPending ? t("typesense.syncing") : t("typesense.sync")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
