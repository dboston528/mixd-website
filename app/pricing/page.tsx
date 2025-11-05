'use client'
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Price from '../components/pricetable'
export default function Page() {
  return (
    <div className="bg-white">
      <Navbar></Navbar>
      
      {/* Hero Section */}
      <div className="relative w-full h-96 overflow-hidden">
        <img
          src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751726915/IMG_8699_1_cmj2iz.jpg"
          alt="MIXD Entertainment Pricing"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Pricing
          </h1>
          <p className="mb-6 text-lg font-normal lg:text-xl sm:px-16 xl:px-48">
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