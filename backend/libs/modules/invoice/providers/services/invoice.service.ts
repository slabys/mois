import {
  Inject,
  Injectable,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

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

    this.generate();
  }

  onApplicationShutdown(signal?: string) {
    this.clientProxy.close();
  }

  async generate() {
    // console.log("sent");
    // const r = this.clientProxy.send("invoice.generate", { test: "yo"});
    // const data = await firstValueFrom(r);
    // console.log("DATA");
  }
}
