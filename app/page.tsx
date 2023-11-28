"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Navbar, DarkThemeToggle, Flowbite } from 'flowbite-react';
import Footer from '../app/components/footer';
import Test from './components/testimonial';
import { Card } from 'flowbite-react';

 
export default function Home() {  
  return (

  
    <main className="flex  flex-col  justify-between">
      
      <Navbar>
      <Navbar.Brand href="/">
        <img
          alt="MIXD Logo"
          // className="mr-3 h-6 sm:h-9"
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
        <Navbar.Link
          href="/about"
        >
          <p>
            About
          </p>
        </Navbar.Link>
        <Navbar.Link href="/services">
          Services  
        </Navbar.Link>
        <Navbar.Link href="/pricing">
          Pricing
        </Navbar.Link>
        <Navbar.Link href="/contact">
          Contact
        </Navbar.Link>
      </Navbar.Collapse>
      </Navbar>
<div className='hero-image text-center'>
<h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-100 md:text-5xl lg:text-6xl dark:text-white">Let us DJ your next event.</h1>
<p className="mb-6 text-lg font-normal text-gray-100 lg:text-xl sm:px-16 xl:px-48 dark:text-white">Here at MIXD Entertianment we provide professional Dj services & more. With over 15 years of experience there is no need for you to worry about music for your event.</p>
<a href="/contact" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-teal-600 rounded-lg hover:bg-teal-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
    Request Pricing
    <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
  </svg>
</a>
</div>
  <Test/>

        <Footer></Footer>
    </main>

  )
}
