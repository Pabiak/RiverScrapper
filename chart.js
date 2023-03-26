import Chart from 'chart.js/auto';
import { createCanvas } from 'canvas';
import fs from 'fs';

const getChart = (filenames, title) => {
  const data = [];
  for (const filename of filenames) {
    fs.readFile(filename.toString(), 'utf8', (err, fileData) => {
      if (err) {
        console.error(err);
        return;
      }
      const rows = fileData.trim().split('\n');
      rows.forEach((row) => {
        const [
          id,
          miejscowosc,
          nazwa_rzeki,
          rok,
          miesiac,
          dzien,
          stan_wody,
          przeplyw,
        ] = row.split(',');

        const date = `${rok}-${miesiac}-${dzien}`
          .replace(/"/g, '')
          .split('T')[0];
        data.push({ x: date, y: stan_wody });
      });
      const canvas = createChart(data, title);

      saveChart(canvas, filename, title);
    });
  }
};

const createChart = (data, title) => {
  const chartConfig = {
    type: 'line', // Typ wykresu liniowy
    data: {
      labels: data.map((d) => d.x), // Oś x - wartości pierwszej kolumny
      datasets: [
        {
          label: title.toString(),
          data: data.map((d) => d.y), // Oś y - wartości drugiej kolumny
          backgroundColor: 'rgba(54, 162, 235, 0.25)', // Kolor wypełnienia obszaru pod wykresem
          borderColor: 'rgba(54, 162, 235,1)', // Kolor linii wykresu
          borderWidth: 2, // Grubość linii wykresu
          pointRadius: 0, //Brak zaznaczeń punktów
        },
      ],
    },
    options: {
      scales: {
        y: {
          ticks: {
            beginAtZero: true, // Wyświetlanie osi y od zera
          },
        },
      },
    },
  };

  const canvas = createCanvas(600, 400); // Tworzenie canvasa o wymiarach 600x400 pikseli
  const ctx = canvas.getContext('2d');
  const chart = new Chart(ctx, chartConfig);
  return canvas;
};

const saveChart = (canvas, filename, title) => {
  const chartName = filename
    .replace('.csv', `-${title.replace(/\s+/g, '-')}.png`)
    .replace('./outputFiles', './charts');
  //console.log(chartName)
  const out = fs.createWriteStream(chartName);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`The ${chartName} file was created.`));
};

export default getChart;
