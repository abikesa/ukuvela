let scenarioVectors = {}; // Object to store scenario vectors for each variable
let scenarioVectorHelper = []; // Helper vector to aggregate all scenario vectors for categorical variables
let baseValues = {}; // Object to store base values for continuous variables
let scaleValues = {}; // Object to store scale values for continuous variables
let minValues = {}; // Object to store min values for continuous variables
let maxValues = {}; // Object to store max values for continuous variables
let scenarioVector = []; // Final scenario vector to be used in RiskCalculator.js

// Initialize the form with default values for the selected model
window.onload = function () {
    console.log('Window loaded, initializing variable inputs...');
    updateVariableInputs();
};

async function loadVariableData(filePath) {
    const data = await fetchCSV(filePath);

    if (data.length === 0) {
        console.error(`Error: No data found in ${filePath}`);
        return [];
    }

    const [header, ...rows] = data;
    const variables = rows.map(row => {
        const cols = row.split(',');
        return {
            variable: cols[0],
            value_label: cols[1],
            categorical: parseInt(cols[2], 10),
            values: cols[3],
            base: parseInt(cols[4], 10),
            scale: parseFloat(cols[6]), // Add scale column
            min: parseFloat(cols[7]), // Add min column
            max: parseFloat(cols[8]), // Add max column
            display_text: cols[5]
        };

    });

    return variables;
}

async function updateVariableInputs() {
    const variableInputsDiv = document.getElementById('variable-inputs');
    variableInputsDiv.innerHTML = ''; // Clear previous inputs

    const variables = await loadVariableData('https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test4/assets/csv/variable.csv');



    // Group variables by their names
    const groupedVariables = variables.reduce((acc, variable) => {
        if (!acc[variable.variable]) {
            acc[variable.variable] = [];
        }
        acc[variable.variable].push(variable);
        return acc;
    }, {});

    // Initialize scenario vectors based on the variable names
    Object.keys(groupedVariables).forEach(variableName => {
        const variableGroup = groupedVariables[variableName];
        const firstVariable = variableGroup[0];
        const variableNameWithModel = `${variableName}_model1`;

        if (firstVariable.categorical === 1) {
            scenarioVectors[variableNameWithModel] = new Array(variableGroup.length).fill(0);
            variableGroup.forEach((variable, idx) => {
                if (variable.base === 1) {
                    scenarioVectors[variableNameWithModel][idx] = 1; // Set default value based on "base" column
                }
            });
        } else {
            scenarioVectors[variableNameWithModel] = 0; // Initialize continuous variables with base value
            baseValues[variableNameWithModel] = firstVariable.base; // Store base value for continuous variables
            scaleValues[variableNameWithModel] = firstVariable.scale; // Store scale value for continuous variables
            minValues[variableNameWithModel] = firstVariable.min; // Store min value for continuous variables
            maxValues[variableNameWithModel] = firstVariable.max; // Store max value for continuous variables
        }
    });
    
    // Display non-categorical variables first
    Object.keys(groupedVariables).forEach(variableName => {
        const variableGroup = groupedVariables[variableName];
        const firstVariable = variableGroup[0];
        const variableNameWithModel = `${variableName}_model1`;

        if (firstVariable.categorical !== 1) {
            // Create slider and input for continuous variables
            const continuousGroup = document.createElement('div');
            continuousGroup.innerHTML = `
                <label for="${variableNameWithModel}">${firstVariable.display_text}:</label>
                <input type="number" id="${variableNameWithModel}" name="${variableNameWithModel}" value="${firstVariable.base}">
                <input type="range" id="${variableNameWithModel}Range" min="${firstVariable.min}" max="${firstVariable.max}" value="${firstVariable.base}" oninput="document.getElementById('${variableNameWithModel}').value = this.value">
            `;

            const numberInput = continuousGroup.querySelector(`input[type="number"]`);
            const rangeInput = continuousGroup.querySelector(`input[type="range"]`);

            numberInput.addEventListener('input', (e) => {
                rangeInput.value = e.target.value; // Sync slider with input
                updateScenarioVector(variableNameWithModel, parseFloat(e.target.value));
            });

            rangeInput.addEventListener('input', (e) => {
                numberInput.value = e.target.value; // Sync input with slider
                updateScenarioVector(variableNameWithModel, parseFloat(e.target.value));
            });

            variableInputsDiv.appendChild(continuousGroup);
        }
    });

    // Display categorical variables
    Object.keys(groupedVariables).forEach(variableName => {
        const variableGroup = groupedVariables[variableName];
        const firstVariable = variableGroup[0];
        const variableNameWithModel = `${variableName}_model1`;

        if (firstVariable.categorical === 1) {
            // Create radio group for categorical variables
            const radioGroup = document.createElement('div');
            radioGroup.innerHTML = `<label>${firstVariable.display_text}:</label><br>`;

            variableGroup.forEach((variable, idx) => {
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.id = `${variableNameWithModel}${idx}`;
                radioInput.name = variableNameWithModel;
                radioInput.value = variable.values;
                if (variable.base === 1) {
                    radioInput.checked = true;
                    scenarioVectors[variableNameWithModel][idx] = 1; // Set default value based on "base" column
                }

                const radioLabel = document.createElement('label');
                radioLabel.htmlFor = radioInput.id;
                radioLabel.innerText = variable.value_label;

                radioGroup.appendChild(radioInput);
                radioGroup.appendChild(radioLabel);

                radioInput.addEventListener('change', () => {
                    updateScenarioVector(variableNameWithModel, idx);
                    console.log(`Updated Scenario Vector for ${variable.variable}:`, scenarioVectors[variableNameWithModel]);
                });
            });

            variableInputsDiv.appendChild(radioGroup);
        }
    });

    // Display all constructed scenario vectors for categorical variables
    Object.keys(scenarioVectors).forEach(variableNameWithModel => {
        if (Array.isArray(scenarioVectors[variableNameWithModel])) {
            console.log(`Constructed Scenario Vector for ${variableNameWithModel}:`, scenarioVectors[variableNameWithModel]);
        }
    });

    // Display the overall scenarioVectorHelper
    updateScenarioVectorHelper();
    console.log('Overall Scenario Vector Helper:', scenarioVectorHelper);

    // Set scenarioVector to be equal to scenarioVectorHelper
    scenarioVector = [...scenarioVectorHelper];
    console.log('Final Scenario Vector:', scenarioVector);
}

