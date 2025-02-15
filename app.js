const express = require('express');
const axios = require('axios');
const ExcelJS = require('exceljs');

const app = express();
const PORT = 3000;
const GOOGLE_API_KEY = '';

app.get('/export-solar-farms', async (req, res) => {
  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=solar+farm+West+Africa&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(searchUrl);
    const places = response.data.results;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Solar Farms - West Africa');
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Address', key: 'address', width: 50 },
      { header: 'Rating', key: 'rating', width: 10 },
      { header: 'Place ID', key: 'place_id', width: 30 }
    ];
  
    places.forEach(place => {
      worksheet.addRow({
        name: place.name,
        address: place.formatted_address,
        rating: place.rating || 'N/A',
        place_id: place.place_id
      });
    });
    
    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Disposition', 'attachment; filename="solar_farms_west_africa.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
    
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Error fetching data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
