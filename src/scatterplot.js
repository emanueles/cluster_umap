import { UMAP } from 'umap-js';
import * as d3 from 'd3';

async function drawScatterplot() {

  const rawdata = await d3.text('assets/data/data.csv'); 
  const lines = rawdata.split('\n');
  let data = []; 
  lines.forEach((line) => {
    const coords = line.split(',');
    if (coords.length === 4) {
      data.push(coords.map((d) => parseFloat(d)));
    }
  });

  console.log(data);
  const width = 600, height = 600;

  const umap = new UMAP({nComponents: 2,
      minDist: 0.1,
      nNeighbors: 15}).fit(data);

  const canvas = document.getElementById('scatterplot');
  const context = canvas.getContext("2d");

  console.log("Data Loaded");
  console.log(data);
  const points = data,
    positions = umap;

  const scaleX = d3
    .scaleLinear()
    .domain([-7, 7]) //.domain(d3.extent(positions.map(d => d[0])))
    .range([10, width - 10]),
  scaleY = d3
    .scaleLinear()
    .domain([-7, 7]) //.domain(d3.extent(positions.map(d => d[1])))
    .range([10, height - 10]);

  const path = d3.geoPath().context(context);

  points.forEach((point, i) => {
    context.beginPath();
    path({
      type: "Point",
      coordinates: [scaleX(positions[i][0]), scaleY(positions[i][1])]
    });
    context.fillStyle = `rgba(${[
      point[0] * 255,
      point[1] * 255,
      point[2] * 255,
      0.5 + 0.5 * point[3]
    ]})`;
    context.fill();
  });
}

window.addEventListener('load', drawScatterplot);