import data from '../data/data.json' assert { type: 'json' };

export default function handler(req, res) {
  const { id } = req.query;
  const item = data.find(d => d.id === Number(id));

  if (!item) return res.status(404).json({ error: 'Not found' });

  res.status(200).json(item);
}
