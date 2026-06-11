import type { Metadata } from 'next';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export const metadata: Metadata = {
  title: 'DJ & Event Services',
  description:
    'Explore MIXD Entertainment services: professional DJs, lighting, photo booths, weddings, and private parties across Chicago.',
  alternates: {
    canonical: '/services',
  },
};

const services = ['Lighting', 'Private Parties', 'Photo Booths', 'Weddings'];

export default function Page() {
  return (
    <div>
      <Navbar></Navbar>
      <h1 className="pt-5 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Services</h1>
      <h2 className="">Here's a list of services that we provide! </h2>
      {services.map((service) => (
        <div
          key={service}
          className="max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-md"
        >
          <h5>{service}</h5>
        </div>
      ))}
      <Footer></Footer>
    </div>
  );
}
