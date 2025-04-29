async function loadCalculator() {
    const selectedCalculator = document.querySelector('input[name="calculator"]:checked').value;
    const calculatorContainer = document.getElementById('calculator-container');
    const dynamicScripts = document.getElementById('dynamic-scripts');

    // Clear previous content and scripts
    calculatorContainer.innerHTML = '';
    while (dynamicScripts.firstChild) {
        dynamicScripts.removeChild(dynamicScripts.firstChild);
    }

    // Define LOCAL script paths based on selection
    let scriptsToLoad = [];

    if (selectedCalculator === '30year') {
        scriptsToLoad = [
            '../test3/assets/js/modelSwitch.js',
            '../test3/assets/js/plotRisk.js',
            '../test3/assets/js/riskCalculator.js',
            '../test3/assets/js/variableMenu.js'
        ];
    } else if (selectedCalculator === '90day') {
        scriptsToLoad = [
            '../test2/assets/js/modelSwitch.js',
            '../test2/assets/js/plotRisk.js',
            '../test2/assets/js/riskCalculator.js',
            '../test2/assets/js/variableMenu.js'
        ];
    } else {
        scriptsToLoad = [
            '../test4/assets/js/variableMenu.js',
            '../test4/assets/js/riskCalculator.js',
            '../test4/assets/js/plotRisk.js'
        ];
    }

    // Dynamically inject <script> tags
    const loadScripts = scriptsToLoad.map(src => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.onload = () => {
                console.log(`Loaded script: ${src}`);
                resolve();
            };
            script.onerror = () => {
                console.error(`Failed to load script: ${src}`);
                reject(new Error(`Failed to load ${src}`));
            };
            dynamicScripts.appendChild(script);
        });
    });

    // Inject local CSS if not already present
    const cssHref = './assets/css/style.css';
    if (!document.querySelector(`link[href="${cssHref}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
        document.head.appendChild(link);
    }

    // Render static calculator HTML
    if (selectedCalculator === '90day') {
        calculatorContainer.innerHTML = `
            <div class="calculator-container">
                <h1>90-Day Mortality Risk Calculator</h1>
                <div class="model-toggle-container">
                    <span id="model1Label">Model 1</span>
                    <label class="switch">
                        <input type="checkbox" id="modelSwitch" onclick="toggleModel()">
                        <span class="slider round"></span>
                    </label>
                    <span id="model2Label">Model 2</span>
                </div>
                <form id="calculator-form">
                    <h2>Set Variables</h2>
                    <div id="variable-inputs"></div>
                    <button type="button" onclick="calculateRisk()">Calculate Risk</button>
                </form>
                <h2>Risk Plot</h2>
                <div id="mortality-risk-graph-container">
                    <div id="mortality-risk-graph"></div>
                </div>
            </div>
        `;
    } else if (selectedCalculator === '30year') {
        calculatorContainer.innerHTML = `
            <div class="calculator-container">
                <h1>30-Year Mortality Risk Calculator</h1>
                <div class="model-toggle-container">
                    <span id="model1Label">Mortality</span>
                    <label class="switch">
                        <input type="checkbox" id="modelSwitch" onclick="toggleModel()">
                        <span class="slider round"></span>
                    </label>
                    <span id="model2Label">ESRD</span>
                </div>
                <form id="calculator-form">
                    <h2>Set Variables For Control Population</h2>
                    <div id="variable-inputs"></div>
                    <h2>Set Variables For Donor Population</h2>
                    <div id="variable-inputs-2"></div>
                    <button type="button" onclick="calculateRisk()">Calculate Risk</button>
                </form>
                <h2>Risk Plot</h2>
                <div id="mortality-risk-graph-container">
                    <div id="mortality-risk-graph"></div>
                </div>
            </div>
        `;
    } else if (selectedCalculator === 'hospitalization') {
        calculatorContainer.innerHTML = `
            <div class="calculator-container">
                <h1>All-cause Hospitalization After Nephrectomy</h1>
                <h1>Among Live Kidney Donors</h1>
                <form id="calculator-form">
                    <h2>Set Variables</h2>
                    <div id="variable-inputs"></div>
                    <button type="button" onclick="calculateRisk()">Calculate Risk</button>
                </form>
                <h2>Risk Plot</h2>
                <div id="hospitalization-risk-graph-container">
                    <div id="hospitalization-risk-graph"></div>
                </div>
            </div>
        `;
    }

    // Wait for all scripts to load, then call model/data functions
    try {
        await Promise.all(loadScripts);

        if (selectedCalculator === '30year' || selectedCalculator === '90day') {
            if (typeof toggleModel === 'function') {
                toggleModel();
            } else {
                console.error('toggleModel() not defined');
            }
        } else {
            if (typeof loadModelData === 'function') await loadModelData();
            if (typeof loadSurvivalData === 'function') await loadSurvivalData();
            if (typeof updateVariableInputs === 'function') updateVariableInputs();
        }
    } catch (err) {
        console.error('Error loading scripts or initializing calculator:', err);
    }
}