function plotRisk(data) {
    const traces = [
      {
        x: data.days,
        y: data.generalMortality,
        name: 'General Population Mortality Risk',
        mode: 'lines',
        line: { color: '#1f77b4', width: 2 }
      },
      {
        x: data.days,
        y: data.lowerBound,
        name: 'Lower Bound of Mortality Risk',
        mode: 'lines',
        line: { dash: 'dot', color: '#1f77b4' }
      },
      {
        x: data.days,
        y: data.upperBound,
        name: 'Upper Bound of Mortality Risk',
        mode: 'lines',
        line: { dash: 'dot', color: '#1f77b4' }
      },
      {
        x: data.days,
        y: data.donorMortality,
        name: 'Donor Mortality Risk',
        mode: 'lines',
        line: { color: '#d62728', width: 2 }
      },
      {
        x: data.days,
        y: data.lowerBoundDonor,
        name: 'Lower Bound of Donor Risk',
        mode: 'lines',
        line: { dash: 'dot', color: '#d62728' }
      },
      {
        x: data.days,
        y: data.upperBoundDonor,
        name: 'Upper Bound of Donor Risk',
        mode: 'lines',
        line: { dash: 'dot', color: '#d62728' }
      }
    ];
  
    const isMobile = window.innerWidth < 768;
  
    const layout = {
      title: 'Mortality Risk Over Time',
      xaxis: { title: 'Time (days)' },
      yaxis: { title: 'Mortality Risk (per 10,000)' },
      margin: {
        l: 50,
        r: 20,
        t: 60,
        b: isMobile ? 130 : 80
      },
      legend: {
        orientation: isMobile ? 'h' : 'v',
        x: 0,
        y: isMobile ? -0.4 : 1,
        font: {
          size: isMobile ? 9 : 12
        }
      }
    };
  
    const config = {
      responsive: true,
      displayModeBar: false
    };
  
    Plotly.newPlot('mortality-risk-graph', traces, layout, config);
  }
  