import React, { useState } from "react";
import emailjs from "emailjs-com";
import AdsSection from "../Ads/adsPage";

// Modal component
const Modal = ({ isOpen, message, onClose, isSuccess }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-500 opacity-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center">
          <div
            className={`text-3xl font-semibold ${
              isSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
            {isSuccess ? "Success!" : "Failed!"}
          </div>
          <p className="mt-4 text-gray-700">{message}</p>
          <div className="mt-6">
            <button
              onClick={onClose}
              className="bg-cyan-500 text-white font-semibold rounded-xl py-2 px-6 hover:bg-cyan-400 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send(
        "CodeForged", // Byt ut mot din EmailJS Service ID
        "template_feezjfu", // Byt ut mot din EmailJS Template ID
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "0_65CDZK2b9-yzfnG" // Byt ut mot din EmailJS Public Key (API-key)
      )
      .then(
        () => {
          setStatusMessage("Your message has been sent successfully!");
          setIsSuccess(true);
        },
        () => {
          setStatusMessage(
            "Failed to send the message. Please try again later."
          );
          setIsSuccess(false);
        }
      )
      .finally(() => {
        setIsModalOpen(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="p-1 rounded-lg shadow-lg mp-2">
          <AdsSection placement="post-top" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">
          Contact Me
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
              Get in Touch
            </h2>
            <form onSubmit={sendEmail} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-cyan-300 font-semibold mb-2"
                  >
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
                  <label
                    htmlFor="email"
                    className="block text-cyan-300 font-semibold mb-2"
                  >
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
                <label
                  htmlFor="subject"
                  className="block text-cyan-300 font-semibold mb-2"
                >
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
                <label
                  htmlFor="message"
                  className="block text-cyan-300 font-semibold mb-2"
                >
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
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
              Other Ways to Contact
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Feel free to reach out through email or connect with me on social
              media:
            </p>
            <ul className="space-y-4 mt-4">
              <li>
                <span className="font-semibold text-cyan-300">Email:</span>{" "}
                <a
                  href="mailto:info@codeforged.se"
                  className="text-cyan-500 hover:underline"
                >
                  info@codeforged.se
                </a>
              </li>
              <li>
                <span className="font-semibold text-cyan-300">LinkedIn:</span>{" "}
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
                <span className="font-semibold text-cyan-300">Discord:</span>{" "}
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
          <section className="text-center mt-8">
            <h2 className="text-2xl sm:text-2xl font-semibold text-cyan-400 mb-4">
              Connect with me on GitHub
            </h2>
            <p className="text-gray-300 leading-relaxed sm-2">
              Feel free to check out my GitHub profile and explore my projects.
              You can also follow me to stay updated on my latest work.
            </p>
            <div className="flex justify-center space-x-6">
              {/* GitHub Followers Badge */}
              <a
                href="https://github.com/codeforgedtech"
                target="_blank"
                rel="noopener noreferrer"
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src="https://img.shields.io/github/followers/codeforgedtech?style=social"
                  alt="GitHub Followers"
                  className="h-6" // Justering av storleken
                />
              </a>
              {/* GitHub Stars Badge */}
              <a
                href="https://github.com/codeforgedtech"
                target="_blank"
                rel="noopener noreferrer"
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src="https://img.shields.io/github/stars/codeforgedtech?style=social"
                  alt="GitHub Stars"
                  className="h-6" // Justering av storleken
                />
              </a>
              <img
                src="https://img.shields.io/github/last-commit/codeforgedtech/codecraftsman-blog?style=social"
                alt="Last commit"
                className="h-6"
              />
              <img
                src="https://img.shields.io/github/forks/codeforgedtech/codecraftsman-blog?style=social"
                alt="GitHub Forks"
                className="h-6
                "
              />
              <img
                src="https://img.shields.io/github/license/codeforgedtech/codecraftsman-blog?style=social"
                alt="GitHub License"
                className="h-6"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Modal for message status */}
      <Modal
        isOpen={isModalOpen}
        message={statusMessage || ""}
        onClose={closeModal}
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default ContactPage;
