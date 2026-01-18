// import { useGetAllAddressesQuery } from "@/hooks/queries/useGetAllAddressesQuery";
import { useAppContext } from "@/hooks/useAppContext";
// import { useEffect } from "react";

export default function ViewAddresses() {
  const { language } = useAppContext();
  // const { data, isPending, refetch } = useGetAllAddressesQuery(language, ["俄罗斯帝国"]);
  // console.log(isPending, data);
  // useEffect(() => {
  //   refetch();
  // }, [refetch]);
  return <div>View addresses for {language}</div>;
}
