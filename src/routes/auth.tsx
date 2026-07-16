import {
  createFileRoute,
  redirect,
  useNavigate,
  Link,
} from "@tanstack/react-router";
import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";


export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AuthPage,
});

type LoadingState = "google" | "email" | null;

function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState<LoadingState>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setLoading("google");
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Google sign-in failed.";

      setError(message);
      toast.error(message);
      setLoading(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading("email");
    setError(null);

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.session) {
          toast.success("Your Forge account has been created.");
          await navigate({ to: "/dashboard" });
          return;
        }

        toast.success("Check your email to confirm your account.");
        return;
      }

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        throw signInError;
      }

      toast.success("Welcome back.");
      await navigate({ to: "/dashboard" });
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Authentication failed.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(null);
    }
  }

  function changeMode() {
    setMode((current) =>
      current === "signin" ? "signup" : "signin",
    );
    setError(null);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="border-b border-border px-6 py-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
      </nav>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-sm bg-foreground">
              <div className="size-2 rotate-45 bg-background" />
            </div>

            <span className="text-sm font-extrabold uppercase tracking-tighter">
              Forge
            </span>
          </div>

          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {mode === "signin" ? "Return to the anvil" : "First strike"}
          </p>

          <h1 className="mb-8 text-3xl font-extrabold leading-[0.95] tracking-tight">
            {mode === "signin" ? "Welcome back." : "Begin forging."}
          </h1>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading !== null}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GoogleIcon />
            {loading === "google"
              ? "Connecting..."
              : "Continue with Google"}
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              or
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <Input
                label="Name"
                value={name}
                onChange={setName}
                type="text"
                placeholder="Your name"
                required
              />
            )}

            <Input
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
            />

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading !== null}
              className="h-11 w-full rounded-lg bg-foreground text-sm font-semibold text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading === "email"
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {mode === "signin"
              ? "New to Forge?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={changeMode}
              disabled={loading !== null}
              className="font-semibold text-foreground transition-colors hover:text-accent disabled:opacity-50"
            >
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

function Input({
  label,
  value,
  onChange,
  ...props
}: InputProps) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>

      <input
        {...props}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 0 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}