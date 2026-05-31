import clsx from "clsx";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type TagBadgeProps = {
  value: string;
  onRemoveTag?: () => void;
};

const styles = {
  body: clsx("flex gap-2 items-center h-5 bg-primary/80"),
  removeButton: clsx("hover:cursor-pointer"),
};

export default function TagBadge({ value, onRemoveTag }: TagBadgeProps) {
  return (
    <Badge asChild>
      <div className={styles.body}>
        <p>{value}</p>
        {onRemoveTag && (
          <div className={styles.removeButton}>
            <X width={14} onClick={onRemoveTag} data-testid="badge-delete-icon" />
          </div>
        )}
      </div>
    </Badge>
  );
}
