'use client';

import { Footer } from 'flowbite-react';
import { BsFacebook, BsInstagram } from 'react-icons/bs';
const footer = () => {
  return (
    <Footer container>
    <div className="w-full">
      <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
        <div>
          <Footer.Brand
            alt="MIXD Logo"
            href="/"
            src="/next.svg"
            width={102}
            height={29}
          />
        </div>
        <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
          <div>
            <Footer.Title title="about" />
            <Footer.LinkGroup col>
              <Footer.Link href="/services">
                Services
              </Footer.Link>
              <Footer.Link href="/pricing">
                Pricing
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Follow us" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">
                Instagram
              </Footer.Link>
              <Footer.Link href="#">
                Facebook
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          {/* Legal Section Below */}
          {/* <div>
            <Footer.Title title="Legal" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">
                Privacy Policy
              </Footer.Link>
              <Footer.Link href="#">
                Terms & Conditions
              </Footer.Link>
            </Footer.LinkGroup>
          </div> */}
        </div>
      </div>
      <Footer.Divider />
      <div className="w-full sm:flex sm:items-center sm:justify-between">
        <Footer.Copyright
          by="MIXD Entertainment Group"
          href="#"
          year={2024}
        />
        <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
          <Footer.Icon
            href="#"
            icon={BsFacebook}
          />
          <Footer.Icon
            href="#"
            icon={BsInstagram}
          />
          {/* <Footer.Icon
            href="#"
            icon={BsTwitter}
          />
          <Footer.Icon
            href="#"
            icon={BsGithub}
          /> */}
          
        </div>
      </div>
    </div>
  </Footer>
  )
}
export default footer