function plotRisk(timePoints, mortalityRisk, esrdRisk) {
    // Calculate the difference between the two lines
    const difference = mortalityRisk.map((value, index) => value - esrdRisk[index]);

    // Data for the first line (Mortality Risk)
    const trace1 = {
        x: timePoints,
        y: mortalityRisk,
        mode: 'lines',
        line: { color: 'green' },
        name: 'Mortality Risk',
        hovertemplate: 'Mortality Risk: %{y}<br>Risk Difference: %{customdata}<extra></extra>',
        customdata: difference // Add the difference as custom data for hover
    };

    // Data for the second line (ESRD Risk)
    const trace2 = {
        x: timePoints,
        y: esrdRisk,
        mode: 'lines',
        line: { color: 'blue' },
        name: 'ESRD Risk',
        hovertemplate: 'ESRD Risk: %{y}<br>Risk Difference: %{customdata}<extra></extra>',
        customdata: difference // Add the difference as custom data for hover
    };

    // Combine all traces
    const data = [trace1, trace2];

    // Layout for the plot
    const layout = {
        title: 'Risk Over Time',
        xaxis: {
            title: 'Time (years)',
            showgrid: true
        },
        yaxis: {
            title: 'Risk (%)',
            range: [0, 100],
            showgrid: true
        }
    };

    // Create the plot
    Plotly.newPlot('risk-graph', data, layout);
}# flick 20250409213613-BwkN
# flick 20250409214218-tfKN
# flick 20250409214635-3bKE
# flick 20250410002736-2re7
# flick 20250410003643-SUtw
# flick 20250410004047-5Lvx
# flick 20250410010500-OeS4
# flick 20250410014856-BTP1
# flick 20250410021547-tKvo
# flick 20250410031045-nV3F
# flick 20250410031741-AEpd
# flick 20250410032811-VKfW
# flick 20250410154744-y2p1
# flick 20250410162337-2dkP
# flick 20250410162732-rALz
# flick 20250410205353-dE2p
# flick 20250411000241-XbMC
# flick 20250413005457-hizi
# flick 20250413010204-pxNl
# flick 20250413011145-eUoD
# flick 20250413011338-TPv2
# flick 20250413132128-lMhv
# flick 20250413222701-lCe9
# flick 20250413233322-VxoI
# flick 20250414182651-uN8i
# flick 20250415191552-mqPE
# flick 20250415192651-5Myu
# flick 20250415200845-4ybs
# flick 20250415205656-vj2W
# flick 20250415220600-zJvh
# flick 20250415230812-YRC6
# flick 20250415233203-Z42d
# flick 20250416031038-bxIF
# flick 20250416034835-wqCU
# flick 20250416150451-SUZ2
# flick 20250416161510-ua9g
# flick 20250416191007-OFrb
# flick 20250416213544-FIXo
# flick 20250416223142-YSy1
# flick 20250416234856-Gk2l
# flick 20250417033849-rdds
# flick 20250417034854-xNMT
# flick 20250417140111-ifF7
# flick 20250417190344-A3C6
# flick 20250417212534-hC5N
# flick 20250418021903-f7d4
# flick 20250418025026-O27Y
# flick 20250418042248-nvPA
# flick 20250422002918-WWnN
# flick 20250422033025-jvky
# flick 20250422211721-j5y4
# flick 20250423005250-hKGg
# flick 20250423161902-WQAG
# flick 20250423172037-wWyZ
# flick 20250423173645-Rt7h
# flick 20250423194207-diS3
# flick 20250423200223-rrJi
# flick 20250428113617-4QFY
