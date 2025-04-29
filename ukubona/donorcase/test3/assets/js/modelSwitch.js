let currentModel = 'model1'; // Default to model 1

// Function to toggle between models
function toggleModel() {
    const modelSwitch = document.getElementById('modelSwitch');
    
    if (modelSwitch.checked) {
        currentModel = 'model2'; // Switch to model 2
        console.log('Switched to ESRD');
    } else {
        currentModel = 'model1'; // Switch to model 1
        console.log('Switched to Mortality');
    }
    
    loadModelData(currentModel); // Ensure beta coefficients are reloaded when switching models
    updateVariableInputs(); // Update the input fields based on the selected model
    updateVariableInputs2(); // Update the input fields for the second set of beta coefficients
}

// Ensure Model 1 is selected by default on page load
window.onload = function () {
    const modelSwitch = document.getElementById('modelSwitch');
    modelSwitch.checked = false; // Default to Model 1 (unchecked state)
    
    currentModel = 'model1'; // Set the default model
    loadModelData(currentModel); // Load beta coefficients for Model 1
    updateVariableInputs(); // Update inputs for Model 1
    updateVariableInputs2(); // Update inputs for Model 2
};# flick 20250409213613-zLOf
# flick 20250409214218-tbtO
# flick 20250409214635-wlE0
# flick 20250409220129-mZzq
# flick 20250409231149-JkxH
# flick 20250410002734-sbFQ
# flick 20250410005847-6gp8
# flick 20250410021550-lybs
# flick 20250410023041-5J5I
# flick 20250410031439-CG2C
# flick 20250410130448-svW2
# flick 20250410133820-m9w5
# flick 20250410140618-Ds6g
# flick 20250410141346-PlDO
# flick 20250410145602-v9IL
# flick 20250410152848-wOUw
# flick 20250410162734-S1AB
# flick 20250410202643-25RX
# flick 20250410225842-wSIt
# flick 20250411000241-sSbJ
# flick 20250413011052-QQTa
# flick 20250415191552-zsuR
# flick 20250415195128-tlvS
# flick 20250415203936-4Dif
# flick 20250415204932-y3qM
# flick 20250415205656-vTKB
# flick 20250415223234-BH5z
# flick 20250416014325-l8CH
# flick 20250416020253-Jqgy
# flick 20250416025012-MUzl
# flick 20250416041427-QEBA
# flick 20250416161513-Kyh1
# flick 20250416163057-XfzS
# flick 20250416163654-6nDU
# flick 20250416180329-uzzt
# flick 20250416212949-3qVP
# flick 20250416214301-jt6E
# flick 20250416222353-xMIy
# flick 20250416222901-to3U
# flick 20250416223140-Wghv
# flick 20250416225010-7FIc
# flick 20250416225809-ngoz
# flick 20250417001815-YF8J
# flick 20250417033849-kxWe
# flick 20250417140107-KnVt
# flick 20250417190343-DwUo
# flick 20250417192643-KbpN
# flick 20250417193145-X6yt
# flick 20250418032006-Kxfb
# flick 20250418040653-i0ey
# flick 20250422004337-nkNo
# flick 20250422032350-m9SK
# flick 20250422215640-eUjx
# flick 20250422215934-jMed
# flick 20250423005724-aKg1
# flick 20250423011735-bkRq
# flick 20250423171402-QXpp
# flick 20250423173644-Tinp
# flick 20250423175004-aCUg
# flick 20250423195958-kPZk
