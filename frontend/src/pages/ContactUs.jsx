import React from 'react';

import { toast, ToastContainer } from 'react-toastify';

export default function ContactUs() {
  const [result, setResult] = React.useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult('Sending....');
    const formData = new FormData(event.target);

    formData.append('access_key', 'fbc30ede-f871-4e5d-a1bd-8c42ea312b69');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult('');
      toast.success('Message sent successfully');
      event.target.reset();
    } else {
      console.log('Error', data);
      toast.error('Error sending message');
      setResult('');
    }
  };

  return (

    <div className="px-6 md:px-20 py-16">
      {/* Top Section: Title & Subtitle */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">
          Contact{' '}
          <span className="underline underline-offset-4 decoration-1 font-light">
            With us
          </span>
        </h1>
        <p className="text-gray-500">
          Ready to Make a Move? Let’s Build Your Future Together
        </p>
      </div>

      {/* Bottom Section: Image & Form */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/src/assets/contact/image.jpg"
            alt="Contact Us"
            className="w-full max-w-md md:max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side: Contact Form */}
        <div className="w-full md:w-1/2">
          <form onSubmit={onSubmit} className="text-gray-600 border border-gray-300 rounded p-6 shadow-lg">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <label className="block text-left font-semibold">Name</label>
                <input
                  className="w-full border border-gray-300 rounded py-2 px-4 mt-2"
                  type="text"
                  placeholder="Name"
                  name="Name"
                  required
                />
              </div>

              <div className="w-full md:w-1/2 pl-2">
                <label className="block text-left font-semibold">E-mail</label>
                <input
                  className="w-full border border-gray-300 rounded py-2 px-4 mt-2"
                  type="email"
                  placeholder="E-mail"
                  name="Email"
                  required
                />
              </div>
            </div>

            <div className="my-4">
              <label className="block text-left font-semibold">Message</label>
              <textarea
                className="w-full border border-gray-300 rounded py-3 px-4 mt-2 h-32 resize-none"
                placeholder="Message"
                name="Message"
                required
              ></textarea>
            </div>

            <button className="bg-blue-600 text-white py-2 px-12 rounded w-full md:w-auto">
              {result ? result : 'Send Message'}
            </button>
          </form>
        </div>
      </div>



      <ToastContainer />
    </div>
    

  );
}
