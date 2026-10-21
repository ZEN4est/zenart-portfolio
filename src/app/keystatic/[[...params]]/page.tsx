"use client";

import { makePage } from "@keystatic/next/ui/app";
import rawConfig from "../../../../keystatic.config";

export const dynamic = "force-dynamic";

const config = (rawConfig as any).default || rawConfig;

export default makePage(config);

