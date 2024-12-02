import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, InformationCircleIcon, ArchiveBoxIcon, CubeIcon } from '@heroicons/react/24/solid';

const Sidebar: React.FC = () => {
  const [activeLink, setActiveLink] = useState<string | null>(null); // För att hålla koll på den aktiva länken

  const handleLinkClick = (link: string) => {
    setActiveLink(link); // Uppdatera den aktiva länken när du klickar på en
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-black text-white p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-cyan-500 mb-8">Menu</h2>
      <ul className="space-y-6">
        {/* Home Link */}
        <li className={`flex items-center transition-all duration-300`}>
          <Link
            to="/"
            onClick={() => handleLinkClick('home')}
            className={`flex items-center space-x-3 transition-all duration-300 text-cyan-500
            ${activeLink === 'home' ? 'bg-cyan-500 text-white w-40' : 'w-16'} 
            rounded-full py-3 px-4 hover:bg-cyan-500 hover:text-white`}
          >
            <HomeIcon className="h-8 w-8" />
            {activeLink === 'home' && <span className="ml-2">Home</span>}
          </Link>
        </li>

        {/* About Link */}
        <li className={`flex items-center transition-all duration-300`}>
          <Link
            to="/about"
            onClick={() => handleLinkClick('about')}
            className={`flex items-center space-x-3 transition-all duration-300 text-cyan-500
            ${activeLink === 'about' ? 'bg-cyan-500 text-white w-40' : 'w-16'} 
            rounded-full py-3 px-4 hover:bg-cyan-500 hover:text-white`}
          >
            <InformationCircleIcon className="h-8 w-8" />
            {activeLink === 'about' && <span className="ml-2">About</span>}
          </Link>
        </li>

        {/* Blog Link */}
        <li className={`flex items-center transition-all duration-300`}>
          <Link
            to="/blog"
            onClick={() => handleLinkClick('blog')}
            className={`flex items-center space-x-3 transition-all duration-300 text-cyan-500
            ${activeLink === 'blog' ? 'bg-cyan-500 text-white w-40' : 'w-16'} 
            rounded-full py-3 px-4 hover:bg-cyan-500 hover:text-white`}
          >
            <ArchiveBoxIcon className="h-8 w-8" />
            {activeLink === 'blog' && <span className="ml-2">Arcive</span>}
          </Link>
        </li>

        {/* Contact Link */}
        <li className={`flex items-center transition-all duration-300`}>
          <Link
            to="/contact"
            onClick={() => handleLinkClick('contact')}
            className={`flex items-center space-x-22 transition-all duration-300 text-cyan-500
            ${activeLink === 'contact' ? 'bg-cyan-500 text-white w-40' : 'w-16'} 
            rounded-full py-3 px-4 hover:bg-cyan-500 hover:text-white`}
          >
            <CubeIcon className="h-8 w-8" />
            {activeLink === 'contact' && <span className="ml-2">Contact</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;





