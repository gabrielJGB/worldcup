import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { key } = req.query; // ejemplo: /api/players → key = "players"

  console.log(key);
  
  try {
    // 📄 Ruta al archivo JSON correspondiente
    const filePath = path.join(process.cwd(), 'data', `${key}.json`);

    // 📚 Leer y parsear el archivo
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // 🧩 Obtener las claves del primer objeto (para generar los filtros)
    const sample = jsonData[0] || {};
    const availableKeys = Object.keys(sample);

    // 🧠 Crear objeto con los filtros válidos del query
    const filters = Object.fromEntries(
      Object.entries(req.query).filter(
        ([k, v]) =>
          k !== 'key' && availableKeys.includes(k) && v !== undefined && v !== ''
      )
    );

    // 💬 Si no se pasaron filtros → mostrar ayuda
    if (Object.keys(filters).length === 0) {
      return res.status(200).json({
        message: 'Usá parámetros de consulta para filtrar resultados.',
        example: `/api/${key}?${availableKeys[0]}=valor`,
        available_filters: availableKeys,
      });
    }

    // 🔍 Filtrado (coincidencia parcial e insensible a mayúsculas)
    const filteredData = jsonData.filter((item) =>
      Object.entries(filters).every(([k, v]) => {
        const itemVal = String(item[k] ?? '').toLowerCase();
        const filterVal = String(v).toLowerCase();
        return itemVal.includes(filterVal);
      })
    );

    res.status(200).json(filteredData);
  } catch (error) {
    res.status(404).json({ error: `No se encontró el recurso "${key}"` });
  }
}
