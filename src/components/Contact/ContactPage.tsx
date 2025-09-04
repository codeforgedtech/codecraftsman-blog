import React, { useState } from "react";
import emailjs from "emailjs-com";

// ===== Hoisted components (outside ContactPage) =====
interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  isSuccess: boolean;
}

const Modal = ({ isOpen, message, onClose, isSuccess }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-11/12 max-w-md rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent shadow-2xl">
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-6 ring-1 ring-white/10">
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${isSuccess ? "text-green-400" : "text-red-400"}`}
            >
              {isSuccess ? "Success!" : "Failed!"}
            </div>
            <p className="mt-3 text-gray-300" aria-live="polite">{message}</p>
            <button
              onClick={onClose}
              className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable field components — HOISTED
export type FormDataShape = { name: string; email: string; subject: string; message: string };

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  name: keyof FormDataShape;
};

const Input: React.FC<InputProps> = ({ label, id, className, value, ...rest }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      id={id}
      value={(value as string) ?? ""}
      className={`w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 ring-1 ring-white/10 ${className || ""}`}
      {...rest}
    />
  </div>
);

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  id: string;
  name: keyof FormDataShape;
};

const TextArea: React.FC<TextAreaProps> = ({ label, id, className, value, ...rest }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <textarea
      id={id}
      value={(value as string) ?? ""}
      className={`w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 ring-1 ring-white/10 ${className || ""}`}
      {...rest}
    />
  </div>
);
// ===== /hoisted components =====

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormDataShape>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as keyof FormDataShape]: value }));
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await emailjs.send(
        "CodeForged", // Service ID
        "template_feezjfu", // Template ID
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "0_65CDZK2b9-yzfnG" // Public Key
      );
      setStatusMessage("Your message has been sent successfully!");
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatusMessage("Failed to send the message. Please try again later.");
      setIsSuccess(false);
    } finally {
      setIsModalOpen(true);
      setIsSending(false);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-black min-h-screen text-white font-sans px-2 sm:px-4 lg:px-6 py-8 w-full overflow-x-hidden">
      <div className="w-full">
        {/* Header */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] pb-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent mb-8">
          Contact Me
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Card */}
          <div className="lg:col-span-2 rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-6 sm:p-8 ring-1 ring-white/10 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Get in Touch
              </h2>

              <form onSubmit={sendEmail} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="name"
                    label="Name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    name="name"
                    autoComplete="name"
                  />
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    name="email"
                    autoComplete="email"
                  />
                </div>
                <Input
                  id="subject"
                  label="Subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  name="subject"
                />
                <TextArea
                  id="message"
                  label="Message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  name="message"
                />

                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30 disabled:opacity-50"
                >
                  {isSending ? (
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  ) : null}
                  {isSending ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>
          </div>

          {/* Contact methods */}
          <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-6 ring-1 ring-white/10 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Other Ways to Contact
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Feel free to reach out through email or connect with me on these platforms:
              </p>

              <ul className="mt-5 space-y-3">
                {/* Email */}
                <li className="flex items-center justify-between rounded-lg bg-slate-800/60 ring-1 ring-white/10 p-3">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-200 font-medium">Email</span>
                  </div>
                  <a href="mailto:master@codecraftsman.se" className="text-cyan-400 hover:text-cyan-300">master@codecraftsman.se</a>
                </li>

                {/* Discord */}
                <li className="flex items-center justify-between rounded-lg bg-slate-800/60 ring-1 ring-white/10 p-3">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.317 4.369A19.791 19.791 0 0015.946 3c-.179.312-.388.73-.531 1.056a18.151 18.151 0 00-6.83 0c-.143-.326-.35-.744-.531-1.056A19.77 19.77 0 003.683 4.369a20.021 20.021 0 00-1.714 12.85 19.9 19.9 0 005.993 2.908c.49-.672.925-1.385 1.298-2.132a12.683 12.683 0 01-1.986-.961c.167-.127.33-.26.488-.397a14.64 14.64 0 0011.418 0c.158.137.321.27.488.397a12.683 12.683 0 01-1.986.961c.373.747.808 1.46 1.298 2.132a19.89 19.89 0 005.993-2.908 20.03 20.03 0 00-1.714-12.85zM9.113 13.883c-1.057 0-1.921-.951-1.921-2.122 0-1.17.85-2.121 1.921-2.121 1.07 0 1.935.951 1.921 2.121 0 1.17-.85 2.122-1.921 2.122zm5.774 0c-1.057 0-1.921-.951-1.921-2.122 0-1.17.85-2.121 1.921-2.121 1.07 0 1.935.951 1.921 2.121 0 1.17-.851 2.122-1.921 2.122z" />
                    </svg>
                    <span className="text-gray-200 font-medium">Discord</span>
                  </div>
                  <a href="https://discord.gg/GUDy5sxB" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">CodeCraftsMan Server</a>
                </li>

                {/* Bandcamp */}
                <li className="flex items-center justify-between rounded-lg bg-slate-800/60 ring-1 ring-white/10 p-3">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M22 5H14L2 19h8L22 5z" />
                    </svg>
                    <span className="text-gray-200 font-medium">Bandcamp</span>
                  </div>
                  <a
                    href="https://codecraftsmans.bandcamp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-300 hover:text-teal-200"
                  >
                    codecraftsmans
                  </a>
                </li>

                {/* SoundCloud */}
                <li className="flex items-center justify-between rounded-lg bg-slate-800/60 ring-1 ring-white/10 p-3">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.6 10.5c-.3 0-.5 0-.8.1-.4-2.5-2.4-4.4-4.9-4.4-1.2 0-2.2.4-3.1 1-.2.1-.3.3-.3.5v7.1c0 .3.2.5.5.5h8.6c1.7 0 3.1-1.4 3.1-3.1s-1.4-3.2-3.1-3.2zM1.9 10.7c-.3 0-.6.3-.6.6v3.4c0 .3.3.6.6.6s.6-.3.6-.6v-3.4c0-.3-.3-.6-.6-.6zm2.1-1.1c-.3 0-.6.3-.6.6v5.6c0 .3.3.6.6.6s.6-.3.6-.6v-5.6c0-.3-.3-.6-.6-.6zm2.1-.9c-.3 0-.6.3-.6.6v7.4c0 .3.3.6.6.6s.6-.3.6-.6V9.3c0-.4-.2-.6-.6-.6z" />
                    </svg>
                    <span className="text-gray-200 font-medium">SoundCloud</span>
                  </div>
                  <a href="https://soundcloud.com/codecraftsman" target="_blank" rel="noopener noreferrer" className="text-orange-300 hover:text-orange-200">codecraftsman</a>
                </li>

                {/* Spotify */}
                <li className="flex items-center justify-between rounded-lg bg-slate-800/60 ring-1 ring-white/10 p-3">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0C5.371 0 0 5.373 0 12c0 6.627 5.371 12 12 12s12-5.373 12-12c0-6.627-5.371-12-12-12zm5.356 17.273c-.229.373-.709.49-1.084.264-2.971-1.82-6.717-2.232-11.106-1.225-.435.1-.883-.176-.984-.611-.1-.435.176-.883.611-.984 4.865-1.103 9.067-.631 12.427 1.43.375.229.493.709.264 1.126zm1.541-2.732c-.295.478-.922.631-1.4.336-3.404-2.1-8.591-2.709-12.616-1.487-.547.166-1.135-.137-1.299-.684-.166-.547.137-1.135.684-1.299 4.547-1.406 10.271-.732 14.166 1.709.478.295.631.922.336 1.425zm.162-2.82c-4.049-2.45-10.729-2.676-14.584-1.479-.664.195-1.365-.166-1.56-.83-.195-.664.166-1.365.83-1.56 4.484-1.336 11.902-1.078 16.533 1.709.59.354.779 1.125.424 1.715-.355.59-1.125.779-1.643.445z" />
                    </svg>
                    <span className="text-gray-200 font-medium">Spotify</span>
                  </div>
                  <a href="https://open.spotify.com/artist/0voqr9KSdMAufUnbljpbuH" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">codecraftsman</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* GitHub Card */}
        <div className="mt-6 rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-6 ring-1 ring-white/10 shadow-2xl text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Connect with me on GitHub
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Check out my GitHub profile and explore my projects. Follow to stay updated on my latest work.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-5">
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
                  loading="lazy"
                  decoding="async"
                />
              </a>
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
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <img
                src="https://img.shields.io/github/last-commit/codeforgedtech/codecraftsman-blog?style=social"
                alt="Last commit"
                className="h-6"
                loading="lazy"
                decoding="async"
              />
              <img
                src="https://img.shields.io/github/forks/codeforgedtech/codecraftsman-blog?style=social"
                alt="GitHub Forks"
                className="h-6"
                loading="lazy"
                decoding="async"
              />
              <img
                src="https://img.shields.io/github/license/codeforgedtech/codecraftsman-blog?style=social"
                alt="GitHub License"
                className="h-6"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
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



