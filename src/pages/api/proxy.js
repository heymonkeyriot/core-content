import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL query parameter is required.');
  }

  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching URL:', error.message);
    res.status(500).send('Error fetching URL');
  }
}