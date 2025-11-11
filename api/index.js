import data from '../data/data.json' assert { type: 'json' };

export default function handler(req, res) {
  const { country } = req.query;

  if (country) {
    const filtered = data.filter(item => item.country.toLowerCase() === country.toLowerCase());
    return res.status(200).json(filtered);
  }

  res.status(200).json(data);
}
