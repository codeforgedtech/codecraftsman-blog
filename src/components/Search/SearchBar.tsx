import React from "react";

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
      className="p-2 bg-white text-cyan-600 border border-cyan-600 rounded-lg text-sm shadow hover:border-cyan-400 transition-all"
      placeholder="Search..."
    />
  );
};

export default SearchBar;
