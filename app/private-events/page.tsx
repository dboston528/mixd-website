import type { Metadata } from 'next';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export const metadata: Metadata = {
  title: 'Private Event DJ Services in Chicago',
  description:
    'DJ entertainment for birthday parties, anniversaries, and corporate events in Chicago. MIXD Entertainment brings professional sound, lighting, and custom playlists to your private celebration.',
  alternates: {
    canonical: '/private-events',
  },
  openGraph: {
    title: 'Private Event DJ Services in Chicago | MIXD Entertainment',
    description:
      'DJ entertainment for birthday parties, anniversaries, and corporate events in Chicago with professional sound, lighting, and custom playlists.',
    images: [
      {
        url: 'https://res.cloudinary.com/he5g3ml0o/image/upload/c_fill,w_1200,h_630/v1751943492/IMG_0966_2_wlq7ec.jpg',
        width: 1200,
        height: 630,
        alt: 'MIXD Entertainment private event DJ services',
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
    title: 'Birthday Parties',
    copy: 'Celebrate another year with music that matches your style, from elegant affairs to high-energy dance parties.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />,
  },
  {
    title: 'Anniversary Celebrations',
    copy: 'Honor milestone anniversaries with music that reflects your journey together, from classic hits to contemporary favorites.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />,
  },
  {
    title: 'Corporate Events',
    copy: 'Professional entertainment for corporate gatherings, holiday parties, and company celebrations that reflect your brand.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />,
  },
  {
    title: 'Custom Music Selection',
    copy: "We work with you to create custom playlists that match your event's theme and your guests' preferences.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
  },
  {
    title: 'Professional Sound & Lighting',
    copy: 'High-quality audio equipment and lighting to create the perfect atmosphere for your private celebration.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />,
  },
  {
    title: 'Flexible Packages',
    copy: 'Customizable packages to fit your event size, duration, and budget. We\'re here to make your vision come to life.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />,
  },
];

export default function Page() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[480px] overflow-hidden">
        <img
          src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751943492/IMG_0966_2_wlq7ec.jpg"
          alt="Private Event DJ Services"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Private Event DJ Services
          </h1>
          <p className="mb-8 text-lg font-normal max-w-2xl opacity-90">
            Elevating your private celebrations with professional DJ entertainment
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
              Make Your Private Event Unforgettable
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Whether you're hosting a birthday party, anniversary, or corporate gathering, MIXD Entertainment brings the perfect vibe to your private event. With over 15 years of experience, we know how to read the crowd and keep the energy high.
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
              Ready to Plan Your Private Event?
            </h3>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Let's discuss how we can make your private celebration unforgettable. Contact us today for a consultation and pricing.
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
