import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { WhatsappBusinessFreeIcons, InstagramFreeIcons } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Logo } from "./logo";

const sections = [
  {
    title: "Company",
    links: [
      { title: "About", href: "/#about" },
      { title: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Product",
    links: [
      { title: "Features", href: "/#features" },
      { title: "Pricing", href: "/#pricing" },
      { title: "Integrations", href: "/#integrations" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Community", href: "/#community" },
      { title: "Tutorials", href: "/#tutorials" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "/#privacy" },
      { title: "Terms of Service", href: "/#terms" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-muted dark:bg-card border-t px-6 py-2">
      <div className="mx-auto max-w-7xl">
        <div className="pt-8 pb-12">
          <div className="mt-10 grid grid-cols-2 gap-12 sm:grid-cols-4 lg:grid-cols-6">
            <div className="col-span-full lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2">
                <Logo />
              </Link>
              <p className="text-muted-foreground mt-1.5">
                Vendly gives creators and small businesses online storefronts to
                sell anywhere. {" "}
              </p>
            </div>
            {sections.map(({ title, links }) => (
              <div key={title}>
                <h3 className="text-lg font-semibold">{title}</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {links.map(({ title, href }) => (
                    <li key={title}>
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-primary"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col-reverse items-center justify-center gap-6 px-2 pt-6 pb-4 sm:flex-row sm:justify-between">
          <p className="text-muted-foreground text-sm font-medium">
            &copy; {new Date().getFullYear()} Vendly. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/">
              <HugeiconsIcon
                icon={WhatsappBusinessFreeIcons}
                className="text-muted-foreground h-5 w-5"
              />
            </Link>
            <Link href="/">
              <HugeiconsIcon
                icon={InstagramFreeIcons}
                className="text-muted-foreground h-5 w-5"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
