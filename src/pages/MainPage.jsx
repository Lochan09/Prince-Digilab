import {
  Hero,
  Ticker,
  Catalog,
  WhySection,
  ServicesSection,
  CustomersSection,
  ReviewStrip,
  OrderSection,
  ContactSection,
} from '../components/sections';

import { Footer } from '../components/layout';

export default function MainPage({ onOpenLightbox, onGoToSection }) {
  return (
    <main>
      <Hero            onGoToSection={onGoToSection} />
      <Ticker />
      <Catalog         onOpenLightbox={onOpenLightbox} />
      <WhySection />
      <ServicesSection />
      <CustomersSection />
      <ReviewStrip />
      <OrderSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
