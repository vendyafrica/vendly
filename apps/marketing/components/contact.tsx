import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export function Contact() {
  return (
    <section className="bg-background @container py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            Get in touch
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl text-base sm:text-lg text-balance">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="@xl:grid-cols-5 mt-12 grid gap-10">
          <div className="@xl:col-span-2 space-y-6 *:space-y-2">
            <div>
              <p className="text-foreground text-sm font-medium">Email</p>
              <Link
                href="mailto:hello@example.com"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                hello@vendlyafrica.store
              </Link>
            </div>

            <div>
              <p className="text-foreground text-sm font-medium">Phone</p>
              <Link
                href="tel:+1234567890"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                +256 780 808992
              </Link>
            </div>

            <div>
              <p className="text-foreground text-sm font-medium">Office Hours</p>
              <p className="text-muted-foreground text-sm">Monday - Friday: 9:00 AM - 5:00 PM</p>
            </div>
          </div>

          <Card className="@xl:col-span-3 p-6">
            <form action="" className="space-y-5">
              <div className="@md:grid-cols-2 grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm">
                  Subject
                </Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us more..."
                  required
                  className="min-h-28"
                />
              </div>

              <Button className="w-full">Send Message</Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
