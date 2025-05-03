import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineShieldCheck, 
  HiOutlineCurrencyDollar, 
  HiOutlineClock,
  HiOutlineHeart
} from 'react-icons/hi';

const policies = [
  {
    icon: <HiOutlineShieldCheck className="w-12 h-12 text-blue-600" />,
    title: "Secure Booking",
    description: "Your booking is protected with our secure payment system and data encryption."
  },
  {
    icon: <HiOutlineCurrencyDollar className="w-12 h-12 text-green-600" />,
    title: "Best Price Guarantee",
    description: "We guarantee the best prices for all our tours and activities."
  },
  {
    icon: <HiOutlineClock className="w-12 h-12 text-purple-600" />,
    title: "24/7 Support",
    description: "Our customer support team is available around the clock to assist you."
  },
  {
    icon: <HiOutlineHeart className="w-12 h-12 text-red-600" />,
    title: "Satisfaction Guaranteed",
    description: "We ensure your complete satisfaction with our services and experiences."
  }
];

function Policy() {
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Travel Policies
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We are committed to providing you with the best travel experience while ensuring your safety and satisfaction.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-600 rounded-full">
                  {policy.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {policy.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {policy.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            Learn More About Our Policies
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Policy;