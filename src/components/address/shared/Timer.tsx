import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Spinner } from "@/components/ui/spinner";

type TimerProps = {
  label: string;
  interval: number; // in milliseconds
};

const styles = {
  body: clsx(
    "flex items-center justify-between w-full max-w-70 h-12 text-primary/50 text-sm mx-auto",
  ),
  content: clsx("flex justify-center items-center gap-3"),
};

export default function Timer({ label, interval }: TimerProps) {
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<number>(null);
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + interval);
    }, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.body}>
      <div className={styles.content}>
        <Spinner />
        <p>{label + ".".repeat(Math.floor(timer / 500) % 4)}</p>
      </div>
      <p>{(timer / 1000).toFixed(2)}s</p>
    </div>
  );
}
