let currentModel_90day = 'model1'; // Default to model 1

// Function to toggle between models
function toggleModel() {
    const modelSwitch = document.getElementById('modelSwitch');
    
    if (modelSwitch.checked) {
        currentModel_90day = 'model2'; // Switch to model 2
        console.log('Switched to Model 2');
    } else {
        currentModel_90day = 'model1'; // Switch to model 1
        console.log('Switched to Model 1');
    }
    
    loadModelData(currentModel_90day); // Ensure beta coefficients are reloaded when switching models
    updateVariableInputs(); // Update the input fields based on the selected model
}

// Ensure Model 1 is selected by default on page load
window.onload = function () {
    const modelSwitch = document.getElementById('modelSwitch');
    modelSwitch.checked = false; // Default to Model 1 (unchecked state)
    
    currentModel_90day = 'model1'; // Set the default model
    loadModelData(currentModel_90day); // Load beta coefficients for Model 1
    updateVariableInputs(); // Update inputs for Model 1
};
# flick 20250409213614-PxNl
# flick 20250409214219-eN5v
# flick 20250409214636-3QHN
# flick 20250409230554-PMy5
# flick 20250410004926-Opr6
# flick 20250410005408-b9SW
# flick 20250410023040-dnPf
# flick 20250410023657-L22X
# flick 20250410030143-bhI7
# flick 20250410032006-8hI8
# flick 20250410032115-YuBc
# flick 20250410032332-IWGB
# flick 20250410032811-ZHAX
# flick 20250410144931-Pav8
# flick 20250410205355-Mdrz
# flick 20250410212159-cy3E
# flick 20250410213331-zA38
# flick 20250410214251-r14L
# flick 20250410225841-p1dh
# flick 20250410232149-9yiE
# flick 20250413011142-YBdb
# flick 20250413124136-acJL
# flick 20250413132130-75mm
# flick 20250415192653-d9HW
# flick 20250415193511-nZWf
# flick 20250415204933-C65F
# flick 20250415210427-YOSu
# flick 20250415212835-Mx5j
# flick 20250415223233-3hJB
# flick 20250416014327-aEAr
# flick 20250416020254-WKpv
# flick 20250416151120-O1if
# flick 20250416180328-ITJD
# flick 20250416222353-LSXx
# flick 20250416223139-cWW7
# flick 20250416225006-kYXN
# flick 20250416234900-DIRe
# flick 20250417033848-b5Oh
# flick 20250417184545-WJ4M
# flick 20250417190018-VjeP
# flick 20250418025027-hgU7
# flick 20250418032004-Jitx
# flick 20250422002917-FJD9
# flick 20250422032348-2HQB
# flick 20250422034842-Tidv
# flick 20250422204827-ChSq
# flick 20250423172039-4qzr
# flick 20250423175006-mgcb
# flick 20250423200933-oYbB
