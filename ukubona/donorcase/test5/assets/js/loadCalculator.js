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
# flick 20250409213616-zKv9
# flick 20250409214220-kYNy
# flick 20250409214637-r3ND
# flick 20250409220944-fW2K
# flick 20250409230606-8gKx
# flick 20250409234310-GCxM
# flick 20250410004046-86Ws
# flick 20250410010502-d4BO
# flick 20250410014857-RJFh
# flick 20250410021546-CKBc
# flick 20250410031440-Pbgk
# flick 20250410032005-0d1l
# flick 20250410140621-HpTC
# flick 20250410162337-Hcwk
# flick 20250410205732-Whbp
# flick 20250413010201-rQua
# flick 20250413011340-VkXZ
# flick 20250413124137-pwCP
# flick 20250413213135-DlNa
# flick 20250413233325-41bj
# flick 20250414012931-Ac8D
# flick 20250414041740-Lcxg
# flick 20250415191552-fG5P
# flick 20250415193726-5XyM
# flick 20250415194338-lxBj
# flick 20250415195124-UYXK
# flick 20250415203936-xAW0
# flick 20250415205659-U5Q0
# flick 20250415233203-0E7u
# flick 20250416023211-lMmz
# flick 20250416041428-YbME
# flick 20250416161508-y4pQ
# flick 20250416163059-99GR
# flick 20250416213545-yukU
# flick 20250416221048-xi8w
# flick 20250417030420-suz0
# flick 20250417185035-vIP0
# flick 20250417190344-CPir
# flick 20250418025026-ZpO2
# flick 20250422034843-n7Fu
# flick 20250422212438-E9oU
# flick 20250423175007-l3es
# flick 20250423180924-0Hk1
# flick 20250428112848-G7fT
