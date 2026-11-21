import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  jwtClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000",
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
      },
    }),
    jwtClient(),
  ],
  fetchOptions: {
    credentials: "include",
  },
});
