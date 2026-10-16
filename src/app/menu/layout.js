export default function MenuLayout({ children }) {
  return (
    <div className="page-shell mb-8 py-5 sm:py-8">
      <section className="min-w-0">{children}</section>
    </div>
  );
}
