import { BookA, type LucideIcon } from "lucide-react";

interface Service {
  titleKey: string;
  icon?: LucideIcon;
  contents: ServiceContent[];
}

interface ServiceContent {
  i18nKey: string;
  path: string;
}

export const SERVICE_CATALOG: Service[] = [
  {
    titleKey: "addressService",
    icon: BookA,
    contents: [
      { i18nKey: "overview", path: "/addresses/overview" },
      { i18nKey: "viewAddresses", path: "/addresses/view" },
      { i18nKey: "addressRequests", path: "/addresses/requests" },
      { i18nKey: "newAddress", path: "/addresses/create" },
    ],
  },
];
