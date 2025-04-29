let betaCoefficients = []; // Array to store beta coefficients
let s0 = []; // Base survival function (s0)
let timePoints = []; // Time points for the survival function

const covUrl = 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test4/assets/csv/cox_var.csv';

window.onload = function () {
    updateVariableInputs();
    loadModelData(); // Load model-specific data on page load
};

// Function to load model-specific data for beta coefficients
async function loadModelData() {
    const modelFilePath = 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test4/assets/csv/model1_overall.csv';

    try {
        console.log('Loading model data from:', modelFilePath);

        const data = await fetchCSV(modelFilePath);

        if (data.length === 0) {
            console.error(`Error: No data found in ${modelFilePath}`);
            return;
        }

        const [header, ...rows] = data;

        // Use the 4th column for beta coefficients
        betaCoefficients = rows.map(row => {
            const cols = row.split(',');
            return parseFloat(cols[3]); // Use the 4th column
        });

        console.log('Loaded Beta Coefficients:', betaCoefficients);

        // Load survival function data (s0) and time points from s0.csv
        await loadSurvivalData(); // Call function to load s0.csv

        // Load covariance matrix and calculate confidence intervals
        await loadCovarianceMatrixAndCalculateCI();
    } catch (error) {
        console.error(`Error loading model data from ${modelFilePath}:`, error);
    }
}

// Function to load survival data from s0.csv for s0 and timePoints
async function loadSurvivalData() {
    const survivalFilePath = 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test4/assets/csv/s0.csv';

    try {
        console.log('Loading survival data from:', survivalFilePath);

        const data = await fetchCSV(survivalFilePath);

        if (data.length === 0) {
            console.error(`Error: No data found in ${survivalFilePath}`);
            return;
        }

        const [header, ...rows] = data;

        // Use the 1st column for timePoints and 2nd column for s0
        timePoints = rows.map(row => parseFloat(row.split(',')[0])); // Use the 1st column
        s0 = rows.map(row => parseFloat(row.split(',')[1])); // Use the 2nd column

        console.log('Loaded survival data:', { timePoints, s0 });
    } catch (error) {
        console.error(`Error loading survival data from ${survivalFilePath}:`, error);
    }
}

// Example fetchCSV utility to load the CSV file
async function fetchCSV(filePath) {
    try {
        const response = await fetch(filePath);
        const text = await response.text();
        return text.trim().split('\n');
    } catch (error) {
        console.error(`Error fetching CSV from ${filePath}:`, error);
        return [];
    }
}

// Function to parse CSV files
function parseCsv(url) {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: result => resolve(result.data),
            error: err => reject(err)
        });
    });
}

// Function to reconstruct the covariance matrix from parsed CSV data
function reconstructCovMatrix(data) {
    const covMatrix = [];
    const headers = Object.keys(data[0]).slice(1); // Get the headers excluding the first empty column

    // Create a mapping of current order to desired order
    const orderMap = {};
    headers.forEach((header, index) => {
        orderMap[header] = index;
    });

    // Reorganize the rows
    headers.forEach(rowName => {
        const rowIndex = orderMap[rowName];
        const row = data[rowIndex];
        const newRow = [];

        // Reorganize the columns
        headers.forEach(colName => {
            newRow.push(row[colName]);
        });

        covMatrix.push(newRow);
    });

    return covMatrix;
}

// Function to calculate the mean of the linear combination
function calculateMean(beta, c) {
    return c.reduce((sum, ci, i) => sum + ci * beta[i], 0);
}

// Function to calculate the variance of the linear combination
function calculateVariance(c, cov) {
    let variance = 0;
    for (let i = 0; i < c.length; i++) {
        for (let j = 0; j < c.length; j++) {
            variance += c[i] * c[j] * cov[i][j];
        }
    }
    return variance;
}

// Function to calculate the confidence intervals
function calculateConfidenceIntervals(beta, c, cov, confidenceLevel = 0.95) {
    const zScore = 1.96; // Approx for 95% confidence level
    const mean = calculateMean(beta, c);
    const variance = calculateVariance(c, cov);
    const standardError = Math.sqrt(variance);

    const lower = mean - zScore * standardError;
    const upper = mean + zScore * standardError;

    return { mean, lower, upper };
}

