'use client';

import Footer from "../components/footer";
import { motion } from "framer-motion";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate async request
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Sending...',
        success: 'Message sent!',
        error: 'Failed to send!',
      }
    );

    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster />
  

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-emerald-600 mb-4">Get in Touch</h1>
            <p className="text-gray-600 mb-6">
              We'd love to hear from you. Send us a message and we’ll respond soon.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Send Message
              </motion.button>
            </form>

            {/* Contact buttons */}
            <div className="mt-6 space-y-2">
              <a
                href="tel:+1234567890"
                className="block text-emerald-600 hover:underline"
              >
                📞 Call us: 1-800-ABHAILE (864-7479)
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-green-600 hover:underline"
              >
                💬 WhatsApp: +1 234 567 890
              </a>
            </div>
          </div>

        {/* Google Map */}
<div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2382.605908505998!2d-6.267493084162615!3d53.34980597997998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670e9f3b8e7b6b%3A0x3b8e1f3bcb5a8d5a!2sDublin%2C%20Ireland!5e0!3m2!1sen!2sie!4v1691653745623!5m2!1sen!2sie"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
