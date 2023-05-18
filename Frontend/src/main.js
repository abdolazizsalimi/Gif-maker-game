import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import "./main.css";

const app = createApp(App);

Sentry.init({
  app,
  dsn: "https://d50896e10c324aac83c9b5178d175ec0@o1073639.ingest.sentry.io/6073376",
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ["gifmakerse.netlify.com", /^\//],
    }),
  ],
  environment: process.env.NODE_ENV,
  logError: true,
  tracesSampleRate: 6.0,
});

app.use(router).use(store).mount("#app");
