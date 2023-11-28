"use client"
import Image from 'next/image'

const testimonial = () => {
  return (
    
<figure className="max-w-screen-md mx-auto text-center py-8 px-4 lg:py-16 lg:px-6">
    <h1 className='mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white'>What our clients are saying</h1>
    <svg className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
        <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
    </svg>
    <blockquote>
        <p className="text-2xl italic font-medium text-gray-900 dark:text-white"> "MIXD DJ's were so easy to work with! They helped make our event even more memorable. I can't wait to work with them again soon!"</p>
    </blockquote>
    <figcaption className="flex items-center justify-center mt-6 space-x-3 rtl:space-x-reverse">
        {/* <Image className="w-6 h-6 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png" width={500} height={500} alt="profile picture"></Image> */}
        <div className="flex items-center divide-x-2 rtl:divide-x-reverse divide-gray-500 dark:divide-gray-700">
            <cite className="pe-3 font-medium text-gray-900 dark:text-white">Carrie</cite>
        </div>
    </figcaption>
</figure>

  )
}
export default testimonial


// " mx-auto max-w-screen-xl "