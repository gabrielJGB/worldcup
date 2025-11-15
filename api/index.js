import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

export default function handler(req, res) {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, "routes.json");

  const routes = JSON.parse(fs.readFileSync(filePath, "utf8"));

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");


    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    res.status(200).json({
        message: "Welcome to my FIFA World Cup API",
        routes: routes.map(route => route)
    });
}
