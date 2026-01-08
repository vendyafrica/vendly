"use client";

import { Render, type Data } from "@measured/puck";
import { puckConfig, type Components, type RootProps } from "@/lib/puck-config";
import { EditModeProvider } from "./EditModeProvider";

interface PuckRendererProps {
  data: Data<Components, RootProps>;
}

export function PuckRenderer({ data }: PuckRendererProps) {
  return (
    <EditModeProvider>
      <Render config={puckConfig} data={data} />
    </EditModeProvider>
  );
}

export default PuckRenderer;
