import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  InformationCircleIcon, 
  ArchiveBoxIcon, 
  CubeIcon, 
  StarIcon, 
  Bars3Icon, 
  XMarkIcon,
  PhotoIcon 
} from '@heroicons/react/24/solid';
import logo from "../../assets/codelogo.svg"


const Sidebar: React.FC = () => {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    setIsSidebarOpen(false); // Stänger sidofältet efter att en länk är vald
  };

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button 
        className="fixed top-4 left-4 z-50 bg-cyan-500 p-2 rounded-md text-white md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Overlay for when the sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
  className={`fixed left-0 top-0 h-full bg-black text-white p-6 shadow-xl transform transition-all duration-300 
  ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:w-48 md:h-full z-50`} // ändrat från w-64 till w-48
>
<div className="flex justify-center items-center mb-4">
  <img 
    src={logo} 
    alt="Logo" 
    className="h-32 md:h-64"  // Justera storleken: mindre på mobil, större på desktop
  />
</div>

        <ul className="space-y-6">
  <li>
    <Link
      to="/"
      onClick={() => handleLinkClick('home')}
      className={`flex items-center space-x-3 text-cyan-500 
      ${activeLink === 'home' ? 'bg-cyan-500 text-white' : ''} 
      rounded-full py-3 px-4 hover:bg-cyan-500 hover:text-white`}
    >
      <HomeIcon className="h-8 w-8" />
      <span className="inline">Home</span> {/* Ändrat här */}
    </Link>
  </li>

          <li>
            <Link
              to="/archive"
              onClick={() => handleLinkClick('archive')}
              className={`flex items-center space-x-3 text-cyan-500 
              ${activeLink === 'archive' ? 'bg-cyan-500 text-white' : ''} 
              rounded-full py-3 px-4 hover:bg-cyan-500 hover:text-white`}
            >
              <ArchiveBoxIcon className="h-8 w-8" />
              <span className="inline">Archive</span>
            </Link>
          </li>
         
          <li>
            <Link
              to="/about"
              onClick={() => handleLinkClick('about')}
              className={`flex items-center space-x-3 text-cyan-500 
              ${activeLink === 'about' ? 'bg-cyan-500 text-white' : ''} 
              rounded-full py-3 px-4 hover:bg-cyan-500 hover:text-white`}
            >
              <InformationCircleIcon className="h-8 w-8" />
              <span className="inline">About</span>
            </Link>
          </li>
          <li>
            <Link
              to="/wallpaper"
              onClick={() => handleLinkClick('wallpaper')}
              className={`flex items-center space-x-3 text-cyan-500 
              ${activeLink === 'contact' ? 'bg-cyan-500 text-white' : ''} 
              rounded-full py-3 px-4 hover:bg-cyan-500 hover:text-white`}
            >
              <PhotoIcon className="h-8 w-8" />
              <span className="inline">Wallpaper</span>
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              onClick={() => handleLinkClick('contact')}
              className={`flex items-center space-x-3 text-cyan-500 
              ${activeLink === 'contact' ? 'bg-cyan-500 text-white' : ''} 
              rounded-full py-3 px-4 hover:bg-cyan-500 hover:text-white`}
            >
              <CubeIcon className="h-8 w-8" />
              <span className="inline">Contact</span>
            </Link>
          </li>
          <li>
            <Link
              to="/reviews"
              onClick={() => handleLinkClick('reviews')}
              className={`flex items-center space-x-3 text-cyan-500 
              ${activeLink === 'reviews' ? 'bg-cyan-500 text-white' : ''} 
              rounded-full py-3 px-4 hover:bg-cyan-500 hover:text-white`}
            >
              <StarIcon className="h-8 w-8" />
              <span className="inline">Reviews</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;









