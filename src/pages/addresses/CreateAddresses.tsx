import { useAppContext } from "@/hooks/useAppContext";

export default function CreateAddresses() {
  const { language } = useAppContext();
  return <div>Create addresses for {language}</div>;
}
