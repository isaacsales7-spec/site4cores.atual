import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

describe("HealthController", () => {
  it("retorna o status da API", async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();
    const controller = new HealthController(module.get(HealthService));
    expect(controller.getStatus()).toEqual({
      status: "ok",
      service: "4cores-api",
    });
  });
});
