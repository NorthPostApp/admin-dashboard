import { useGetAllAddressesQuery } from "@/hooks/queries/useGetAllAddressesQuery";
import { useAppContext } from "@/hooks/useAppContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Subheader from "../Subheader";
import AddressCard from "@/components/address/AddressCard";
import "./AddressPage.css";
import { toast } from "sonner";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";

export default function ViewAddresses() {
  const { t } = useTranslation("address:viewAddress");
  const { language } = useAppContext();
  const { isFetching, refetch } = useGetAllAddressesQuery(language);
  const { addressData, refreshAddressData } = useAddressDataContext();

  // initial loading
  useEffect(() => {
    if (!addressData || language != addressData.language) {
      refetch().then((result) => {
        if (result.data) {
          refreshAddressData(result.data);
        } else if (result.error) {
          toast.error("failed to fetch data, please check your internet on account");
        }
      });
    }
  }, [refetch, refreshAddressData, addressData, language]);

  return (
    <div className="address-body">
      <Subheader title={t("title")}>
        <div>filters</div>
      </Subheader>
      <div className="address-view">
        <div className="address-content__body__unbound">
          {isFetching && <div>Loading</div>}
          {!isFetching && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {addressData?.addresses.map((address) => (
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
