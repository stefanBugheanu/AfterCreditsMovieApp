export default function CenterMessage({ children, variant = "info" }) {
  const colorMap = {
    info: "text-zinc-400",
    error: "text-red-400",
    muted: "text-zinc-500",
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <p
        className={`font-serif text-2xl tracking-tight ${
          colorMap[variant] ?? colorMap.info
        }`}
      >
        {children}
      </p>
    </div>
  );
}
