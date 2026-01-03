import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import "./Address.css";

type TagBadgeProps = {
  value: string;
  onRemoveTag?: () => void;
};

export default function TagBadge({ value, onRemoveTag }: TagBadgeProps) {
  return (
    <Badge asChild>
      <div className="address-component__tag">
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
