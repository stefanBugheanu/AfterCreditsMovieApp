export default function H1({ children, className = "" }) {
  return (
    <h1 className={`text-7xl font-bold mb-4 text-white ${className}`}>
      {children}
    </h1>
  );
}
