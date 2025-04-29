function plotRisk(timePoints, mortalityRisk) {
    const data = [{
        x: timePoints,
        y: mortalityRisk,
        mode: 'lines',
        line: { color: 'green' },
        name: 'Mortality Risk'
    }];

    const layout = {
        title: 'Mortality Risk Over Time',
        xaxis: {
            title: 'Time (years)',
            showgrid: true
        },
        yaxis: {
            title: 'Mortality Risk (%)',
            range: [0, 100],
            showgrid: true
        }
    };

    Plotly.newPlot('mortality-risk-graph', data, layout);
}
# flick 20250409213614-i9Te
# flick 20250409214219-tq0E
# flick 20250409214636-vZLR
# flick 20250409231148-OJJ3
# flick 20250410003641-tNrW
# flick 20250410004048-lp3U
# flick 20250410010503-VIxk
# flick 20250410013247-LRUY
# flick 20250410013758-VMZc
# flick 20250410031042-WBRT
# flick 20250410031739-zHqm
# flick 20250410032005-ZB0X
# flick 20250410032116-1GE4
# flick 20250410032813-KiKf
# flick 20250410130447-iibF
# flick 20250410131704-CH55
# flick 20250410133821-2jpl
# flick 20250410140620-taxe
# flick 20250410145603-3KGb
# flick 20250410152850-OFQh
# flick 20250410214247-s4P0
# flick 20250413011143-QQks
# flick 20250413124137-7Izh
# flick 20250413132128-SRTL
# flick 20250413171241-P6XW
# flick 20250414012930-AfIk
# flick 20250414042549-tlAP
# flick 20250414181111-8zFD
# flick 20250415191555-V9M3
# flick 20250415193037-2ZSE
# flick 20250415203938-nhY6
# flick 20250415233203-p4bi
# flick 20250416025014-rPXW
# flick 20250416031040-ZXxi
# flick 20250416034836-WKbQ
# flick 20250416041428-UCg3
# flick 20250416150452-nQfW
# flick 20250416163058-ZVMB
# flick 20250416163655-G1e5
# flick 20250416212949-dl9E
# flick 20250416213542-teVv
# flick 20250416221050-hHnZ
# flick 20250416222354-77nF
# flick 20250416232108-5Zns
# flick 20250416234858-jo4Z
# flick 20250417030419-RoCc
# flick 20250417034408-nh5u
# flick 20250417034855-PcqJ
# flick 20250417140109-tCAi
# flick 20250417183915-icho
# flick 20250417184545-hUBe
# flick 20250417185035-5v9l
# flick 20250417193145-kXyN
# flick 20250418032004-hOk8
# flick 20250422002919-EMI3
# flick 20250422004340-4OEi
# flick 20250422034842-ePZr
# flick 20250422042014-aYP8
# flick 20250422215934-y85O
# flick 20250423001646-yS8l
# flick 20250423005723-nVfb
# flick 20250423171402-2ks9
