const CheckIcon = () => (
  <svg className="flex-shrink-0 w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const packages = [
  {
    name: "Bronzeville Package",
    price: "$1,899",
    tag: null,
    featured: false,
    items: [
      "Professional DJ (Reception only)",
      "Up to 5 hours",
      "Planning consultation",
      "Professional sound system",
      "Dance floor lighting or Uplights",
    ],
  },
  {
    name: "Gold Coast Package",
    price: "$2,400",
    tag: "Most Popular",
    featured: true,
    items: [
      "Lead DJ + Professional MC",
      "Ceremony sound",
      "Reception entertainment (up to 6 hours)",
      "Timeline & vendor coordination",
      "Stress-free planning",
      "Seamless timeline",
    ],
  },
  {
    name: "Mag Mile Package",
    price: "$3,100",
    tag: "Premium, all-inclusive",
    featured: false,
    items: [
      "Lead DJ + Professional MC",
      "Ceremony + reception",
      "Up to 7–8 hours",
      "Social media recap content",
      "Priority planning & customization",
    ],
  },
];

const pricetable = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 text-sm font-semibold uppercase tracking-widest text-teal-600">
            Packages
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Choose the package that fits your event. All packages include professional DJ services and seamless coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {packages.map(({ name, price, tag, featured, items }) => (
            <div
              key={name}
              className={`flex flex-col rounded-2xl p-8 shadow-sm ${
                featured
                  ? "border-2 border-teal-500 bg-white shadow-lg relative"
                  : "border border-gray-100 bg-gray-50"
              }`}
            >
              {featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
              {tag && !featured && (
                <p className="text-sm text-gray-500 mb-4">{tag}</p>
              )}
              <div className="my-6">
                <span className="text-5xl font-extrabold text-gray-900">{price}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckIcon />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://www.honeybook.com/widget/mixd_chicago_271581/cf_id/65c528b2b9e21200253deb54"
                className={`inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-xl transition-colors duration-200 ${
                  featured
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                Get started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default pricetable;
