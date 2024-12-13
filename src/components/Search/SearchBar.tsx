import React from 'react';

interface SearchBarProps {
  value: string; // Add the value prop to accept the search term
  onSearch: (term: string) => void; // Add the onSearch prop to handle the search functionality
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onSearch }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value); // Call the onSearch function when the input changes
  };

  return (
    <input
      type="text"
      value={value} // Bind the input value to the passed value prop
      onChange={handleInputChange} // Trigger the onSearch function when the user types
      className="sm:w-48 m-3 p-2 bg-gray-800 text-cyan-400 border border-gray-600 rounded text-sm sm:text-base"
      placeholder="Search..."
    />
  );
};

export default SearchBar;

