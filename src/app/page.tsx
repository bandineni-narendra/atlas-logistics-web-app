"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { PageContainer, PageHeader, Card, CardContent } from "@/components/ui";

export default function Home() {
  const t = useTranslations();

  const quickActions = [
    {
      title: t("navigation.oceanFreight"),
      description: "Upload and analyze ocean freight rate sheets",
      href: "/ocean",
      icon: "🚢",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: t("navigation.flow"),
      description: "Process multi-sheet Excel files sequentially",
      href: "/excel-flow",
      icon: "📊",
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome to ${t("common.appName")}`}
        description="Your logistics data processing platform. Select an option below to get started."
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card
              padding="lg"
              className="h-full hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <CardContent>
                <div
                  className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}
                >
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card padding="md">
            <CardContent>
              <p className="text-sm font-medium text-gray-500">Total Uploads</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">—</p>
              <p className="mt-1 text-xs text-gray-400">No data yet</p>
            </CardContent>
          </Card>
          <Card padding="md">
            <CardContent>
              <p className="text-sm font-medium text-gray-500">
                Processed Sheets
              </p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">—</p>
              <p className="mt-1 text-xs text-gray-400">No data yet</p>
            </CardContent>
          </Card>
          <Card padding="md">
            <CardContent>
              <p className="text-sm font-medium text-gray-500">
                Avg Confidence
              </p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">—</p>
              <p className="mt-1 text-xs text-gray-400">No data yet</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
