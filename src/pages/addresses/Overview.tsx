import { useAppContext } from "@/hooks/useAppContext";

export default function Overview() {
  const { language } = useAppContext();
  return <div>Overview for {language}</div>;
}
