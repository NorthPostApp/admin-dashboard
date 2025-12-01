import { useAppContext } from "@/hooks/useAppContext";

export default function AddressRequests() {
  const { language } = useAppContext();
  return <div>Address requests for {language}</div>;
}
