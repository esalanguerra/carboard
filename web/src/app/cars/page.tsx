import { JSX } from "react";
import SectionCars from "./components/section-cars";
import LayoutDefault from "@/src/components/layout/default";

export default function Page(): JSX.Element {
  return (
    <LayoutDefault>
      <SectionCars />
    </LayoutDefault>
  );
}
