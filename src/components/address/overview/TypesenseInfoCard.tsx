import type { TypesenseInfoSchema } from "@/schemas/typesense";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { cn, getPercentage, parseBytes } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../Address.css";

type TypesenseInfoProps = {
  systemInfo: TypesenseInfoSchema;
};

export default function TypesenseInfoCard({ systemInfo }: TypesenseInfoProps) {
  const { t } = useTranslation("address:overview");
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
    <Card className="w-md h-fit gap-3">
      <CardHeader>
        <CardTitle>
          <div className="w-full flex items-center justify-between">
            <p>{t("typesense.title")}</p>
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-full animate-pulse",
                health ? "bg-chart-2" : "bg-chart-1",
              )}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col text-sm gap-2">
          <div className="address-component__info__row">
            <p>{t("typesense.cpu")}</p>
            <ProgressBar
              value={systemCpuActivePercentage}
              bodyLabel={`${systemCpuActivePercentage}%`}
            />
          </div>
          <div className="address-component__info__row">
            <p>{t("typesense.disk")}:</p>
            <ProgressBar
              value={getPercentage(systemDiskUsedBytes, systemDiskTotalBytes) * 100}
              bodyLabel={`${parseBytes(systemDiskUsedBytes)}`}
              label={`${parseBytes(systemDiskTotalBytes)}`}
            />
          </div>
          <div className="address-component__info__row">
            <p>{t("typesense.memory")}:</p>
            <ProgressBar
              value={getPercentage(systemMemoryUsedBytes, systemMemoryTotalBytes) * 100}
              bodyLabel={`${parseBytes(systemMemoryUsedBytes)}`}
              label={`${parseBytes(systemMemoryTotalBytes)}`}
            />
          </div>
          <div className="address-component__info__row">
            <p>{t("typesense.network")}:</p>
            <div className="flex gap-4 items-center text-xs">
              <div className="flex items-center gap-1">
                <ArrowUp size={16} />
                <p>{parseBytes(systemNetworkSentBytes)}</p>
              </div>
              <div className="flex items-center gap-1">
                <ArrowDown size={16} />
                <p>{parseBytes(systemNetworkReceivedBytes)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProgressBar({
  value,
  bodyLabel,
  label,
}: {
  value: number;
  bodyLabel?: string;
  label?: string;
}) {
  return (
    <div className="flex gap-1 max-w-70 w-full text-xs">
      <div className="w-full relative">
        <Progress value={value} className="h-4 bg-primary/30" />
        {bodyLabel && (
          <p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-background font-bold">
            {bodyLabel}
          </p>
        )}
      </div>
      {label && <p className="w-20 text-right">{label}</p>}
    </div>
  );
}
