import { db } from "@excelaipro/db";
import { betterAuth as bAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  user,
  session,
  verification,
  account,
} from "@excelaipro/db/drizzle/schema";
import { config } from "./config";
import { stripe } from "@better-auth/stripe";
// import Stripe from "stripe";
// const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

const Domains: Record<string, string> = {
  development: "localhost",
  // production: "excelaipro-api-1337.fly.dev",
};

export const auth = bAuth({
  appName: "excelaipro-auth",
  schema: {
    user,
    session,
    verification,
    account,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  basePath: "/api/auth",
  trustedOrigins: [`${process.env.FRONTEND_URL}`],
  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 60 * 60,
  //   },
  // },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //   },
  // },
  // plugins: [
  //   stripe({
  //     stripeClient,
  //     stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  //     createCustomerOnSignUp: true,
  //     onCustomerCreate: async ({ customer, stripeCustomer, user }, request) => {
  //       console.log(`Customer ${customer.id} created for user ${user.id}`);
  //     },
  //   }),
  // ],
  // advanced: {
  //   defaultCookieAttributes: {
  //     sameSite: config.env === "production" ? "None" : "Lax",
  //     secure: config.env === "production",
  //     httpOnly: config.env === "production",
  //     domain: Domains[config.env],
  //   },
  //   useSecureCookies: config.env === "production",
  //   crossSubDomainCookies: {
  //     enabled: config.env === "production",
  //     domain: Domains[config.env],
  //   },
  // },

  logger: {
    disabled: false,
    level: "debug",
    log(level, message, ...args) {
      const timestamp = new Date().toISOString();
      const prefix = `[BetterAuth] ${timestamp} ${level.toUpperCase()}:`;
      if (level === "error") {
        console.error(prefix, message, ...args);
      } else {
        console.log(prefix, message, ...args);
      }
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
