import { useState, useEffect } from "react";
import { Spinner } from "../ui/spinner";

type TimerProps = {
  label: string;
  interval: number; // in milliseconds
};

let timeout: number;

export default function Timer({ label, interval }: TimerProps) {
  const [timer, setTimer] = useState<number>(0);
  useEffect(() => {
    if (timeout) {
      clearInterval(timeout);
    }
    timeout = setInterval(() => {
      setTimer((prev) => prev + interval);
    }, interval);
    return () => {
      clearInterval(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex items-center justify-between w-full max-w-70 h-12 text-primary/50 text-sm mx-auto">
      <div className="flex justify-center items-center gap-3">
        <Spinner />
        <p>{label + ".".repeat(Math.floor(timer / 500) % 4)}</p>
      </div>
      <p>{(timer / 1000).toFixed(2)}s</p>
    </div>
  );
}
