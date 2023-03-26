import Chart from 'chart.js/auto';
import { createCanvas } from 'canvas';
import fs from 'fs';

const getCharts = async (filenames) => {
  const waterConditionTitle = 'Wykres stanu wody od daty';
  const waterFlowTitle = 'Wykres przepływu wody od daty';
  for (const filename of filenames) {
    const waterConditionData = [];
    const waterFlowData = [];
    try {
      const fileData = fs.readFileSync(filename.toString(), 'utf8');
      const rows = fileData.trim().split('\n');
      rows.forEach((row) => {
        const [
          id,
          city,
          riverName,
          year,
          month,
          day,
          waterCondition,
          waterFlow,
        ] = row.split(',');

        const date = `${year}-${month}-${day}`.replace(/"/g, '').split('T')[0];
        waterConditionData.push({ x: date, y: waterCondition });
        waterFlowData.push({ x: date, y: waterFlow });
      });

      const waterConditionCanvas = createChart(
        waterConditionData,
        waterConditionTitle
      );
      console.log(waterConditionData);
      const waterFlowCanvas = createChart(waterFlowData, waterFlowTitle);
      console.log(waterFlowData);
      saveChart(waterConditionCanvas, filename, waterConditionTitle);
      saveChart(waterFlowCanvas, filename, waterFlowTitle);
    } catch (err) {
      console.error(err);
    }
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
          borderColor: 'rgba(54, 162, 235)', // Kolor linii wykresu
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
          title: {
            display: true,
            text: 'Powierzchnia m³',
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

export default getCharts;
