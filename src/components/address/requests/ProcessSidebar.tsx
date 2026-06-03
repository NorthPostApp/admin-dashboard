import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn, parseDate } from "@/lib/utils";
import type { AddressRequest, AddressRequestStatus } from "@/schemas/address-request";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

type ProcessSidebarProps = {
  request: AddressRequest | undefined;
};

const getStatusColor = (status: AddressRequestStatus) => {
  switch (status) {
    case "pending":
      return "bg-chart-5";
    case "processing":
      return "bg-chart-4";
    case "failed":
      return "bg-chart-1";
    case "completed":
      return "bg-chart-2";
  }
};

const styles = {
  body: clsx("w-full h-full flex-col p-6 text-left"),
  inner: clsx("flex flex-col gap-6 text-sm"),
  meta: clsx("text-sm space-y-1 opacity-40"),
  subheader: clsx("flex justify-between items-center mb-1"),
  content: clsx("min-h-20 p-2 border rounded-md"),
  saveButton: clsx("text-xs rounded-full h-fit px-2 py-0"),
  status: (status: AddressRequestStatus) =>
    cn(
      "w-fit px-4 py-0.5 rounded-full text-sm text-secondary font-bold",
      getStatusColor(status),
    ),
};

export default function ProcessSidebar({ request }: ProcessSidebarProps) {
  const { t } = useTranslation("address:request");
  return (
    <div className={styles.body}>
      {!request && (
        <div className="opacity-50">
          <p>{t("sidebar.empty")}</p>
        </div>
      )}
      {request && (
        <div className={styles.inner}>
          <div className={styles.status(request.status)}>
            {t(`status.${request.status}`)}
          </div>
          <div>
            <div className={styles.meta}>
              <p>
                {t("sidebar.requestID")}: {request.id}
              </p>
              <p>
                {t("sidebar.requestBy")}: {request.requestBy}
              </p>
              <p>
                {t("sidebar.createdAt")}: {parseDate(request.createdAt)}
              </p>
              <p>
                {t("sidebar.updatedAt")}: {parseDate(request.updatedAt)}
              </p>
            </div>
          </div>
          <div>
            <div className={styles.subheader}>
              <h2>{t("sidebar.content")}</h2>
            </div>
            <p className={styles.content}>{request.content}</p>
          </div>
          <div>
            <div className={styles.subheader}>
              <h2>{t("sidebar.notes")}</h2>
              <Button variant="outline" className={styles.saveButton}>
                {t("sidebar.save")}
              </Button>
            </div>
            <Textarea className="focus-visible:ring-0 h-40 resize-none" />
          </div>
        </div>
      )}
    </div>
  );
}
