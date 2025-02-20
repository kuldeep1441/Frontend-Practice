import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface ISearchBarProps {
  containerClass?: string;
  setSearchTerm: (value:string) => void;
}

const SearchBar: React.FC<ISearchBarProps> = ({ containerClass, setSearchTerm }) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
        setSearchTerm(searchQuery);
    }, 300); // Add a small delay for better performance

    return () => clearTimeout(timer);
  }, [searchQuery, setSearchTerm]);

  return (
    <form
      className={`relative flex border border-white items-center w-full mx-auto ${containerClass || ""}`}
    >
      <input
        type="text"
        placeholder="Search Leads"
        className="text-[1.125em] sm:text-[0.875em] md:text-[0.875em] font-[500] flex-grow bg-transparent text-white w-full p-[0.625em] focus:outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        type="button"
        className="absolute right-3 flex items-center justify-center bg-transparent"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M10 18C11.775 17.9996 13.4988 17.4054 14.897 16.312L19.293 20.708L20.707 19.294L16.311 14.898C17.405 13.4997 17.9996 11.7754 18 10C18 5.589 14.411 2 10 2C5.589 2 2 5.589 2 10C2 14.411 5.589 18 10 18ZM10 4C13.309 4 16 6.691 16 10C16 13.309 13.309 16 10 16C6.691 16 4 13.309 4 10C4 6.691 6.691 4 10 4Z"
            fill="white"
            fillOpacity="0.8"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;