import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { signIn } from "@/app/actions/auth";

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

  return (
    <main className="page-shell grid min-h-[calc(100svh-10rem)] items-center gap-8 py-8 sm:py-12 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
      <section className="relative hidden min-h-[34rem] overflow-hidden rounded-2xl bg-surface-warm shadow-card lg:block" aria-hidden="true">
        <Image src="/images/hero.png" alt="" fill sizes="(max-width: 1023px) 0px, 50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </section>
      <div className="app-card mx-auto w-full max-w-xl p-6 sm:p-8 lg:p-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Sign In Addis Eats</h1>
      <p className="mb-6 text-sm leading-6 text-foreground-muted">Log in to your account to manage your orders.</p>

      {resolvedSearchParams?.error === "invalid" && (
        <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          The email or password is incorrect. Please try again.
        </p>
      )}

      {resolvedSearchParams?.registered === "1" && (
        <p role="status" className="mb-4 rounded-lg border border-secondary/30 bg-surface-muted p-3 text-foreground">
          Account created. Check your email for a confirmation link, then sign in.
        </p>
      )}

      {resolvedSearchParams?.error === "confirmation" && (
        <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          That confirmation link is invalid or expired. Try creating your account again or request a new link.
        </p>
      )}

      <form action={signIn} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={target} />
        <div>
          <label htmlFor="email" className="block text-md font-medium">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            className="mt-1 min-h-12 w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-base text-foreground transition-colors placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-md font-medium">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            className="mt-1 min-h-12 w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-base text-foreground transition-colors placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="password"
          />
        </div>

        <button
          type="submit"
          className="app-control mt-2 flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground-muted">
        New to Addis Eats?{" "}
        <Link href={`/signup?next=${encodeURIComponent(target)}`} className="font-semibold text-secondary underline underline-offset-4">
          Create an account
        </Link>
      </p>
      </div>
    </main>
  );
}
