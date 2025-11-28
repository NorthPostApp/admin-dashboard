import { BookA, type LucideIcon } from "lucide-react";

interface Service {
  title: string;
  icon?: LucideIcon;
  contents: ServiceContent[];
}

interface ServiceContent {
  name: string;
}

export const SERVICE_CATALOG: Service[] = [
  {
    title: "Address Service",
    icon: BookA,
    contents: [
      { name: "View Addresses" },
      { name: "Address Requests" },
      { name: "Lookup & Create" },
    ],
  },
];
