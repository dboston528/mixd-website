'use client'
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const ArrowIcon = () => (
  <svg className="w-3.5 h-3.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
  </svg>
);

const features = [
  {
    title: 'Traditional Ceremony Music',
    copy: 'Honor your traditions with carefully selected music for the ceremony, including traditional Jewish music and modern interpretations.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />,
  },
  {
    title: 'Hora & Celebration',
    copy: 'Lead the traditional Hora with professional equipment and expertise, creating an unforgettable moment for the guest of honor and family.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />,
  },
  {
    title: 'Multi-Generational Entertainment',
    copy: 'We expertly blend music that appeals to all ages, from current hits for the kids to classic favorites for the adults.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />,
  },
  {
    title: 'Professional MC Services',
    copy: 'Our professional MCs guide your celebration smoothly, from introductions to special announcements and keeping the party flowing.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />,
  },
  {
    title: 'Custom Playlists',
    copy: 'Work with us to create custom playlists that reflect the guest of honor\'s musical taste while ensuring everyone has a great time.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
  },
  {
    title: 'Professional Sound & Lighting',
    copy: 'High-quality sound systems and dynamic lighting to create the perfect atmosphere for your Mitzvah celebration.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />,
  },
];

export default function Page() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[480px] overflow-hidden">
        <img
          src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751944013/IMG_0B3FFFD98443-1_aut1ug.jpg"
          alt="Bar & Bat Mitzvah DJ Services"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Bar & Bat Mitzvah DJ Services
          </h1>
          <p className="mb-8 text-lg font-normal max-w-2xl opacity-90">
            Celebrating this milestone with music that brings families and friends together
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
              A Celebration to Remember
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              A Bar or Bat Mitzvah is a significant milestone, and the celebration should reflect the joy of this occasion. We understand the unique dynamics of Mitzvah celebrations and know how to create a musical experience that brings everyone together — from the Hora to the last dance.
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
              Ready to Plan Your Mitzvah Celebration?
            </h3>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Let's discuss how we can make your Bar or Bat Mitzvah celebration unforgettable. Contact us today for a consultation and pricing.
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
