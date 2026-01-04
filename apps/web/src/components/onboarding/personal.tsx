import { Button } from "@vendly/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@vendly/ui/components/card";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";

export function PersonalForm() {
  return (
    <Card className="w-full max-w-4xl rounded-2xl py-10 gap-10">
      <CardHeader className="px-10">
        <CardTitle className="text-xl">Personal details</CardTitle>
        <CardDescription>
          Tell us a bit about yourself to get started.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-10">
        <form>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Smith"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" type="tel" placeholder="0712345678" required />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="px-10 justify-end">
        <Button type="submit" className="px-8">
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
