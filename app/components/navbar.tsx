import { Navbar } from "flowbite-react";
const navbar = () => {
  return (
    <div>
      <Navbar>
        <Navbar.Brand href="/">
          <img
            alt="MIXD Logo"
            //  className="mr-3 h-6 sm:h-9"
            src="/next.svg"
            width={102}
            height={29}
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Link  href="/" className="inline-block md:py-3 hover:text-teal-600 transition-colors duration-200">
            <p>Home</p>
          </Navbar.Link>
          <Navbar.Link href="/about" className="inline-block md:py-3 hover:text-teal-600 transition-colors duration-200">
            <p>About</p>
          </Navbar.Link>
          {/* <Navbar.Link href="/services">
          Services
        </Navbar.Link> */}
          <Navbar.Link href="/pricing" className="inline-block md:py-3 hover:text-teal-600 transition-colors duration-200">
            Pricing
          </Navbar.Link>
          <a
            href="https://www.honeybook.com/widget/mixd_chicago_271581/cf_id/65c528b2b9e21200253deb54"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-teal-600 text-white font-medium text-center hover:!bg-teal-700 hover:!text-white focus:ring-4 focus:ring-teal-300 transition-all duration-200 whitespace-nowrap"
          >
            Contact Us
          </a>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};
export default navbar;
