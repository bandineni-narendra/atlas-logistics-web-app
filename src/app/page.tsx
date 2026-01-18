import Image from "next/image";
import { useTranslations } from "next-intl";
import ExcelUpload from "./components/ExcelUpload";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <ExcelUpload />
      </main>
    </div>
  );
}
