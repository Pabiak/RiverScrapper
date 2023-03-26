import Chart from "chart.js/auto";
import { createCanvas } from "canvas";
import fs from "fs";

const getChart = () => {
  const data = [];
  fs.readFile("./outputFiles/2015_Borkowo.csv", "utf8", (err, fileData) => {
    if (err) {
      console.error(err);
      return;
    }
    const rows = fileData.trim().split("\n");
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
      ] = row.split(",");
      const dateString = `${rok}/${miesiac}/${dzien}`.replace(/"/g, "");
      const date = new Date(dateString).toISOString().split("T")[0];
      console.log(date);
      data.push({ x: date, y: stan_wody });
    });
    console.log(data);

    const canvas = createChart(data);

    saveChart(canvas);
    
  });
};

const createChart = (data) => {
  const chartConfig = {
    type: "line", // Typ wykresu liniowy
    data: {
      labels: data.map((d) => d.x), // Oś x - wartości pierwszej kolumny
      datasets: [
        {
          label: "Wykres stanu wody od daty",
          data: data.map((d) => d.y), // Oś y - wartości drugiej kolumny
          backgroundColor: "rgba(255,255,255)", // Kolor wypełnienia obszaru pod wykresem
          borderColor: "rgba(54, 162, 235, 1)", // Kolor linii wykresu
          borderWidth: 1, // Grubość linii wykresu
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
  const ctx = canvas.getContext("2d");
  const chart = new Chart(ctx, chartConfig);
  return canvas;
};

const saveChart = (canvas) => {
    const out = fs.createWriteStream("./outputFiles/chart.png");
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", () => console.log("The PNG file was created."));
}

export default getChart;
