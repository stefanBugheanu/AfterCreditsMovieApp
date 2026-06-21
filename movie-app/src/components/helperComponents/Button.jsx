export default function Button({ children, className = "", onClick }) {
  return (
    <button
      className={`w-fit text-white px-5 py-3 hover: cursor-pointer rounded-lg ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
