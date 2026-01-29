import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("generation router", () => {
  it("should have generation router methods", () => {
    const caller = appRouter.createCaller(createAuthContext());
    expect(caller.generation).toBeDefined();
    expect(caller.generation.generate).toBeDefined();
    expect(caller.generation.getHistory).toBeDefined();
  });

  it("should have user router methods", () => {
    const caller = appRouter.createCaller(createAuthContext());
    expect(caller.user).toBeDefined();
    expect(caller.user.getProfile).toBeDefined();
  });
});
