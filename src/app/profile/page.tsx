"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const { user } = useAuth();
  const t = useTranslations();

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textPrimary mb-2">
          {t("navigation.profile")}
        </h1>
        <p className="text-textSecondary">{t("profile.subtitle")}</p>
      </div>

      <div className="space-y-6">
        {/* Profile Info Card */}
        <Card padding="lg">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-textPrimary mb-1">
                {user.name}
              </h2>
              <p className="text-textSecondary mb-4">{user.email}</p>
              {user.provider && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-soft text-primary rounded-full text-sm">
                  {user.provider === "google" ? "🔗" : "📧"}
                  <span className="capitalize">
                    {user.provider} {t("profile.account")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Account Details Card */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">
            {t("profile.accountDetails")}
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-textSecondary">{t("profile.userId")}</span>
              <span className="font-mono text-sm text-textPrimary">{user.id}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-textSecondary">{t("auth.email")}</span>
              <span className="text-textPrimary">{user.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-textSecondary">{t("auth.fullName")}</span>
              <span className="text-textPrimary">{user.name}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-textSecondary">{t("profile.authMethod")}</span>
              <span className="text-textPrimary capitalize">
                {user.provider || t("profile.manual")}
              </span>
            </div>
          </div>
        </Card>

        {/* Activity Card */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">
            {t("profile.recentActivity")}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
              <span className="text-2xl">🚢</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-textPrimary">
                  {t("profile.oceanFreightData")}
                </p>
                <p className="text-xs text-textSecondary">{t("profile.lastAccessed")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
              <span className="text-2xl">✈️</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-textPrimary">
                  {t("profile.airFreightData")}
                </p>
                <p className="text-xs text-textSecondary">{t("profile.lastAccessed")}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
