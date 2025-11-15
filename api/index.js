import fs from 'fs';

export default function handler(req, res) {

    const routes = JSON.parse(fs.readFileSync("./routes.json", "utf8"));

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
