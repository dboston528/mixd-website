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
          src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751944013/IMG_0B3FFFD98443-1_aut1ug.jpg"
          alt="Bar & Bat Mitzvah DJ Services"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Bar & Bat Mitzvah DJ Services
          </h1>
          <p className="mb-6 text-lg font-normal lg:text-xl sm:px-16 xl:px-48">
            Celebrating this milestone with music that brings families and friends together
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-center mb-8 text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          A Celebration to Remember
        </h2>
        
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            A Bar or Bat Mitzvah is a significant milestone in a young person's life, and the celebration should reflect the joy and importance of this occasion. MIXD Entertainment specializes in creating memorable Mitzvah celebrations that honor tradition while keeping the energy high and the dance floor packed.
          </p>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            We understand the unique dynamics of Mitzvah celebrations, where guests range from young children to grandparents. Our experienced DJs know how to read the room and create a musical experience that brings everyone together. From traditional Hora to contemporary hits, we'll work with you to create the perfect celebration.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Traditional Ceremony Music
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Honor your traditions with carefully selected music for the ceremony, including traditional Jewish music and modern interpretations.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Hora & Celebration
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Lead the traditional Hora with professional equipment and expertise, creating an unforgettable moment for the guest of honor and family.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Multi-Generational Entertainment
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              We expertly blend music that appeals to all ages, from current hits for the kids to classic favorites for the adults.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Professional MC Services
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Our professional MCs guide your celebration smoothly, from introductions to special announcements and keeping the party flowing.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Custom Playlists
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Work with us to create custom playlists that reflect the guest of honor's musical taste while ensuring everyone has a great time.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Professional Sound & Lighting
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              High-quality sound systems and dynamic lighting to create the perfect atmosphere for your Mitzvah celebration.
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 py-12 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Plan Your Mitzvah Celebration?
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Let's discuss how we can make your Bar or Bat Mitzvah celebration unforgettable. Contact us today for a consultation and pricing.
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

