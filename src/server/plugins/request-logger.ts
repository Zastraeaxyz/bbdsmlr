import { defineNitroPlugin } from "nitropack/runtime";
import { getResponseStatus } from "h3";

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook("request", (event) => {
    event.context.requestStart = Date.now();
    if (!event.path.startsWith("/v2/api/")) return;
    console.log(`[http] --> ${event.method} ${event.path}`);
  });

  nitro.hooks.hook("afterResponse", (event) => {
    if (!event.path.startsWith("/v2/api/")) return;
    const duration = Date.now() - ((event.context.requestStart as number) || 0);
    console.log(
      `[http] <-- ${event.method} ${event.path} ${getResponseStatus(event)} ${duration}ms`,
    );
  });
});
