export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div
        className="w-8 h-8 border-2 border-zinc-700 rounded-full animate-spin"
        style={{ borderTopColor: "var(--color-primary)" }}
      />
    </div>
  );
}
