"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { validateEmail } from "@/utils/validation";

export default function LoginPage() {
  const t = useTranslations();
  const { login } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate
    const emailValidation = validateEmail(email);
    const newErrors: typeof errors = {};
    
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit
    setIsSubmitting(true);
    try {
      await login(email);
      // Hard redirect to home after successful login
      window.location.href = "/";
    } catch (error: any) {
      // Check if error is a localization key
      const errorMessage = error?.isLocalizationKey
        ? t(error.message)
        : error instanceof Error
        ? error.message
        : t("errors.auth.loginFailed");
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("auth.welcomeBack")}
          </h1>
          <p className="text-gray-600">{t("auth.loginSubtitle")}</p>
        </div>

        <Card padding="lg" shadow="md">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <Input
              type="email"
              label={t("auth.email")}
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
              fullWidth
              autoComplete="email"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("auth.loggingIn") : t("auth.login")}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
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
    </div>
  );
}
