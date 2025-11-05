"use client";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Card } from "flowbite-react";

export default function Page() {
  return (
    <div className="bg-white">
      <Navbar></Navbar>
      <h1 className="bg-white pt-5 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Meet Our Team
      </h1>

      <div className="container mx-auto px-4 pb-12">
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

          <Card
            className="max-w-sm w-full"
            imgAlt="Image of DJ Guice"
            imgSrc="https://res.cloudinary.com/he5g3ml0o/image/upload/v1706334409/uq4ruuysfu9c1ycnyshi.png"
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              DJ Guice
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              DJ
            </p>
          </Card>

          <Card
            className="max-w-sm w-full"
            imgAlt="Image of DJ Troy"
            imgSrc="https://res.cloudinary.com/he5g3ml0o/image/upload/v1706334409/uq4ruuysfu9c1ycnyshi.png"
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              DJ Troy
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              DJ
            </p>
          </Card>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
