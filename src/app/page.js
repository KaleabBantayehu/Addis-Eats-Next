import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Welcome to addis eats</h1>
      <p className="text-[#121c2a] font-bold mb-6">Discover delicious Ethiopian dishes
        delivered to your doorstep.</p>
        <Link href='/menu' className="text-[#121c2a] font-bold rounded-full px-5 py-2 font-medium bg-orange-600">
        Explore Our Menu</Link>
    </main>
  )
}