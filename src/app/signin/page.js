import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { signIn, signInWithGoogle } from "@/app/actions/auth";

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

      {resolvedSearchParams?.error === "oauth" && (
        <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          Google sign-in could not be started. Please try again.
        </p>
      )}

      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={target} />
        <button
          type="submit"
          className="app-control flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 font-semibold text-foreground transition-colors hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-foreground-muted">
        <span className="h-px flex-1 bg-border" />
        or continue with email
        <span className="h-px flex-1 bg-border" />
      </div>

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

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.65 5.94c4.47-4.13 7.12-10.2 7.12-17.59Z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.86l-7.65-5.94c-2.13 1.43-4.86 2.28-8.25 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
    </svg>
  );
}
