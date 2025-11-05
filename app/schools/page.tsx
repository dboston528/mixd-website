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
          src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751861791/school_thumbnail_wtevmr.jpg"
          alt="School DJ Services"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            School DJ Services
          </h1>
          <p className="mb-6 text-lg font-normal lg:text-xl sm:px-16 xl:px-48">
            Creating memorable school events with age-appropriate entertainment
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-center mb-8 text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          Entertainment for Every School Event
        </h2>
        
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            From prom nights to homecoming dances, school assemblies to graduation parties, MIXD Entertainment specializes in providing age-appropriate, high-energy entertainment for educational institutions. We understand the unique needs of school events and work closely with administrators to ensure a safe, fun, and memorable experience.
          </p>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Our professional DJs are experienced in working with students of all ages, maintaining appropriate content while keeping the energy high and the dance floor packed. We bring professional-grade equipment and years of experience to make your school's special events unforgettable.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Prom & Homecoming
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Make your school's biggest dances memorable with professional DJ services, lighting, and music that keeps students on the dance floor all night.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Graduation Parties
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Celebrate this milestone achievement with music and entertainment that honors the graduates and creates lasting memories.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              School Assemblies
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Enhance your school assemblies with professional sound systems and music that energizes and engages students.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Age-Appropriate Content
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              We carefully curate all music to ensure it's appropriate for your student body, working with school administrators to meet all guidelines.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Professional Equipment
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              High-quality sound systems, lighting, and microphones to ensure your event sounds and looks professional.
            </p>
          </Card>

          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              MC Services
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Professional MC services for announcements, introductions, and keeping the event running smoothly throughout the night.
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 py-12 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Make Your School Event Unforgettable?
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Let's discuss how we can make your school's next event a success. Contact us today for a consultation and pricing.
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

