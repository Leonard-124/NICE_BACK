
import * as Sentry from "@sentry/node"
//const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://e6a472e93514468f692be27d3225124c@o4511637943549952.ingest.de.sentry.io/4511637957640272",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
});