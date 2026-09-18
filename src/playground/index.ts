import { createClient } from "../client"
import dotenv from "dotenv"

dotenv.config()
async function main() {
  const client = createClient({ key: process.env.QWEATHER_API_KEY! })
  const res = await client.weather.now({
    location: "101010100",
  })
  console.log(res)
}

main()
