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
          <Navbar.Link active href="/" className="inline-block  md:py-3">
            <p>Home</p>
          </Navbar.Link>
          <Navbar.Link href="/about" className="inline-block  md:py-3">
            <p>About</p>
          </Navbar.Link>
          {/* <Navbar.Link href="/services">
          Services
        </Navbar.Link> */}
          <Navbar.Link href="/pricing" className="inline-block  md:py-3">
            Pricing
          </Navbar.Link>
          <Navbar.Link
            href="https://www.honeybook.com/widget/mixd_chicago_271581/cf_id/65c528b2b9e21200253deb54"
            className="inline-block md:px-8 md:py-3 rounded-full bg-teal-600 text-white text-center hover:bg-teal-800 transition"
          >
            Contact Us
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};
export default navbar;
