import { ImageResponse } from "next/og";
import { Mark } from "../icon-192.png/route";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<Mark />, { width: 512, height: 512 });
}
