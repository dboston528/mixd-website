'use client'
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Card } from 'flowbite-react';

export default function Page() {
  return (
    <div className="bg-white">
      <Navbar></Navbar>
      
      {/* Hero Section */}
      <div className="relative w-full h-96 overflow-hidden">
        <img
          src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751726915/IMG_8699_1_cmj2iz.jpg"
          alt="Wedding DJ Services"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Wedding DJ Services
          </h1>
          <p className="mb-6 text-lg font-normal lg:text-xl sm:px-16 xl:px-48">
            Making your special day unforgettable with professional DJ services
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-center mb-8 text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          Your Perfect Wedding Day
        </h2>
        
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Your wedding day is one of the most important days of your life, and we're here to make sure the music is perfect. With over 15 years of experience, MIXD Entertainment specializes in creating unforgettable wedding experiences.
          </p>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            From the ceremony to the last dance, we'll work closely with you to understand your vision and bring it to life. Our professional DJs ensure flawless timing, smooth transitions, and a dance floor that stays packed all night long.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Ceremony Music
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Set the perfect tone for your ceremony with carefully selected music that matches your style and preferences.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Cocktail Hour
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Keep the energy flowing during cocktail hour with the perfect background music that sets the mood.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Reception
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              From first dance to last call, we keep your guests on the dance floor with expertly curated playlists.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              MC Services
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Professional MC services to guide your reception smoothly, from introductions to announcements.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Professional Equipment
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              High-quality sound systems and lighting to ensure your wedding sounds and looks amazing.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Custom Playlists
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              We work with you to create custom playlists that reflect your musical taste and keep your guests dancing.
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 py-12 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Make Your Wedding Day Perfect?
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Let's discuss how we can make your wedding reception unforgettable. Contact us today for a consultation and pricing.
          </p>
          <a
            href="https://www.honeybook.com/widget/mixd_chicago_271581/cf_id/65c528b2b9e21200253deb54"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}