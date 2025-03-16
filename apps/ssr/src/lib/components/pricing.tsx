import { Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Button } from "~/lib/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/lib/components/ui/card";

export function Pricing() {
  return (
    <div className="mt-16 flex  flex-col items-center justify-center  text-white p-0">
      <div className="w-full max-w-5xl mx-auto text-center space-y-4">
        <div className="space-y-4">
          <div className="text-2xl font-bold tracking-tight sm:text-3xl">
            Choose your plan
          </div>
          <p className="text-lg text-muted-foreground max-w-xl md:max-w-2xl mx-auto px-2">
            Select the perfect plan for your needs. Enjoy our generous free tier or unlock
            premium features with our paid plan.
          </p>
        </div>

        {/* <div className="flex justify-center cursor-pointer">
          <Tabs defaultValue="monthly">
            <TabsList
              className=" p-1 bg-muted/90
              text-sm gap-4 cursor-pointer
              border border-muted rounded-full
              dark:text-white
              dark:bg-muted-foreground/80"
            >
              <TabsTrigger
                value="monthly"
                className="cursor-pointer rounded-full px-4 py-1
                border-0
                data-[state=active]:bg-black
                dark:data-[state=active]:text-primary
                data-[state=active]:text-primary-foreground
                data-[state=inactive]:text-muted-foreground"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="cursor-pointer
                border-0
                rounded-full px-4 py-1
                data-[state=active]:bg-black
                dark:data-[state=active]:text-primary
                data-[state=active]:text-primary-foreground
                data-[state=inactive]:text-muted-foreground"
              >
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div> */}

        <div className="pt-8  max-w-md flex md:justify-around flex-col md:flex-row gap-6 md:max-w-6xl mx-auto">
          {/* <div className="flex justify-center items-center gap-6 pt-8 "> */}
          {/* Free Plan */}
          <div className="md:pt-6">
            <Card className="flex   text-left bg-black border-1 border-bg-muted text-white scale-95 transform px-4">
              <CardHeader className="pb-0 pt-0 px-6">
                <h2 className="text-3xl font-bold text-white/95">Free</h2>
                <p className="text-white/60">
                  Get started with essential features at no cost.
                </p>
              </CardHeader>
              <CardContent className="ml-1  px-6 ">
                <div className="text-3xl font-bold text-white/95 pb-2">$0</div>
                <ul className="space-y-3 pt-2 text-white/90">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>AI Chat, up to 5 requests per day</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 " />
                    <span>Spreadsheet formula generation assistant AI</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 " />
                    <span> .xlsx file parsing and encoding for AI</span>
                  </li>
                  {/* <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 " />
                    <span>VBA Script Assistant AI</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 " />
                    <span>SQL Query Assistant AI</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 " />
                    <span>Regex Assistant AI</span>
                  </li> */}

                  <li className="flex items-start">
                    <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-400/80 " />
                    <span>Customer support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="px-4 pt-2 pb-1">
                <Link className="w-full " to="/login">
                  <Button
                    variant="outline"
                    className="w-full text-md  text-black dark:text-white px-2 py-5 hover:bg-muted cursor-pointer"
                  >
                    Get started!
                    <span className="ml-1 text-lg">→</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Pro Plan */}
          <Card className="flex justify-around md:mr-2 text-left bg-black border-1 border-muted-foreground/33 text-white relative overflow-hidden px-4">
            <CardHeader className="pb-0 pt-0 px-6">
              <h2 className="text-3xl font-bold">Pro</h2>
              <p className="text-white/60">Unlock the full potential of ExcelAIPro</p>
            </CardHeader>
            <CardContent className="">
              <div className="text-3xl font-bold flex">
                <div className="line-through text-muted-foreground">$10</div>
                <div className="ml-2 pb-4">$5.99/month</div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <div>
                    <span>Multi-step AI Chat, up to 500 requests per day</span>
                    <span className="ml-2.5 text-xs font-bold bg-yellow-600/85 px-2 py-1 rounded-full">
                      supercharged
                    </span>
                  </div>
                </li>
                <li className="flex items-start ">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Excel Formula Assistant AI</span>
                </li>
                <li className="flex items-start ">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Excel formula validation on sample rows</span>
                </li>

                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 " />
                  <div>
                    <span>
                      .xlsx file parsing and encoding for Excel AI
                      {/* <span className=" text-lg">📊</span> */}
                    </span>
                    <span className="ml-2.5 text-xs  font-bold bg-green-700/80 px-2 py-1 rounded-full">
                      advanced
                    </span>
                  </div>
                </li>

                {/* <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>
                    Advanced AI generation: spreadsheets scripts, VBA, Power Query for
                    Automation AI
                  </span>
                </li> */}
                {/* <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Advanced SQL Query AI assistant</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Regex expression generation assistant AI</span>
                </li> */}

                <li className="flex items-start ">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>Priority access to customer support </span>
                  <div className="ml-2.5 text-xs tracking-wide font-bold bg-rose-400/68 px-2 py-1 rounded-full">
                    ASAP
                  </div>
                </li>
                <li className="flex items-center ">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-white" />
                  <span>
                    Query Assistant <span className="ml-1 text-lg">✨</span>
                    <span className="ml-2.5 text-xs  font-bold bg-blue-500/80 px-2 py-1 rounded-full">
                      coming soon
                    </span>
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pb-1 pt-2">
              <Button className="w-full cursor-pointer bg-white text-black hover:bg-gray-200">
                Coming soon..
                {/* <span className="ml-1 text-lg">→</span>{" "} */}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
