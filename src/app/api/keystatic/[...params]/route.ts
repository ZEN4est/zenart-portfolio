import { makeRouteHandler } from "@keystatic/next/route-handler";
import rawConfig from "../../../../../keystatic.config";

const config = (rawConfig as any).default || rawConfig;

export const { POST, GET } = makeRouteHandler({ config });