// Update the scenario vector based on user input
function updateScenarioVector(variableName, value) {
    if (Array.isArray(scenarioVectors[variableName])) {
        scenarioVectors[variableName] = scenarioVectors[variableName].map((_, i) => (i === value ? 1 : 0)); // Update scenario vector for categorical variables
    } else {
        const baseValue = baseValues[variableName];
        const scaleValue = scaleValues[variableName];
        scenarioVectors[variableName] = (value - baseValue) / scaleValue; // Update scenario vector for continuous variables with scaling
    }

    // Log the updated scenario vector to the console for debugging
    console.log(`Updated Scenario Vector for ${variableName} (for debugging):`, scenarioVectors[variableName]);

    updateScenarioVectorHelper(); // Update the overall scenarioVectorHelper

    calculateRisk(); // Trigger the risk calculation in riskCalculator.js
}

// Update the overall scenarioVectorHelper
function updateScenarioVectorHelper() {
    scenarioVectorHelper = []; // Clear the helper vector
    Object.keys(scenarioVectors).forEach(variableName => {
        if (Array.isArray(scenarioVectors[variableName])) {
            scenarioVectorHelper = scenarioVectorHelper.concat(scenarioVectors[variableName]);
        } else {
            scenarioVectorHelper.push(scenarioVectors[variableName]); // Add continuous variable values with scaling
        }
    });

    // Log the updated overall scenarioVectorHelper to the console for debugging
    console.log('Updated Overall Scenario Vector Helper (for debugging):', scenarioVectorHelper);

    // Update the final scenarioVector
    scenarioVector = [...scenarioVectorHelper];
    console.log('Final Scenario Vector:', scenarioVector);
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
}# flick 20250409213612-TbGZ
# flick 20250409214217-SeNg
# flick 20250409214634-jngc
# flick 20250409220131-Y8iQ
# flick 20250409220322-3jvE
# flick 20250410002734-ykZL
# flick 20250410004051-QCAo
# flick 20250410004709-R4Pn
# flick 20250410013244-tgqc
# flick 20250410031440-j5jP
# flick 20250410032810-4lJl
# flick 20250410141344-eJI6
# flick 20250410152046-1xEm
# flick 20250410154743-Ez2D
# flick 20250410202642-nMwp
# flick 20250410204358-1Bl2
# flick 20250413011143-9EOB
# flick 20250413011338-ekWP
# flick 20250413165545-LbAf
# flick 20250413171242-vnPO
# flick 20250414004213-4x13
# flick 20250415193727-eJca
# flick 20250415200843-Umcu
# flick 20250415204936-qN1x
# flick 20250415212401-Mu1L
# flick 20250415212833-mBCQ
# flick 20250415223233-7jUl
# flick 20250415225604-Sefd
# flick 20250415233206-WXK0
# flick 20250416014327-kkzR
# flick 20250416023208-YMV4
# flick 20250416041427-v4uI
# flick 20250416151911-tW9F
# flick 20250416155840-Vv2l
# flick 20250416160319-PQWW
# flick 20250416163056-QoOT
# flick 20250416191858-VY92
# flick 20250416214302-VsV0
# flick 20250416214706-hZaX
# flick 20250416222626-Jeu5
# flick 20250417000350-PfmH
# flick 20250417034406-GOmX
# flick 20250417185031-pDnM
# flick 20250417192644-8ltD
# flick 20250417193145-EYza
# flick 20250418021901-5feV
# flick 20250418022523-whqY
# flick 20250418025025-q60W
# flick 20250418030103-ZpgI
# flick 20250422032350-hwod
# flick 20250422214552-U3Pp
# flick 20250422215639-BnwT
# flick 20250423011734-P0dR
# flick 20250423014100-2lcJ
# flick 20250423163824-SL5y
# flick 20250423180025-TFfQ
# flick 20250423195657-S2VQ
# flick 20250423200932-I8Cm
