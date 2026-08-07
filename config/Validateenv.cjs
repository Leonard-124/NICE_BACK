const REQUIRED_VARS = [
  "SESSION_SECRET",
  "MONGO_URI",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "CLIENT_URL",
];

/**
 * Fails fast at boot if required env vars are missing, instead of
 * surfacing confusing errors later (e.g. mid-OAuth-handshake).
 */
function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
  }

  if (process.env.SESSION_SECRET.length < 32) {
    console.error("SESSION_SECRET should be at least 32 characters long.");
    process.exit(1);
  }
}

module.exports = validateEnv;