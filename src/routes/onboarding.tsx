import {
  createFileRoute,
  redirect,
} from "@tanstack/react-router";

import {
  OnboardingPage,
} from "@/features/onboarding";

import {
  supabase,
} from "@/integrations/supabase/client";

export const Route =
  createFileRoute("/onboarding")({
    ssr: false,

    beforeLoad: async () => {
      const { data } =
        await supabase.auth.getSession();

      if (!data.session) {
        throw redirect({
          to: "/auth",
        });
      }
    },

    component: OnboardingPage,
  });