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

      <div className="grid  mb-6 md:grid-cols-2" id="card-container">
        <div className="flex justify-center mb-6">
          <Card
            className="max-w-sm"
            imgAlt="Meaningful alt text for an image that is not purely decorative"
            imgSrc="https://res.cloudinary.com/he5g3ml0o/image/upload/v1706334409/uq4ruuysfu9c1ycnyshi.png"
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Brad(Dj B Jones)
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Co-founder
            </p>
          </Card>
        </div>

        <div className="flex justify-center">
          <Card
            className="max-w-sm"
            imgAlt="Meaningful alt text for an image that is not purely decorative"
            imgSrc="https://res.cloudinary.com/he5g3ml0o/image/upload/v1706333353/bjt9igln8fuz4xbtlpb6.png"
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              DeAndre(DJ Duggy)
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Co-founder
            </p>
          </Card>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
