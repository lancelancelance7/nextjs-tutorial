import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  tablesFilter: ["nextjs-tutorial_*"],
} satisfies Config;
