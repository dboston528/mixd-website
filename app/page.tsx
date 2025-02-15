"use client";
import Image from "next/image";
import Link from "next/link";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import Footer from "../app/components/footer";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <main className="flex  flex-col  justify-between">
      <Navbar />
      <div className="hero-image text-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-100 md:text-5xl lg:text-6xl dark:text-white">
          Let us DJ your next event.
        </h1>
        <p className="mb-6 text-lg font-normal text-gray-100 lg:text-xl sm:px-16 xl:px-48 dark:text-white">
          Here at MIXD Entertianment we provide professional Dj services & more.
          With over 15 years of experience there is no need for you to worry
          about music for your event.
        </p>
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

      <div className="text-center bg-white">
        <h1
          className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-black
 md:text-5xl lg:text-6xl dark:text-white bg-white p-10"
        >
          Our Services
        </h1>
      </div>

      <div className=" text-center bg-white">
        <ul className="mb-6 text-lg font-normal text-black lg:text-xl sm:px-16 xl:px-48 dark:text-white list-disc">
          <li className="p-3">
            Professional DJs: Our talented DJs are experienced in a wide range
            of music genres and will tailor the playlist to suit your event
            perfectly.
          </li>
          <li className="p-3">
            State-of-the-Art Equipment: We use top-of-the-line sound and
            lighting equipment to ensure that your event looks and sounds
            amazing.
          </li>
          <li className="p-3">
            Customizable Packages: Whether you're planning a wedding, corporate
            event, or private party, we have packages to suit every need and
            budget.
          </li>
        </ul>
      </div>

      <div className="text-center bg-white">
        <h1 className="p-10 mb-4 text-4xl font-extrabold leading-none tracking-tight text-black md:text-5xl lg:text-6xl dark:text-white">
          Why Choose Us?
        </h1>
      </div>

      <div className="hero-image text-center">
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
