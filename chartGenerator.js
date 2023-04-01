import Chart from 'chart.js/auto';
import { createCanvas } from 'canvas';
import fs from 'fs';

export const getCharts = async (filenames) => {
  const firstStationData = [];
  const secondStationData = [];
  const dataArrays = [];
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
        .replace('./outputFiles/', '')
        .replace('.csv', '')
        .split('_');

      const waterConditionTitle = `Wykres stanu wody od daty ${name} ${year}`;
      const waterFlowTitle = `Wykres przepływu wody od daty ${name} ${year}`;
      const waterCurveTitle = `Krzywa natężenia przepływu ${name} ${year}`;
      const waterConditionCanvas = createLineChart(
        waterConditionData,
        waterConditionTitle,
        'Data',
        'Stan wody [m]'
      );
      const waterFlowCanvas = createLineChart(
        waterFlowData,
        waterFlowTitle,
        'Data',
        'Przepływ [m³/s]'
      );
      const waterCurveCanvas = createScatterChart(
        curveData,
        waterCurveTitle,
        'Przepływ [m³/s]',
        'Stan wody [m]'
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
          pointRadius: 0, // Rozmiar punktów
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
          data: data, // użycie tablicy z danymi
          showLine: false,
          backgroundColor: 'rgba(255, 99, 132, 0.25)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          pointRadius: 1, // Rozmiar punktów
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

const createTwoStationChart = (data1, data2, title, textX, textY) => {
  const chartConfig = {
    type: 'line',
    data: {
      labels: ['Listopad', 'Grudzień', 'Styczeń', 'Luty', 'Marzec', 'Kwiecień'],
      datasets: [
        {
          label: 'Stan wody - Stacja 1',
          data: data1,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        },
        {
          label: 'Stan wody - Stacja 2',
          data: data2,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Stan wody (m)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Miesiące',
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
  const path = `./charts/${title.replace(/\s+/g, '-')}.png`;
  const out = fs.createWriteStream(path);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`The ${path} file was created.`));
};
