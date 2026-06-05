import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { cn, parseDate } from "@/lib/utils";
import type { AddressRequests } from "@/schemas/address-request";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useAddressRequestContext } from "@/hooks/useAddressRequestContext";

type RequestTableProps = {
  requests: AddressRequests | undefined;
};

const styles = {
  body: clsx("rounded-xl border overflow-hidden"),
  theadRow: clsx(
    "[&_th]:text-center [&_th:first-child]:pl-4 [&_th:last-child]:pr-4 [&_th:nth-child(-n+2)]:text-left bg-accent",
  ),
  rowID: clsx("truncate max-w-34"),
  tbodyRow: (highlight: boolean) =>
    cn(
      "[&_td]:text-center [&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_td:nth-child(-n+2)]:text-left hover:cursor-pointer",
      highlight && "bg-foreground/15",
    ),
};

export default function RequestsTable({ requests }: RequestTableProps) {
  const { t } = useTranslation("address:request");
  const { currentProcessing, updateCurrentProcessing } = useAddressRequestContext();

  return (
    <div className={styles.body}>
      <Table>
        <TableHeader>
          <TableRow className={styles.theadRow}>
            <TableHead>ID</TableHead>
            <TableHead>{t("table.content")}</TableHead>
            <TableHead>{t("table.createdAt")}</TableHead>
            <TableHead>{t("table.updatedAt")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests &&
            requests.map((request) => (
              <TableRow
                key={request.id}
                className={styles.tbodyRow(request.id === currentProcessing?.id)}
                onClick={() => updateCurrentProcessing(request)}
              >
                <TableCell className={styles.rowID}>{request.id}</TableCell>
                <TableCell>{request.content}</TableCell>
                <TableCell>{parseDate(request.createdAt)}</TableCell>
                <TableCell>{parseDate(request.updatedAt)}</TableCell>
                <TableCell>{t(`status.${request.status}`)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
