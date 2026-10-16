import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signUp } from "@/app/actions/auth";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Create an account",
  description: "Create an Addis Eats account to place and track orders.",
  robots: { index: false, follow: false, nocache: true },
};

function safeNext(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  try {
    const url = new URL(value, "https://addis-eats.invalid");
    return url.origin === "https://addis-eats.invalid"
      ? `${url.pathname}${url.search}${url.hash}`
      : "/";
  } catch {
    return "/";
  }
}

export default async function SignUpPage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  const target = safeNext(params?.next);

  if (session) redirect(target);

  return (
    <main className="page-shell grid min-h-[calc(100svh-10rem)] items-center gap-8 py-8 sm:py-12 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
      <section className="relative hidden min-h-[34rem] overflow-hidden rounded-2xl bg-surface-warm shadow-card lg:block" aria-hidden="true">
        <Image src="/images/hero.png" alt="" fill sizes="(max-width: 1023px) 0px, 50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </section>

      <div className="app-card mx-auto w-full max-w-xl p-6 sm:p-8 lg:p-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="mb-6 text-sm leading-6 text-foreground-muted">
          Sign up to place orders and follow delivery progress.
        </p>

        {params?.error && (
          <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {params.error === "invalid"
              ? "Enter your name, a valid email address, and a password with at least 8 characters."
              : "We could not create your account. Check the details and try again."}
          </p>
        )}

        <form action={signUp} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={target} />

          <div>
            <label htmlFor="name" className="block text-md font-medium">Full name</label>
            <input id="name" type="text" name="name" autoComplete="name" minLength={2} maxLength={80} required className="mt-1 min-h-12 w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-secondary" />
          </div>

          <div>
            <label htmlFor="email" className="block text-md font-medium">Email</label>
            <input id="email" type="email" name="email" autoComplete="email" required className="mt-1 min-h-12 w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="you@example.com" />
          </div>

          <div>
            <label htmlFor="password" className="block text-md font-medium">Password</label>
            <input id="password" type="password" name="password" autoComplete="new-password" minLength={8} required className="mt-1 min-h-12 w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-secondary" />
            <p className="mt-1 text-xs text-foreground-muted">Use at least 8 characters.</p>
          </div>

          <button type="submit" className="app-control mt-2 flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          Already have an account?{" "}
          <Link href={`/signin?next=${encodeURIComponent(target)}`} className="font-semibold text-secondary underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
