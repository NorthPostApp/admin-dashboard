import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type TagBadgeProps = {
  value: string;
  onRemoveTag: () => void;
};

export default function TagBadge({ value, onRemoveTag }: TagBadgeProps) {
  return (
    <Badge asChild>
      <div className="flex gap-2 items-center h-6">
        <p>{value}</p>
        <div className="hover:cursor-pointer">
          <X width={14} onClick={onRemoveTag} />
        </div>
      </div>
    </Badge>
  );
}
