import type { Metadata } from 'next';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Price from '../components/pricetable'

export const metadata: Metadata = {
  title: 'DJ Pricing & Packages',
  description:
    'Simple, transparent DJ pricing for Chicago weddings and events. Compare MIXD Entertainment packages including professional DJ, MC services, ceremony sound, and lighting.',
  alternates: {
    canonical: '/pricing',
  },
};
export default function Page() {
  return (
    <div className="bg-white">
      <Navbar></Navbar>
      
      {/* Hero Section */}
      <div className="relative w-full h-[480px] overflow-hidden">
        <img
          src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751726915/IMG_8699_1_cmj2iz.jpg"
          alt="MIXD Entertainment Pricing"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Pricing
          </h1>
          <p className="text-lg font-normal max-w-2xl opacity-90">
            Transparent pricing packages to fit your event needs
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <Price></Price>
      
      <Footer></Footer>
    </div>
  );
}