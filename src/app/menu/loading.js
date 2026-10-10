
export default function Loading() {
  return (
    <main className="min-h-screen bg-orange-50 px-6 py-12">
      <div className="mx-auto max-w-6xl animate-pulse">

        <div className="mb-4 h-10 w-48 rounded bg-gray-300" />

        <div className="mb-10 h-5 w-80 max-w-full rounded bg-gray-200" />

        <div className="mb-8 flex gap-3">
          <div className="h-10 w-20 rounded-full bg-gray-300" />
          <div className="h-10 w-32 rounded-full bg-gray-300" />
          <div className="h-10 w-28 rounded-full bg-gray-300" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="mb-4 h-6 w-32 rounded bg-gray-300" />

              <div className="mb-2 h-4 w-full rounded bg-gray-200" />

              <div className="mb-6 h-4 w-3/4 rounded bg-gray-200" />

              <div className="h-10 w-28 rounded-lg bg-gray-300" />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}