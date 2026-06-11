import { BsInstagram } from "react-icons/bs";
import { getInstagramPosts } from "../../lib/instagram";

const INSTAGRAM_HANDLE = "mixd_chicago";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`;

export default async function InstagramFeed() {
  const posts = await getInstagramPosts(8);

  // Hide the section entirely if the feed isn't configured or unavailable.
  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 text-sm font-semibold uppercase tracking-widest text-teal-600">
            Follow Along
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 md:text-5xl">
            MIXD on Instagram
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            A look at the dance floors we&apos;ve packed lately.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-square rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={post.imageUrl}
                alt={post.caption ? post.caption.slice(0, 100) : "Instagram post from MIXD Entertainment"}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <BsInstagram className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors duration-200 shadow-sm"
          >
            <BsInstagram className="w-4 h-4 mr-2" />
            Follow @{INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    </section>
  );
}
