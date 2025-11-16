import fs from 'fs';
import path from 'path';

export default function handler(req, res) {

  const { all, key } = req.query; // ejemplo: /api/players  key = "players"

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {

    const filePath = path.join(process.cwd(), 'data', `${key}.json`);
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (all !== undefined && all !== '' && all === "true")
      return res.status(200).json(jsonData)


    const sample = jsonData[1] || {};
    const availableKeys = Object.keys(sample);


    const filters = Object.fromEntries(
      Object.entries(req.query).filter(
        ([k, v]) =>
          k !== 'key' && availableKeys.includes(k) && v !== undefined && v !== ''
      )
    );


    if (Object.keys(filters).length === 0) {
      return res.status(200).json({
        message: 'Usá parámetros de consulta para filtrar resultados. Para devolver todos los datos, agrega el filtro ?all=true',
        example: `/api/${key}?${availableKeys[0]}=valor`,
        available_filters: availableKeys,
      });
    }


    const filteredData = jsonData.filter((item) =>
      Object.entries(filters).every(([k, v]) => {
        const itemVal = String(item[k] ?? '').toLowerCase();
        const filterVal = String(v).toLowerCase();

        if (k.includes("id") || k.includes("number"))
          return itemVal === filterVal;

        return itemVal.includes(filterVal);
      })
    );

    res.status(200).json(filteredData);
  } catch (error) {
    res.status(404).json({ error: `No se encontró el recurso "${key}"` });
  }
}
