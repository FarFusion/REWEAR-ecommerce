import { cleanEnv, str, port } from "envalid";

export default cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str(),
  JWT_SECRET: str(),
  CLIENT_URL: str(),
});