#!/bin/bash

keys=(
  "award_winners"
  "awards"
  "bookings"
  "confederations"
  "goals"
  "group_standings"
  "groups"
  "host_countries"
  "manager_appearances"
  "manager_appointments"
  "managers"
  "matches"
  "penalty_kicks"
  "player_appearances"
  "players"
  "qualified_teams"
  "referee_appearances"
  "referee_appointments"
  "referees"
  "squads"
  "stadiums"
  "substitutions"
  "team_appearances"
  "teams"
  "tournament_stages"
  "tournament_standings"
  "tournaments"
)

BASE_PATH="api"

echo "Iniciando la creación de archivos index.js en $BASE_PATH/..."

for key in "${keys[@]}"; do

  DIR_PATH="$BASE_PATH/$key"
  FILE_PATH="$DIR_PATH/index.js"
  

  mkdir -p "$DIR_PATH"
  

  cat << EOF > "$FILE_PATH"
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', '$key.json');
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
EOF
chmod 664 "$FILE_PATH"
  echo "  ✅ Creado: $FILE_PATH"
  
done

echo "Archivos creados"