"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, DarkThemeToggle, Flowbite } from "flowbite-react";
import Footer from "../app/components/footer";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <main className="flex  flex-col  justify-between">
      <Navbar />

      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source
            src="https://res.cloudinary.com/he5g3ml0o/video/upload/so_0,eo_10/IMG_6550_emusxs.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            You’ve got enough to worry about — music shouldn’t be one of them.
          </h1>
          <p className="mb-6 text-lg font-normal lg:text-xl sm:px-16 xl:px-48">
            MIXD Entertainment delivers professional DJ services with flawless
            timing and unforgettable vibes. With 15+ years of experience, we
            keep your event flowing and your guests dancing.
          </p>
          <a
            href="https://www.honeybook.com/widget/mixd_chicago_271581/cf_id/65c528b2b9e21200253deb54"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            Request Pricing
            <svg
              className="w-3.5 h-3.5 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </div>
      {/* Services Section */}

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center md:text-5xl lg:text-6xl mb-8 text-gray-900 dark:text-white">
            Our Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Weddings */}
            <Link href="/weddings" className="relative block rounded-xl overflow-hidden group">
              <img
                src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751726915/IMG_8699_1_cmj2iz.jpg"
                alt="Weddings"
                className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition duration-500"></div>
              <h3 className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">
                Weddings
              </h3>
            </Link>

            {/* Private Events */}
            <Link href="/private-events" className="relative block rounded-xl overflow-hidden group">
              <img
                src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751943492/IMG_0966_2_wlq7ec.jpg"
                alt="Private Events"
                className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition duration-500"></div>
              <h3 className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">
                Private Events
              </h3>
            </Link>

            {/* Schools */}
            <Link href="/schools" className="relative block rounded-xl overflow-hidden group">
              <img
                src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751861791/school_thumbnail_wtevmr.jpg"
                alt="Schools"
                className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition duration-500"></div>
              <h3 className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">
                Schools
              </h3>
            </Link>

            {/* Mitzvah's */}
            <Link href="/mitzvahs" className="relative block rounded-xl overflow-hidden group">
              <img
                src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751944013/IMG_0B3FFFD98443-1_aut1ug.jpg"
                alt="Mitzvah's"
                className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition duration-500"></div>
              <h3 className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">
                Mitzvah's
              </h3>
            </Link>
          </div>
        </div>
      </section>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2 max-w-7xl mx-auto justify-items-center">
        <Card
          className="min-h-[28rem] w-full max-w-[28rem] flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1743550455435-7a635c585ceb?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="font-extrabold text-white">Weddings </h1>
        </Card>
        <Card className="min-h-[28rem] w-full flex items-center justify-center">
          <h1 className="font-extrabold text-black">Private Events </h1>
        </Card>
        <Card className="min-h-[28rem] w-full flex items-center justify-center">
          <h1 className="font-extrabold text-black">Schools </h1>
        </Card>
        <Card className="min-h-[28rem] w-full flex items-center justify-center">
          <h1 className="font-extrabold text-black">Mitzvah's </h1>
        </Card>
      </div> */}

      <div className="hero-image text-center">
        <h1 className="p-10 mb-4 text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl lg:text-6xl">
          Why Choose Us?
        </h1>
        <ol className="mb-6 text-lg font-normal text-gray-100 lg:text-xl sm:px-16 xl:px-48 dark:text-white list-disc">
          <li className="p-3">
            Experience: With years of experience in the industry, we know how to
            keep the dance floor packed and the energy high.
          </li>
          <li className="p-3">
            Professionalism: From our initial consultation to the last song of
            the night, you can count on us to be reliable, punctual, and
            professional.
          </li>
          <li className="p-3">
            Client Satisfaction: Our number one priority is making sure that you
            and your guests have an unforgettable experience. We'll work closely
            with you to understand your vision and bring it to life.
          </li>
        </ol>
        <a
          href="https://www.honeybook.com/widget/mixd_chicago_271581/cf_id/65c528b2b9e21200253deb54"
          className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-teal-600 rounded-lg hover:bg-teal-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
        >
          Request Pricing
          <svg
            className="w-3.5 h-3.5 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </div>
      <Footer></Footer>
    </main>
  );
}
