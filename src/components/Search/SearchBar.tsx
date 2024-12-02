import React, { useState } from 'react';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSearchSubmit} className="flex items-center space-x-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search posts..."
          className="w-80 px-4 py-2 rounded-md text-black"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;