"use client";

import { makePage } from "@keystatic/next/ui/app";
import rawConfig from "../../../../keystatic.config";

// Zabezpieczenie przed podwójnym .default w Turbopacku:
const config = (rawConfig as any).default || rawConfig;

const Keystatic = makePage(config);

export default function Page() {
  return <Keystatic />;
}