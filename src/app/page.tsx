import SpecialOfferBanner from "@/components/SpecialOfferBanner";
import Hero from "@/components/Hero";

import FeaturedServices from "@/components/FeaturedServices";
import ServiceCategories from "@/components/ServiceCategories";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
export default function Home() {
  return (
    <main>
      
      <Hero />
      <SpecialOfferBanner />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseUs />
      <Testimonials />
    </main>
  );
}


