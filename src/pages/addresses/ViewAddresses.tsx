import { useGetAllAddressesQuery } from "@/hooks/queries/useGetAllAddressesQuery";
import { useAppContext } from "@/hooks/useAppContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Subheader from "../Subheader";
import AddressCard from "@/components/address/AddressCard";
import "./AddressPage.css";

export default function ViewAddresses() {
  const { t } = useTranslation("address:viewAddress");
  const { language } = useAppContext();
  const { data, isFetching, refetch } = useGetAllAddressesQuery(language);
  useEffect(() => {
    refetch();
  }, [refetch, language]);
  return (
    <div className="address-body">
      <Subheader title={t("title")}>
        <div>filters</div>
      </Subheader>
      <div className="address-view">
        <div className="address-content__body">
          {isFetching && <div>Loading</div>}
          {!isFetching && (
            <div className="grid grid-cols-3 gap-5">
              {data?.addresses.map((address) => (
                <div key={address.id}>
                  <AddressCard addressItem={address} actions={[]} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
