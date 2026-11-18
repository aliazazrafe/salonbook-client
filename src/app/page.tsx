import Hero from "@/components/Hero";
import FeaturedServices from "@/components/FeaturedServices";
import ServiceCategories from "@/components/ServiceCategories";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/layout/Footer";
export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </main>
  );
}