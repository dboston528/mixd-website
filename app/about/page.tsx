'use client'
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Card } from 'flowbite-react';




export default function Page() {

  
    return (
      <div>
        <Navbar></Navbar>
        <h1 className="pt-5 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">About</h1>
        <p className="pt-5 text-center mb-7 md:text-2xl lg:text-3xl dark:text-white">Welcome to MIXD Entertainment, where the art of music meets the celebration of moments. Established in 2022, our company is the culmination of a shared passion for creating unforgettable experiences through the transformative power of music. Comprising a diverse team of talented DJs, each specializing in unique genres, we have curated soundtracks for weddings, corporate events, private parties, and festivals, earning recognition for our outstanding performances at notable venues and events. With a commitment to excellence, technological innovation, and seamless client satisfaction, MIXD Entertainment looks forward to being the heartbeat of your next celebration, ensuring an immersive, unforgettable, and harmonious experience for you and your guests. Thank you for considering us as your trusted partner in event entertainment.</p>
        <h1 className="pt-5 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Meet Our Dj's</h1>
        
        <Card
      className="max-w-sm "
      imgAlt="Meaningful alt text for an image that is not purely decorative"
      imgSrc="https://res.cloudinary.com/he5g3ml0o/image/upload/v1706334409/uq4ruuysfu9c1ycnyshi.png"
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Brad Jones aka DJ B JONES
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        10 Years of Experience
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
        24 Years of Experience
      </p>
    </Card>
    
        <Footer></Footer>
      </div>
    )
  }