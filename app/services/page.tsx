'use client'
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import  { Card } from 'flowbite-react'

export default function Page() {
    return (
      <div>
<Navbar></Navbar>
<h1 className="pt-5 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Services</h1>
      <h1 className="">Here's a list of services that we provide! </h1>
      <Card className="max-w-sm">
          <h5>Lighting</h5>
      </Card>
      <Card className="max-w-sm">
          <h5>Private Parties</h5>
      </Card>
      <Card className="max-w-sm">
          <h5>Photo Booths</h5>
      </Card>
      <Card className="max-w-sm">
          <h5>Weddings</h5>
      </Card>


<Footer></Footer>
      </div>
    
    )
  }