import Hero from "@/components/Hero";
import FeaturedServices from "@/components/FeaturedServices";
import ServiceCategories from "@/components/ServiceCategories";
import WhyChooseUs from "@/components/WhyChooseUs";
export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseUs />
    </main>
  );
}