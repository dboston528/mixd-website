'use client'
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import HoneyBookForm from '../components/honeybookform';

export default function Page() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[480px] overflow-hidden">
        <img
          src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751943492/IMG_0966_2_wlq7ec.jpg"
          alt="Contact MIXD Entertainment"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="text-lg font-normal max-w-2xl opacity-90">
            Ready to make your event unforgettable? Let's talk.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block mb-3 text-sm font-semibold uppercase tracking-widest text-teal-600">
              Get in Touch
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 md:text-5xl">
              Request Pricing
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Fill out the form below and we'll get back to you with availability and pricing for your event.
            </p>
          </div>
          <HoneyBookForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}
