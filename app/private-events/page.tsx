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
          src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751943492/IMG_0966_2_wlq7ec.jpg"
          alt="Private Event DJ Services"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Private Event DJ Services
          </h1>
          <p className="mb-6 text-lg font-normal lg:text-xl sm:px-16 xl:px-48">
            Elevating your private celebrations with professional DJ entertainment
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-center mb-8 text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          Make Your Private Event Unforgettable
        </h2>
        
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Whether you're hosting a birthday party, anniversary celebration, corporate gathering, or any special occasion, MIXD Entertainment brings the perfect vibe to your private event. With over 15 years of experience, we know how to read the crowd and keep the energy high.
          </p>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            From intimate gatherings to large celebrations, we provide professional DJ services tailored to your event's unique atmosphere. Our team works with you to create the perfect musical experience that matches your style and keeps your guests entertained.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Birthday Parties
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Celebrate another year with music that matches your style, from elegant affairs to high-energy dance parties.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Anniversary Celebrations
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Honor milestone anniversaries with music that reflects your journey together, from classic hits to contemporary favorites.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Corporate Events
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Professional entertainment for corporate gatherings, holiday parties, and company celebrations that reflect your brand.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Custom Music Selection
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              We work with you to create custom playlists that match your event's theme and your guests' preferences.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Professional Sound & Lighting
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              High-quality audio equipment and lighting to create the perfect atmosphere for your private celebration.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Flexible Packages
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Customizable packages to fit your event size, duration, and budget. We're here to make your vision come to life.
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 py-12 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Plan Your Private Event?
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Let's discuss how we can make your private celebration unforgettable. Contact us today for a consultation and pricing.
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

