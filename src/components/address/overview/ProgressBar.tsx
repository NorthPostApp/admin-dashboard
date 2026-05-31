import { Progress } from "@/components/ui/progress";

const styles = {
  body: "flex gap-1 max-w-70 w-full text-xs",
  progressWrapper: "w-full relative",
  progress: "h-4 bg-primary/30",
  bodyLabel:
    "absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-background font-bold",
  label: "w-26 text-right",
};

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
    <div className={styles.body}>
      <div className={styles.progressWrapper}>
        <Progress value={value} className={styles.progress} />
        {bodyLabel && <p className={styles.bodyLabel}>{bodyLabel}</p>}
      </div>
      {label && <p className={styles.label}>{label}</p>}
    </div>
  );
}
