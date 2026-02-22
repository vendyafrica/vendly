import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-semibold text-xl">
      <Image src="/vendly.png" alt="Logo" width={40} height={40} />
      <span>vendly.</span>
    </div>
  );
}
