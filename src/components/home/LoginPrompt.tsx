"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, Button } from "@/components/ui";

/**
 * Login Prompt Component
 * Displayed when user is not authenticated
 */
export function LoginPrompt() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4">
      <Card padding="lg" className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("common.appName")}
          </h1>
          <p className="text-gray-600 mb-6">
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
        <p className="mt-4 text-sm text-gray-600">
          {t("auth.noAccount")}{" "}
          <Link
            href="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            {t("auth.signup")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
