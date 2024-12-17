import { JSX } from "react";
import SectionCars from "./components/section-cars";
import LayoutDefault from "@/src/components/layout/default";
import Footer from "@/src/components/layout/footer";

export default function Page(): JSX.Element {
  return (
    <LayoutDefault>
      <SectionCars />
      <Footer />
    </LayoutDefault>
  );
}
