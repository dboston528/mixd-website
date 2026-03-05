"use client";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const team = [
  {
    name: "Brad (DJ B Jones)",
    role: "DJ & Co-founder",
    img: "https://res.cloudinary.com/he5g3ml0o/image/upload/v1706334409/uq4ruuysfu9c1ycnyshi.png",
    alt: "Image of DJ B Jones",
  },
  {
    name: "DeAndre (DJ Duggy)",
    role: "DJ & Co-founder",
    img: "https://res.cloudinary.com/he5g3ml0o/image/upload/v1706333353/bjt9igln8fuz4xbtlpb6.png",
    alt: "Image of DeAndre a.k.a. DJ Duggy",
  },
  {
    name: "DeAndre Tanner",
    role: "Master of Ceremonies",
    img: "https://res.cloudinary.com/he5g3ml0o/image/upload/v1735761317/tanner-1_sofygl.png",
    alt: "Image of MC DeAndre Tanner",
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
          alt="MIXD Entertainment Team"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Meet Our Team
          </h1>
          <p className="text-lg font-normal max-w-2xl opacity-90">
            The talented professionals behind MIXD Entertainment
          </p>
        </div>
      </div>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block mb-3 text-sm font-semibold uppercase tracking-widest text-teal-600">
              The Crew
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 md:text-5xl">
              Who We Are
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              With over 15 years of combined experience, our team brings energy, professionalism, and passion to every event.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center">
            {team.map(({ name, role, img, alt }) => (
              <div key={name} className="flex flex-col items-center text-center">
                <div className="w-48 h-48 rounded-2xl overflow-hidden mb-5 shadow-sm border border-gray-100">
                  <img src={img} alt={alt} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
                <p className="text-sm font-medium text-teal-600 uppercase tracking-wide">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
