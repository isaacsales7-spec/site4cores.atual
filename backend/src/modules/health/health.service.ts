import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  getStatus() {
    return { status: "ok", service: "4cores-api" } as const;
  }
}
