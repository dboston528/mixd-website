import { Navbar } from 'flowbite-react';
const navbar = () => {
  return (
    <div>
    <Navbar>
      <Navbar.Brand
    
        href="/"
      >
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
        <Navbar.Link
          active
          href="/"
        >
          <p>
            Home
          </p>
        </Navbar.Link>
        <Navbar.Link href="/about">
          <p>About</p>
        </Navbar.Link>
        {/* <Navbar.Link href="/services">
          Services
        </Navbar.Link> */}
        <Navbar.Link href="/pricing">
          Pricing
        </Navbar.Link>
        <Navbar.Link href="https://www.honeybook.com/widget/mixd_chicago_271581/cf_id/65c528b2b9e21200253deb54">
          Contact
        </Navbar.Link>
      </Navbar.Collapse>
      </Navbar>
      </div>
  )
}
export default navbar