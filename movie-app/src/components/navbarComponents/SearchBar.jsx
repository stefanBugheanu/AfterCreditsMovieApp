export default function SearchBar() {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for movies..."
        className="w-70 max-w-100 p-2 rounded-md bg-gray-800 text-white focus:outline-none "
      />
    </div>
  );
}
