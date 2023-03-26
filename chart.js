import Chart from "chart.js/auto";
import { createCanvas } from "canvas";
import fs from "fs";

const getChart = (filenames) => {
  const data = [];
  for(const filename of filenames){
    fs.readFile(filename.toString(), "utf8", (err, fileData) => {
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
        //console.log(date);
        data.push({ x: date, y: stan_wody });
      });
      //console.log(data);
  
      const canvas = createChart(data);
  
      saveChart(canvas, filename);
      
    });
  }
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
          pointRadius: 1, //Brak zaznaczeń punktów
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
      backgroundColor: "rgba(255, 255, 255, 1)"
    },
  };

  const canvas = createCanvas(600, 400); // Tworzenie canvasa o wymiarach 600x400 pikseli
  const ctx = canvas.getContext("2d");
  const chart = new Chart(ctx, chartConfig);
  return canvas;
};

const saveChart = (canvas, filename) => {
    const chartName = filename.replace(".csv",".png").replace("./outputFiles", "./charts");
    //console.log(chartName)
    const out = fs.createWriteStream(chartName);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", () => console.log(`The ${chartName} file was created.`));
}

export default getChart;
