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
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

export function BusinessForm() {
  return (
    <Card className="w-full max-w-4xl rounded-2xl py-10 gap-10">
      <CardHeader className="px-10">
        <CardTitle className="text-xl">Business Information</CardTitle>
        <CardDescription>
          Tell us about your business
        </CardDescription>
      </CardHeader>

      <CardContent className="px-10">
        <form>
          <div className="space-y-4 mt-6">
            <Label>Product Categories</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Fashion",
                "Beauty", 
                "Home & Living",
                "Electronics",
                "Sports",
                "Books",
                "Toys",
                "Food",
                "Health"
              ].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox.Root
                    id={category}
                    className="h-4 w-4 rounded border border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  >
                    <Checkbox.Indicator className="flex items-center justify-center text-white">
                      <CheckIcon className="h-3 w-3" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="px-10 justify-end">
        <Button type="submit" className="px-8">
          Connect Instagram
        </Button>
      </CardFooter>
    </Card>
  );
}
