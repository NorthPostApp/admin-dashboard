import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGetAllAddressesQuery } from "@/hooks/queries/useGetAllAddressesQuery";
import { useAppContext } from "@/hooks/useAppContext";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";
import Subheader from "@/pages/Subheader";
import "./AddressPage.css";
import PaginatedAddresses from "@/components/address/PaginatedAddresses";
import PaginationBar from "@/components/address/PaginationBar";

export default function ViewAddresses() {
  const { t } = useTranslation("address:viewAddress");
  const { language } = useAppContext();
  const { isFetching, refetch } = useGetAllAddressesQuery(language);
  const { totalPages, currentPage, addressData, refreshAddressData, selectPage } =
    useAddressDataContext();

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
            <PaginatedAddresses
              currentPage={currentPage}
              addresses={addressData?.addresses || []}
            />
          )}
          {addressData && (
            <PaginationBar
              totalPages={totalPages}
              currPage={currentPage}
              hasMore={addressData?.hasMore}
              selectPageAction={selectPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
