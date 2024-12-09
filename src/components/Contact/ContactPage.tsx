import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send(
        'CodeForged', // Byt ut mot din EmailJS Service ID
        'template_feezjfu', // Byt ut mot din EmailJS Template ID
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        '0_65CDZK2b9-yzfnG' // Byt ut mot din EmailJS Public Key (API-key)
      )
      .then(
        () => {
          setStatusMessage('Your message has been sent successfully!');
          setFormData({ name: '', email: '', subject: '', message: '' });
        },
        (error) => {
          setStatusMessage('Failed to send the message. Please try again later.');
          console.error('Email send error:', error);
        }
      );
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">Contact Me</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">Get in Touch</h2>
            <form onSubmit={sendEmail} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-cyan-300 font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-900 text-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-cyan-300 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-900 text-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Your email"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-cyan-300 font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-900 text-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Subject"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-cyan-300 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-900 text-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Your message"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-cyan-500 text-black font-semibold rounded-xl shadow-lg hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                Send Message
              </button>
            </form>
            {statusMessage && (
              <p className="mt-4 text-center text-sm text-cyan-400">{statusMessage}</p>
            )}
          </section>


          {/* Contact Information */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">Other Ways to Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              Feel free to reach out through email or connect with me on social media:
            </p>
            <ul className="space-y-4 mt-4">
              <li>
                <span className="font-semibold text-cyan-300">Email:</span>{' '}
                <a
                  href="mailto:info@codeforged.se"
                  className="text-cyan-500 hover:underline"
                >
                  info@codeforged.se
                </a>
              </li>
              <li>
                <span className="font-semibold text-cyan-300">LinkedIn:</span>{' '}
                <a
                  href="https://www.linkedin.com/in/christer-holm-6b945925/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-500 hover:underline"
                >
                  linkedin.com/in/christer-holm-6b945925/
                </a>
              </li>
              <li>
                <span className="font-semibold text-cyan-300">Discord:</span>{' '}
                <a
                  href="https://discord.com/users/codeforged_21518"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-500 hover:underline"
                >
                  codeforged_21518
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

