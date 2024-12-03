import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term); // Skicka uppdaterad sökterm
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search posts..."
        className="w-full max-w-lg p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );
};

export default SearchBar;
