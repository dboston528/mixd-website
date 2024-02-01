'use client'
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Card } from 'flowbite-react';




export default function Page() {

  
    return (
      <div>
        <Navbar></Navbar>
        <h1 className="pt-5 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">About</h1>
       <div className='py-55 px-60'>
        <Card
      className="max-w-sm "
      imgAlt="Meaningful alt text for an image that is not purely decorative"
      imgSrc="https://res.cloudinary.com/he5g3ml0o/image/upload/v1706334409/uq4ruuysfu9c1ycnyshi.png"
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Brad Jones aka DJ B JONES
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
      </p>
    </Card>

    <Card
      className="max-w-sm"
      imgAlt="Meaningful alt text for an image that is not purely decorative"
      imgSrc="https://res.cloudinary.com/he5g3ml0o/image/upload/v1706333353/bjt9igln8fuz4xbtlpb6.png"
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        DeAndre Boston aka DJ Duggy
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
      </p>
    </Card>
    </div>
        <Footer></Footer>
      </div>
    )
  }