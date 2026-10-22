"use client";

import { makePage } from "@keystatic/next/ui/app";
import rawConfig from "../../../../keystatic.config";
import AdminLockGate from "@/components/AdminLockGate";

export const dynamic = "force-dynamic";

const config = (rawConfig as any).default || rawConfig;
const KeystaticComponent = makePage(config);

export default function KeystaticPage(props: any) {
  return (
    <AdminLockGate title="Keystatic CMS">
      <KeystaticComponent {...props} />
    </AdminLockGate>
  );
}
