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

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block mb-3 text-sm font-semibold uppercase tracking-widest text-teal-600">
            Why MIXD
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 md:text-5xl">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-500 mb-14 max-w-2xl mx-auto">
            We don't just play music — we create moments that last a lifetime.
          </p>
          <div className="grid gap-8 md:grid-cols-3 text-left">
            {[
              {
                title: 'Seasoned DJs',
                copy: 'Hundreds of weddings, mitzvahs, and galas give us the instincts to read any crowd.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                  </svg>
                ),
              },
              {
                title: 'White-Glove Service',
                copy: 'From planning calls to showtime, our team handles every detail with polish.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                ),
              },
              {
                title: 'Client-First Approach',
                copy: 'We build playlists with you so the soundtrack feels personal and unforgettable.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
              },
            ].map(({ title, copy, icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  {icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <a
              href="https://www.honeybook.com/widget/mixd_chicago_271581/cf_id/65c528b2b9e21200253deb54"
              className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors duration-200 shadow-sm"
            >
              Request Pricing
              <svg className="w-3.5 h-3.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </main>
  );
}
