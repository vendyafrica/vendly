import { draftMode } from "next/headers";
import VisualEditing from "@/components/VisualEditing";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <>
      {children}
      {isDraftMode && <VisualEditing />}
    </>
  );
}
