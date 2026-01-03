import { useAddressContext } from "@/hooks/useAddressContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Timer from "@/components/address/Timer";
import AddressCard from "@/components/address/AddressCard";
import GeneratedAddressActions from "@/components/address/GeneratedAddressActions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslation } from "react-i18next";

export default function GeneratedAddresses() {
  const isMobile = useIsMobile();
  const { generating, generatedAddresses } = useAddressContext();
  const { t } = useTranslation("address:newAddress");

  if (generating) {
    return <Timer label={t("prompt.state.generating")} interval={25} />;
  }

  if (generatedAddresses.length !== 0) {
    return (
      <Carousel
        opts={{
          align: "start",
        }}
        orientation={isMobile ? "vertical" : "horizontal"}
        className={cn("w-full mx-auto my-2", !isMobile && "max-w-[88%]")}
      >
        <CarouselContent className="mb-2">
          {generatedAddresses.map((addressItem) => {
            return (
              <CarouselItem key={addressItem.id} className="basis-1/3">
                <AddressCard
                  addressItem={addressItem}
                  actions={<GeneratedAddressActions addressItem={addressItem} />}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {!isMobile && (
          <>
            <CarouselPrevious type="button" />
            <CarouselNext type="button" />
          </>
        )}
      </Carousel>
    );
  }

  return <></>;
}
