"use client";

import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import Link from "next/link";

const footer = () => {
  const MyIcon = () => {
    return (
      <div>
        <img src="https://d13ns7kbjmbjip.cloudfront.net/For_Your_Website/TK-icon_square_small.png" />
      </div>
    );
  };
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
                <Footer.Link href="/about">About Us</Footer.Link>
                <Footer.Link href="/pricing">Pricing</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://www.instagram.com/mixd_chicago">
                  Instagram
                </Footer.Link>
                {/* <Footer.Link href="#">
                Facebook
              </Footer.Link> */}
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
              href="https://www.instagram.com/mixd_chicago"
              icon={BsFacebook}
            />
            <Footer.Icon
              href="https://www.instagram.com/mixd_chicago"
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
  );
};
export default footer;
