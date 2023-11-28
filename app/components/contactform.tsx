'use client';

import { Button, Label, TextInput } from 'flowbite-react';


const contactform = () => {
  return (
    <form className="flex max-w-md flex-col gap-4">
    <div>
      <div className="mb-2 block">
        <Label htmlFor="base" value="Your name*" />
      </div>
      <TextInput id="email1" type="text"  required />
    </div>
    <div>
      <div className="mb-2 block">
        <Label htmlFor="email1" value="Your email" />
      </div>
      <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
    </div>
    <div>
      <div className="mb-2 block">
        <Label htmlFor="email1" value="Event description" />
      </div>
      <TextInput id="email1" type="text" placeholder="E.g. Smith-Johnson Wedding" required />
    </div>
    <div>
      <div className="mb-2 block">
        <Label htmlFor="email1" value="Event date" />
      </div>
      <TextInput id="email1" type="date" placeholder="name@flowbite.com" required />
    </div>
    <div>
      <div className="mb-2 block">
        <Label htmlFor="email1" value="Number of guest" />
      </div>
      <TextInput id="email1" type="text" placeholder="250" required />
    </div>
    <div>
      <div className="mb-2 block">
        <Label htmlFor="password1" value="Any more details?" />
      </div>
      <TextInput id="password1" type="text" sizing="lg" required />
    </div>
    <div>
      <div className="mb-2 block">
        <Label htmlFor="password1" value="Event location" />
      </div>
      <TextInput id="password1" type="text" sizing="lg" required />
    </div>
    <Button type="submit">Submit</Button>
  </form>
  )
}
export default contactform