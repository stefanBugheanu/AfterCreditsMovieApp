export default function P({ children, className = "" }) {
  return <p className={`text-white text-2xl ${className}`}>{children}</p>;
}
