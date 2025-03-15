import { Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Button } from "~/lib/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/lib/components/ui/card";

export function Pricing() {
  return (
    <div className="mt-10 flex  flex-col items-center justify-center  text-white p-0">
      <div className="w-full max-w-5xl mx-auto text-center space-y-4">
        <div className="space-y-4">
          <div className="text-2xl font-bold tracking-tight sm:text-3xl">
            {/* Choose Your Plan */}
            currently free
          </div>
          {/* <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your needs. Enjoy our generous free tier or unlock
            premium features with our paid plan.
          </p> */}
        </div>

        <div className="flex justify-center cursor-pointer">
          {/* <Tabs defaultValue="monthly">
            <TabsList className="text-sm gap-4 cursor-pointer border border-muted rounded-full p-1 bg-muted/80">
              <TabsTrigger
                value="monthly"
                className="cursor-pointer rounded-full px-4 py-1 data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-white/70"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="cursor-pointer rounded-full px-4 py-1 data-[state=active]:bg-black data-[state=active]:text-white text-white/60 data-[state=inactive]:text-white/70"
              >
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs> */}
        </div>

        {/* <div className="pt-8 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"> */}
        <div className="flex justify-center items-center">
          {/* Free Plan */}
          <Card className="ml-1 text-left bg-black border-1 border-white/40 text-white scale-95 transform px-4">
            <CardHeader className="pb-0 pt-0 px-6">
              <h2 className="text-2xl font-bold">Free</h2>
              <p className="text-muted-foreground">
                Get started with essential features at no cost.
              </p>
            </CardHeader>
            <CardContent className="ml-1 space-y-2 px-6 py-0">
              <div className="text-4xl font-bold">$0</div>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start">
                  {/* <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-gray-500" /> */}
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />

                  <span>AI Chat</span>
                </li>
                {/* <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Up to 4 requests per day (refreshed every 12 hours)</span>
                </li> */}
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Spreadsheets Formula Assistant AI</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Spreadsheets Scripts for Automation Assistant AI</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>SQL Query Assistant AI</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Regex Assistant AI</span>
                </li>
                {/* <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Excel Table Template Generator</span>
                </li> */}
                <li className="flex items-start">
                  <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                  <span>Customer support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="px-6  pt-4">
              <Link className="w-full " to="/login">
                <Button
                  variant="outline"
                  className="w-full text-md  text-black dark:text-white px-2 py-4 hover:bg-muted cursor-pointer"
                >
                  Get started!
                  <span className="ml-1 text-lg">→</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          {/* <Card className="text-left bg-black border-1 border-white/40 text-white relative overflow-hidden">
            <CardHeader className="pb-4 pt-4 px-6">
              <h2 className="text-3xl font-bold">Pro</h2>
              <p className="text-muted-foreground">
                Unlock full potential with More Credits and better AI Assistant.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 px-6">
              <div className="text-4xl font-bold">$7.99/month</div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <div>
                    <span>AI Chat</span>
                    <span className="ml-2 text-xs bg-gray-800 px-2 py-1 rounded-full">
                      New!
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Up to 1000 requests per day (30,000 per month)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Spreadsheets Formula Assistant AI</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Spreadsheets Scripts for Automation Assistant AI</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>SQL Query Assistant AI</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Regex Assistant AI</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Excel Table Template Generator</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Priority access to customer support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-4">
              <Button className="w-full cursor-pointer bg-white text-black hover:bg-gray-200">
                Subscribe Now
                <span className="ml-1 text-lg">→</span>{" "}
              </Button>
            </CardFooter>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
