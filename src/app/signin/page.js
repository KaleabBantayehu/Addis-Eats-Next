import { redirect } from "next/navigation";
import { createSession, getSession } from "@/lib/session";

export const metadata = {
  title: "Sign In",
  description: "Log in to your Addis Eats account to manage orders and delivery addresses.",
  robots: { index: false, follow: false, nocache: true },
};

function sanitizeNextUrl(nextParam) {
  if (typeof nextParam !== "string" || !nextParam.startsWith("/") || nextParam.startsWith("//")) {
    return "/";
  }

  try {
    const url = new URL(nextParam, "https://addis-eats.invalid");

    return url.origin === "https://addis-eats.invalid"
      ? `${url.pathname}${url.search}${url.hash}`
      : "/";
  } catch {
    return "/";
  }
}

export default async function SignInPage({ searchParams }) {
  const session = await getSession();
  const resolvedSearchParams = await searchParams;
  const target = sanitizeNextUrl(resolvedSearchParams?.next);

  if (session) {
    redirect(target);
  }

  async function handleSignIn(formData) {
    "use server";

    const email = formData.get("email");
    const password = formData.get("password");

    const userSession = await createSession(email, password);

    if (userSession) {
      redirect(target);
    }

    redirect(`/signin?error=invalid&next=${encodeURIComponent(target)}`);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Sign In Addis Eats</h1>

      {resolvedSearchParams?.error === "invalid" && (
        <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-800">
          The email or password is incorrect. Please try again.
        </p>
      )}

      <form action={handleSignIn} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-md font-medium">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            className="w-full rounded border p-2 mt-1"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-md font-medium">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            required
            className="w-full rounded border p-2 mt-1"
            placeholder="password"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-orange-600 px-4 py-2 font-bold text-white hover:bg-orange-700"
        >
          Sign In
        </button>
      </form>

      <div className="p-5 m-6 bg-orange-200">
        <h3 className="text-white-400 font-bold">username & passwords</h3>
        <h4 className="text-white-400 font-bold">admin</h4>
        <p>addiseats@admin.com</p><span>admin123</span>
        <h4 className="text-white-400 font-bold">staff</h4>
        <p>addisEats@gmail.com</p><span>addis@password</span>
        <h4 className="text-white-400 font-bold">customer</h4>
        <p>ermiyasDereje@gmail.com</p><span>ermi123</span>
      </div>
    </main>
  );
}