import { BookA, type LucideIcon } from "lucide-react";

interface Service {
  title: string;
  icon?: LucideIcon;
  contents: ServiceContent[];
}

interface ServiceContent {
  name: string;
  path: string;
}

export const SERVICE_CATALOG: Service[] = [
  {
    title: "Address Service",
    icon: BookA,
    contents: [
      { name: "Overview", path: "/addresses/overview" },
      { name: "View Addresses", path: "/addresses/view" },
      { name: "Address Requests", path: "/addresses/requests" },
      { name: "Create New Address", path: "/addresses/create" },
    ],
  },
];
