"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
} from "@/utils/validation";

export default function SignupPage() {
  const t = useTranslations();
  const { signup } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate all fields
    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    const confirmPasswordValidation = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    
    const newErrors: typeof errors = {};
    
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    }
    
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }
    
    if (!confirmPasswordValidation.isValid) {
      newErrors.confirmPassword = confirmPasswordValidation.error;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit
    setIsSubmitting(true);
    try {
      await signup(formData.email, formData.password, formData.name);
      // Hard redirect to home after successful signup
      window.location.href = "/";
    } catch (error: any) {
      // Check if error is a localization key
      const errorMessage = error?.isLocalizationKey
        ? t(error.message)
        : error instanceof Error
        ? error.message
        : t("errors.auth.signupFailed");
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
            {t("auth.createAccount")}
          </h1>
          <p className="text-gray-600">{t("auth.signupSubtitle")}</p>
        </div>

        <Card padding="lg" shadow="md">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <Input
              type="text"
              label={t("auth.fullName")}
              placeholder={t("auth.namePlaceholder")}
              value={formData.name}
              onChange={handleChange("name")}
              error={errors.name}
              required
              fullWidth
              autoComplete="name"
            />

            <Input
              type="email"
              label={t("auth.email")}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange("email")}
              error={errors.email}
              required
              fullWidth
              autoComplete="email"
            />

            <Input
              type="password"
              label={t("auth.password")}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange("password")}
              error={errors.password}
              required
              fullWidth
              autoComplete="new-password"
              helperText="Min 8 characters, 1 uppercase, 1 lowercase, 1 number"
            />

            <Input
              type="password"
              label={t("auth.confirmPassword")}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              error={errors.confirmPassword}
              required
              fullWidth
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("auth.signingUp") : t("auth.signup")}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {t("auth.haveAccount")}{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              {t("auth.login")}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
