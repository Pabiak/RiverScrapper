import Chart from 'chart.js/auto';
import { createCanvas } from 'canvas';
import fs from 'fs';

export const getCharts = async (filenames) => {
  for (const filename of filenames) {
    const waterConditionData = [];
    const waterFlowData = [];
    const curveData = [];
    try {
      const fileData = fs.readFileSync(filename.toString(), 'utf8');
      const rows = fileData.trim().split('\n');
      rows.forEach((row) => {
        const [
          id,
          station,
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
        curveData.push({
          x: parseFloat(waterFlow),
          y: parseFloat(waterCondition),
        });
      });

      const [year, name] = filename
        .replace('../selectedRiverFiles/', '')
        .replace('.csv', '')
        .split('_');

      const waterConditionTitle = `Water level chart from date ${name} ${year}`;
      const waterFlowTitle = `Water flow chart from date ${name} ${year}`;
      const waterCurveTitle = `Rating curve chart ${name} ${year}`;
      const waterConditionCanvas = createLineChart(
        waterConditionData,
        waterConditionTitle,
        'Date',
        'Water level [m]'
      );
      const waterFlowCanvas = createLineChart(
        waterFlowData,
        waterFlowTitle,
        'Date',
        'Water flow [m³/s]'
      );
      const waterCurveCanvas = createScatterChart(
        curveData,
        waterCurveTitle,
        'Water flow [m³/s]',
        'Water level [m]'
      );
      saveChart(waterConditionCanvas, waterConditionTitle);
      saveChart(waterFlowCanvas, waterFlowTitle);
      saveChart(waterCurveCanvas, waterCurveTitle);
    } catch (err) {
      console.error(err);
    }
  }
};

const createLineChart = (data, title, textX, textY) => {
  const chartConfig = {
    type: 'line',
    data: {
      labels: data.map((d) => d.x), // Oś x - wartości pierwszej kolumny
      datasets: [
        {
          label: title.toString(),
          data: data.map((d) => d.y), // Oś y - wartości drugiej kolumny
          backgroundColor: 'rgba(54, 162, 235, 0.25)',
          borderColor: 'rgba(54, 162, 235)',
          borderWidth: 2, // Grubość linii wykresu
          pointRadius: 0, // Rozmiar punktów
        },
      ],
    },
    options: {
      scales: {
        y: {
          ticks: {
            beginAtZero: true,
          },
          title: {
            display: true,
            text: textY.toString(),
          },
        },
        x: {
          title: {
            display: true,
            text: textX.toString(),
          },
        },
      },
    },
  };

  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  const chart = new Chart(ctx, chartConfig);
  return canvas;
};

const createScatterChart = (data, title, textX, textY) => {
  const chartConfig = {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: title.toString(),
          data: data,
          showLine: false,
          backgroundColor: 'rgba(255, 99, 132, 0.25)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          pointRadius: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          ticks: {
            beginAtZero: true,
          },
          title: {
            display: true,
            text: textY.toString(),
          },
        },
        x: {
          title: {
            display: true,
            text: textX.toString(),
          },
        },
      },
    },
  };
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  const chart = new Chart(ctx, chartConfig);
  return canvas;
};

const saveChart = (canvas, title) => {
  const path = `../charts/${title.replace(/\s+/g, '-')}.png`;
  const out = fs.createWriteStream(path);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`The ${path} file was created.`));
};
