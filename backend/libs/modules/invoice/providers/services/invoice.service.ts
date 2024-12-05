import {
  Inject,
  Injectable,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class InvoiceService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @Inject("DOCUMENTS")
    private readonly clientProxy: ClientProxy
  ) {}

  async onApplicationBootstrap() {
    await this.clientProxy.connect();
  }

  onApplicationShutdown(signal?: string) {
    this.clientProxy.close();
  }

  async generate() {}
}
