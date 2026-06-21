export default function HomePageLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col max-w-[85%] mx-auto px-4">
      <div className="flex-1">{children}</div>
    </div>
  );
}
