import { useAppContext } from "@/hooks/useAppContext";

export default function ViewAddresses() {
  const { language } = useAppContext();
  return <div>View addresses for {language}</div>;
}
