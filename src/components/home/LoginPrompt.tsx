"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, Button } from "@/components/ui";

/**
 * Login Prompt — M3 clean surface card
 */
export function LoginPrompt() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <Card padding="lg" className="max-w-sm w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4">
            <span className="text-white font-medium text-xl">A</span>
          </div>
          <h1 className="text-xl font-medium text-textPrimary mb-1">
            {t("common.appName")}
          </h1>
          <p className="text-sm text-textSecondary">
            Please login to access the logistics platform
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push("/login")}
        >
          {t("auth.login")}
        </Button>
        <p className="mt-4 text-sm text-textSecondary">
          {t("auth.noAccount")}{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:text-primary-hover"
          >
            {t("auth.signup")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
