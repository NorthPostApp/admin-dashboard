import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type TagBadgeProps = {
  value: string;
  onRemoveTag?: () => void;
};

export default function TagBadge({ value, onRemoveTag }: TagBadgeProps) {
  return (
    <Badge asChild>
      <div className="flex gap-2 items-center h-5 bg-primary/80">
        <p>{value}</p>
        {onRemoveTag && (
          <div className="hover:cursor-pointer">
            <X width={14} onClick={onRemoveTag} data-testid="badge-delete-icon" />
          </div>
        )}
      </div>
    </Badge>
  );
}