// Function to load covariance matrix and calculate confidence intervals
async function loadCovarianceMatrixAndCalculateCI() {
    try {
        // Parse the CSV file
        const data = await parseCsv(covUrl);

        // Reconstruct the covariance matrix
        const covMatrix = reconstructCovMatrix(data);

        // Log the beta matrix and c matrix
        console.log('Beta Matrix:', betaCoefficients);
        console.log('C Matrix (Scenario Vector):', scenarioVector);

        // Calculate the confidence intervals
        const confidenceIntervals = calculateConfidenceIntervals(betaCoefficients, scenarioVector, covMatrix);

        // Log the variance (covariance) matrix
        console.log('Variance (Covariance) Matrix:', covMatrix);

        // Display the results
        console.log(`Mean of the linear combination: ${confidenceIntervals.mean}`);
        console.log(`95% Confidence Interval: [${confidenceIntervals.lower}, ${confidenceIntervals.upper}]`);

        return confidenceIntervals;
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// Function to calculate risk (example implementation)
async function calculateRisk() {
    // Example risk calculation logic
    console.log('Calculating risk...');
    // Use betaCoefficients, s0, and timePoints to calculate risk
    // Adjust f0 by the logHR to calculate the risk
    const logHR = scenarioVector.reduce((acc, value, index) => acc + value * betaCoefficients[index], 0);
    const ci = await loadCovarianceMatrixAndCalculateCI(); // Load covariance matrix and calculate confidence intervals
    console.log('Confidence Intervals:', ci);
    const logHR_lb = ci.lower;
    const logHR_ub = ci.upper;
    console.log('logHR:', logHR);
    console.log('logHR_lb:', logHR_lb);
    console.log('logHR_ub:', logHR_ub);
    const f0 = s0.map(s => (1 - s)); // Convert survival probability to mortality risk
    const f1help = f0.map((f, index) => Math.min(f * Math.exp(logHR), 1)); // Apply logHR to adjust risk
    const f1help_lb = f0.map((f, index) => Math.max(Math.min(f * Math.exp(logHR_lb), 1), 0)); // Apply logHR to adjust risk
    const f1help_ub = f0.map((f, index) => Math.max(Math.min(f * Math.exp(logHR_ub), 1), 0)); // Apply logHR to adjust risk
    console.log('f1help:', f1help);
    console.log('f1help_lb:', f1help_lb);
    console.log('f1help_ub:', f1help_ub);
    const f1 = f1help.map((f, index) => f * 100); // Apply logHR to adjust risk
    const f1_lb = f1help_lb.map((f, index) => f * 100); // Apply logHR to adjust risk
    const f1_ub = f1help_ub.map((f, index) => f * 100); // Apply logHR to adjust risk
    console.log('f1:', f1);
    console.log('f1_lb:', f1_lb);
    console.log('f1_ub:', f1_ub);

    const sortedData = timePoints.map((time, index) => ({ time, risk: f1[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedData_lb = timePoints.map((time, index) => ({ time, risk: f1_lb[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedData_ub = timePoints.map((time, index) => ({ time, risk: f1_ub[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedTimePoints = sortedData.map(item => item.time);
    const sortedF1 = sortedData.map(item => item.risk);
    const sortedF1_lb = sortedData_lb.map(item => item.risk);
    const sortedF1_ub = sortedData_ub.map(item => item.risk);

    // Use Plotly.js to create the plot
    const data = [
        {
            x: sortedTimePoints,
            y: sortedF1,
            mode: 'lines',
            line: { color: 'navy' },
            name: 'Hospitalization Risk' 
        },
        {
            x: sortedTimePoints,
            y: sortedF1_lb,
            mode: 'lines',
            line: { color: 'navy', dash: 'dash' },
            name: 'Lower Bound of Hospitalization Risk'
        },
        {
            x: sortedTimePoints,
            y: sortedF1_ub,
            mode: 'lines',
            line: { color: 'navy', dash: 'dash' },
            name: 'Upper Bound of Hospitalization Risk'
        }
    ];

    const layout = {
        title: 'Hospitalization Risk Over Time',
        xaxis: {
            title: 'Time (years)',
            showgrid: true,
            dtick: 1 // Set tick interval to every 10 units
        },
        yaxis: {
            title: 'Hospitalization Risk (%)',
            range: [0, ],
            showgrid: true
        }
    };

    // Plotly rendering with error handling
    Plotly.newPlot('hospitalization-risk-graph', data, layout).catch(error => {
        console.error('Plotly Error:', error);
    });
}# flick 20250409213612-aB4U
# flick 20250409214217-znaY
# flick 20250409214634-7lDB
# flick 20250409230607-F02f
# flick 20250410003323-MFg5
# flick 20250410004430-fbSz
# flick 20250410004925-0L8m
# flick 20250410005408-cjdj
# flick 20250410005847-VwTN
# flick 20250410010502-c54t
# flick 20250410013759-gH4c
# flick 20250410031738-jrt2
# flick 20250410032336-JHsA
# flick 20250410130449-4WYI
# flick 20250410134054-4XnK
# flick 20250410141344-F0tM
# flick 20250410151213-JnFd
# flick 20250410153406-ADQ4
# flick 20250410154334-oDJS
# flick 20250410154740-fFI2
# flick 20250410213332-Z6Dx
# flick 20250413124139-kpmo
# flick 20250413132132-qWO7
# flick 20250413171242-SLGA
# flick 20250413213135-UUWj
# flick 20250413214013-EnlW
# flick 20250413233324-8r67
# flick 20250414003736-lgeW
# flick 20250415200148-XpB3
# flick 20250415211837-wPNS
# flick 20250415212358-fq7Q
# flick 20250416034832-Yaru
# flick 20250416150453-IfTc
# flick 20250416163656-f5Eo
# flick 20250416214709-6LZN
# flick 20250416222355-1aLf
# flick 20250416222629-1z9o
# flick 20250416222900-MmXD
# flick 20250417000351-8y5q
# flick 20250417001815-a01k
# flick 20250417034406-Wxzm
# flick 20250417183513-MJLB
# flick 20250417190345-0rVv
# flick 20250417212534-22vn
# flick 20250417215304-ugdG
# flick 20250422034841-f6If
# flick 20250422214553-y68C
# flick 20250422215934-hmZC
# flick 20250423005253-QARF
# flick 20250423161902-SVZg
# flick 20250423171401-Y2VV
# flick 20250423172040-4iNF
# flick 20250423180022-mNpO
# flick 20250423195957-sgnn
# flick 20250423200224-oQRM
