import React, { useEffect, useRef } from "react";
import { Chart, ArcElement, CategoryScale, LinearScale } from 'chart.js/auto';


const PollutantsHalfDoughnutChart = ({value}) => {
    const chartRef = useRef(null);
  
    useEffect(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        const myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['AQI', 'Excess'],
            datasets: [
              {
                data: [value, 301 - value],
                backgroundColor: ['#FF6384', '#E5E5E5'],
                cutout: '50%', // Imposta il ritaglio per renderlo un half doughnut
              },
            ],
          },
          
          options: {
            elements: {
              center: {
                text: '90%',
                color: '#FF6384', // Default is #000000
                fontStyle: 'Arial', // Default is Arial
                sidePadding: 20 // Defualt is 20 (as a percentage)
              }
            },
            rotation: -90,
            circumference: 180,
            title: {
              display: true,
              text: 'Custom Chart Title',
              position: 'bottom'
            },
            plugins: {
              legend: {
                display: false, // Nasconde la legenda
              },
            },
          },
          scales: {
            y: {
              display: false, // Nasconde l'asse y
            },
          },
          elements: {
            arc: {
              borderWidth: 0, // Imposta il bordo a 0 per rimuovere il bordo bianco
            },
            center: {
              text: '90%',
              color: '#FF6384', // Default is #000000
              fontStyle: 'Arial', // Default is Arial
              sidePadding: 20 // Defualt is 20 (as a percentage)
            }
          },
        });
          // Clean up the chart instance on unmount
    return () => {
      myChart.destroy();
    };
      }

    
    }, []);
  
    return <canvas ref={chartRef} />;
  };

export default PollutantsHalfDoughnutChart;
