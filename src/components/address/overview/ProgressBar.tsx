import { Progress } from "@/components/ui/progress";

export default function ProgressBar({
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
      {label && <p className="w-26 text-right">{label}</p>}
    </div>
  );
}
