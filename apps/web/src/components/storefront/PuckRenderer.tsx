"use client";

import { Render, type Data } from "@measured/puck";
import { puckConfig, type Components, type RootProps } from "@/lib/puck-config";

interface PuckRendererProps {
  data: Data<Components, RootProps>;
}

export function PuckRenderer({ data }: PuckRendererProps) {
  return <Render config={puckConfig} data={data} />;
}

export default PuckRenderer;
