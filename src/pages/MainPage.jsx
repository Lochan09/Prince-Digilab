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

export default function MainPage({ onOpenLightbox, onGoToSection, onViewOrders }) {
  return (
    <main>
      <Hero            onGoToSection={onGoToSection} />
      <Ticker />
      <Catalog         onOpenLightbox={onOpenLightbox} />
      <WhySection />
      <CustomersSection />
      <ServicesSection />
      <OrderSection    onViewOrders={onViewOrders} />
      <ContactSection />
      <ReviewStrip />
      <Footer />
    </main>
  );
}
