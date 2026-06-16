import { defineNitroPlugin } from "nitropack/runtime";
import { getResponseStatus } from "h3";

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook("request", (event) => {
    event.context.requestStart = Date.now();
    console.log(`[http] --> ${event.method} ${event.path}`);
  });

  nitro.hooks.hook("afterResponse", (event) => {
    const duration = Date.now() - (event.context.requestStart as number || 0);
    console.log(`[http] <-- ${event.method} ${event.path} ${getResponseStatus(event)} ${duration}ms`);
  });
});
