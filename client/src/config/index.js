const config =
  process.env.NODE_ENV === "development"
    ? { API_ENDPOINT: "http://10.0.0.198:9000" }
    : { API_ENDPOINT: "https://urwa-backend.vercel.app" };

export default config;
