'use client'
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function Page() {

  
    return (
      <div>
        <Navbar></Navbar>
        <h1 className="pt-5 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Pricing</h1>
        <Footer></Footer>
      </div>
    )
  }