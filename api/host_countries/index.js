import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'host_countries.json');
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const { all } = req.query

  if(all !== undefined && all !== '' && all === "true")
    return   res.status(200).json(jsonData)

  const sample = jsonData[0] || {};
  const availableKeys = Object.keys(sample);


  const filters = Object.fromEntries(
    Object.entries(req.query).filter(
      ([key, value]) =>
        availableKeys.includes(key) && value !== undefined && value !== ''
    )
  );



  if (Object.keys(filters).length === 0) {
    return res.status(200).json({
      message: "Usá parámetros de consulta para filtrar los resultados. Para devolver todos los datos, agrega el filtro ?all=true",
      example: "/api/awards?team_name=Argentina&tournament_id=2022",
      available_filters: jsonData[0],
    });
  }


  const filteredData = jsonData.filter(item =>
    Object.entries(filters).every(([key, value]) => {
      return (String(item[key]).toLowerCase() === String(value).toLowerCase()) || (String(item[key]).toLowerCase().includes(String(value).toLowerCase()));
    })
  );




  res.status(200).json(filteredData);
}
