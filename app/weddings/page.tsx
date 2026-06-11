import type { Metadata } from 'next';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export const metadata: Metadata = {
  title: 'Wedding DJ Services in Chicago',
  description:
    'Professional wedding DJ and MC services in Chicago: ceremony music, cocktail hour, reception entertainment, and custom playlists. Make your wedding day unforgettable with MIXD Entertainment.',
  alternates: {
    canonical: '/weddings',
  },
  openGraph: {
    title: 'Wedding DJ Services in Chicago | MIXD Entertainment',
    description:
      'Professional wedding DJ and MC services in Chicago: ceremony music, cocktail hour, reception entertainment, and custom playlists.',
    images: [
      {
        url: 'https://res.cloudinary.com/he5g3ml0o/image/upload/c_fill,w_1200,h_630/v1751726915/IMG_8699_1_cmj2iz.jpg',
        width: 1200,
        height: 630,
        alt: 'MIXD Entertainment wedding DJ services',
      },
    ],
  },
};

const ArrowIcon = () => (
  <svg className="w-3.5 h-3.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
  </svg>
);

const features = [
  {
    title: 'Ceremony Music',
    copy: 'Set the perfect tone for your ceremony with carefully selected music that matches your style and preferences.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />,
  },
  {
    title: 'Cocktail Hour',
    copy: 'Keep the energy flowing during cocktail hour with the perfect background music that sets the mood.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    title: 'Reception',
    copy: 'From first dance to last call, we keep your guests on the dance floor with expertly curated playlists.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />,
  },
  {
    title: 'MC Services',
    copy: 'Professional MC services to guide your reception smoothly, from introductions to announcements.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />,
  },
  {
    title: 'Professional Equipment',
    copy: 'High-quality sound systems and lighting to ensure your wedding sounds and looks amazing.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />,
  },
  {
    title: 'Custom Playlists',
    copy: 'We work with you to create custom playlists that reflect your musical taste and keep your guests dancing.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
  },
];

export default function Page() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[480px] overflow-hidden">
        <img
          src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751726915/IMG_8699_1_cmj2iz.jpg"
          alt="Wedding DJ Services"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Wedding DJ Services
          </h1>
          <p className="mb-8 text-lg font-normal max-w-2xl opacity-90">
            Making your special day unforgettable with professional DJ services
          </p>
          <a
            href="https://www.honeybook.com/widget/mixd_chicago_271581/cf_id/65c528b2b9e21200253deb54"
            className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors duration-200 shadow-sm"
          >
            Request Pricing
            <ArrowIcon />
          </a>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block mb-3 text-sm font-semibold uppercase tracking-widest text-teal-600">
              What We Offer
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 md:text-5xl">
              Your Perfect Wedding Day
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Your wedding day is one of the most important days of your life, and we're here to make sure the music is perfect. With over 15 years of experience, MIXD Entertainment specializes in creating unforgettable wedding experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map(({ title, copy, icon }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-gray-50 p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    {icon}
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-gray-50 rounded-2xl p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Make Your Wedding Day Perfect?
            </h3>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Let's discuss how we can make your wedding reception unforgettable. Contact us today for a consultation and pricing.
            </p>
            <a
              href="https://www.honeybook.com/widget/mixd_chicago_271581/cf_id/65c528b2b9e21200253deb54"
              className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors duration-200 shadow-sm"
            >
              Request Pricing
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
