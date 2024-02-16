'use client'
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Form from '../components/contactform';
import { none } from '@cloudinary/url-gen/qualifiers/fontHinting';
// `app/page.tsx` is the UI for the `/` URL
export default function Page() {
    return (
    <div>
      <Navbar></Navbar> 
      <h1 className="pt-5 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Contact Us</h1>
      {/* <Form></Form>      */}
      
      <iframe className='max-w-sm'  allow="fullscreen" src="https://mixdentertainmentgroup.lumify.app/widget/contact-form/afa406af-a209-4964-9568-b0b2e1fdf52b/live"  height="500" width="500vh" ></iframe>
      
      <Footer></Footer>
    </div>)
    
  }

  