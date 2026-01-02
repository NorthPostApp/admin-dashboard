import { useAddressContext } from "@/hooks/useAddressContext";
import Timer from "./Timer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AddressCard from "@/components/address/AddressCard";
import { useIsMobile } from "@/hooks/use-mobile";

export default function GeneratedAddresses() {
  const isMobile = useIsMobile();
  const { generating, generatedAddresses } = useAddressContext();
  if (generating) {
    return <Timer label={"Generating address"} interval={25} />;
  }

  if (generatedAddresses.length !== 0) {
    return (
      <Carousel
        opts={{
          align: "start",
        }}
        orientation={isMobile ? "vertical" : "horizontal"}
        className="w-full max-w-[88%] mx-auto my-2"
      >
        <CarouselContent>
          {generatedAddresses.map((addressItem) => {
            return (
              <CarouselItem key={addressItem.id} className="basis-1/3">
                <AddressCard addressItem={addressItem} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  }

  return <></>;
}
