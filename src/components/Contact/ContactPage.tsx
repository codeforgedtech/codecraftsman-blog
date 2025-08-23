import React, { useState } from "react";
import emailjs from "emailjs-com";
import AdsSection from "../Ads/adsPage";

// Modal component
interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  isSuccess: boolean;
}

const Modal = ({ isOpen, message, onClose, isSuccess }: ModalProps) => {
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
  {/* Email */}
  <li className="flex items-center gap-2">
    <span className="text-cyan-300 font-semibold flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      Email:
    </span>
    <a
      href="mailto:master@codecraftsman.se"
      className="text-cyan-500 hover:underline"
    >
      master@codecraftsman.se
    </a>
  </li>

  {/* LinkedIn (no change) */}

  {/* Discord */}
  <li className="flex items-center gap-2">
    <span className="text-cyan-300 font-semibold flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-indigo-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.317 4.369A19.791 19.791 0 0015.946 3c-.179.312-.388.73-.531 1.056a18.151 18.151 0 00-6.83 0c-.143-.326-.35-.744-.531-1.056A19.77 19.77 0 003.683 4.369a20.021 20.021 0 00-1.714 12.85 19.9 19.9 0 005.993 2.908c.49-.672.925-1.385 1.298-2.132a12.683 12.683 0 01-1.986-.961c.167-.127.33-.26.488-.397a14.64 14.64 0 0011.418 0c.158.137.321.27.488.397a12.683 12.683 0 01-1.986.961c.373.747.808 1.46 1.298 2.132a19.89 19.89 0 005.993-2.908 20.03 20.03 0 00-1.714-12.85zM9.113 13.883c-1.057 0-1.921-.951-1.921-2.122 0-1.17.85-2.121 1.921-2.121 1.07 0 1.935.951 1.921 2.121 0 1.17-.85 2.122-1.921 2.122zm5.774 0c-1.057 0-1.921-.951-1.921-2.122 0-1.17.85-2.121 1.921-2.121 1.07 0 1.935.951 1.921 2.121 0 1.17-.851 2.122-1.921 2.122z" />
      </svg>
      Discord:
    </span>
    <a
      href="https://discord.gg/GUDy5sxB"
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan-500 hover:underline"
    >
      CodeCraftsMan Server
    </a>
  </li>

  {/* SoundCloud */}
  <li className="flex items-center gap-2">
    <span className="text-orange-400 font-semibold flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17.6 10.5c-.3 0-.5 0-.8.1-.4-2.5-2.4-4.4-4.9-4.4-1.2 0-2.2.4-3.1 1-.2.1-.3.3-.3.5v7.1c0 .3.2.5.5.5h8.6c1.7 0 3.1-1.4 3.1-3.1s-1.4-3.2-3.1-3.2zM1.9 10.7c-.3 0-.6.3-.6.6v3.4c0 .3.3.6.6.6s.6-.3.6-.6v-3.4c0-.3-.3-.6-.6-.6zm2.1-1.1c-.3 0-.6.3-.6.6v5.6c0 .3.3.6.6.6s.6-.3.6-.6v-5.6c0-.3-.3-.6-.6-.6zm2.1-.9c-.3 0-.6.3-.6.6v7.4c0 .3.3.6.6.6s.6-.3.6-.6V9.3c0-.3-.2-.6-.6-.6zm2.1-.6c-.3 0-.6.3-.6.6v8.6c0 .3.3.6.6.6s.6-.3.6-.6V9.3c0-.4-.2-.6-.6-.6z" />
      </svg>
      SoundCloud:
    </span>
    <a
      href="https://soundcloud.com/codecraftsman"
      target="_blank"
      rel="noopener noreferrer"
      className="text-orange-300 hover:underline"
    >
      codecraftsman
    </a>
  </li>

  {/* Spotify */}
  <li className="flex items-center gap-2">
    <span className="font-semibold text-green-300 flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0C5.371 0 0 5.373 0 12c0 6.627 5.371 12 12 12s12-5.373 12-12c0-6.627-5.371-12-12-12zm5.356 17.273c-.229.373-.709.49-1.084.264-2.971-1.82-6.717-2.232-11.106-1.225-.435.1-.883-.176-.984-.611-.1-.435.176-.883.611-.984 4.865-1.103 9.067-.631 12.427 1.43.375.229.493.709.264 1.126zm1.541-2.732c-.295.478-.922.631-1.4.336-3.404-2.1-8.591-2.709-12.616-1.487-.547.166-1.135-.137-1.299-.684-.166-.547.137-1.135.684-1.299 4.547-1.406 10.271-.732 14.166 1.709.478.295.631.922.336 1.425zm.162-2.82c-4.049-2.45-10.729-2.676-14.584-1.479-.664.195-1.365-.166-1.56-.83-.195-.664.166-1.365.83-1.56 4.484-1.336 11.902-1.078 16.533 1.709.59.354.779 1.125.424 1.715-.355.59-1.125.779-1.643.445z" />
      </svg>
      Spotify:
    </span>
    <a
      href="https://open.spotify.com/artist/0voqr9KSdMAufUnbljpbuH"
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-400 hover:underline"
    >
      codecraftsman
    </a>
  </li>
</ul>
          </section>
          <section className="text-center mt-8 px-4">
            <h2 className="text-2xl sm:text-2xl font-semibold text-cyan-400 mb-4">
              Connect with me on GitHub
            </h2>
            <p className="text-gray-300 leading-relaxed sm:mb-2">
              Feel free to check out my GitHub profile and explore my projects.
              You can also follow me to stay updated on my latest work.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
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
                  className="h-6"
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
                  className="h-6"
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
                className="h-6"
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
