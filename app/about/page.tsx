"use client";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Card } from "flowbite-react";

export default function Page() {
  return (
    <div className="bg-white">
      <Navbar></Navbar>
      
      {/* Hero Section */}
      <div className="relative w-full h-96 overflow-hidden">
        <img
          src="https://res.cloudinary.com/he5g3ml0o/image/upload/v1751943492/IMG_0966_2_wlq7ec.jpg"
          alt="MIXD Entertainment Team"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Meet Our Team
          </h1>
          <p className="mb-6 text-lg font-normal lg:text-xl sm:px-16 xl:px-48">
            The talented professionals behind MIXD Entertainment
          </p>
        </div>
      </div>

      {/* Team Cards Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center" id="card-container">
          <Card
            className="max-w-sm w-full"
            imgAlt="Image of DJ B Jones"
            imgSrc="https://res.cloudinary.com/he5g3ml0o/image/upload/v1706334409/uq4ruuysfu9c1ycnyshi.png"
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Brad (DJ B Jones)
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              DJ & Co-founder
            </p>
          </Card>

          <Card
            className="max-w-sm w-full"
            imgAlt="Image of DeAndre a.k.a. DJ duggy"
            imgSrc="https://res.cloudinary.com/he5g3ml0o/image/upload/v1706333353/bjt9igln8fuz4xbtlpb6.png"
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              DeAndre (DJ Duggy)
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              DJ & Co-founder
            </p>
          </Card>

          <Card
            className="max-w-sm w-full"
            imgAlt="image of MC DeAndre Tanner"
            imgSrc="https://res.cloudinary.com/he5g3ml0o/image/upload/v1735761317/tanner-1_sofygl.png"
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              DeAndre Tanner
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Master of Ceremonies
            </p>
          </Card>

          {/* <Card
            className="max-w-sm w-full"
            imgAlt="Image of DJ Guice"
            imgSrc="https://ui-avatars.com/api/?name=DJ+Guice&size=400&background=14b8a6&color=fff&bold=true"
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              DJ Guice
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              DJ
            </p>
          </Card> */}

          {/* <Card
            className="max-w-sm w-full"
            imgAlt="Image of DJ Troy"
            imgSrc="https://ui-avatars.com/api/?name=DJ+Troy&size=400&background=14b8a6&color=fff&bold=true"
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              DJ Troy
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              DJ
            </p>
          </Card> */}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
