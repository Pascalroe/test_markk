/* ============================================
   MK - FitFlow Performance Studio
   Wizard & Flow Logic
   ============================================ */

// State Management
const flowState = {
    currentStep: 1,
    totalSteps: 5,
    data: {
        ziel: null,
        haeufigkeit: 3,
        level: null,
        daten: {},
        equipment: null
    }
};

// Storage Keys
const STORAGE_KEY = 'mk_flow_state';
const PARTIAL_KEY = 'mk_partial_data';

/* ============================================
   INITIALIZATION
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Check for partial save on page load
    checkPartialSave();
    
    // Initialize from URL hash
    if (window.location.hash === '#wizard') {
        startFlow();
    }
});

/* ============================================
   PARTIAL SAVE LOGIC
   ============================================ */

function checkPartialSave() {
    const partial = localStorage.getItem(PARTIAL_KEY);
    if (partial) {
        const savedData = JSON.parse(partial);
        // Show modal if user has started but not finished
        if (savedData.step && savedData.step > 1 && savedData.step <= 5) {
            document.getElementById('partialSaveModal').style.display = 'flex';
        }
    }
}

function continueProgress() {
    const savedData = JSON.parse(localStorage.getItem(PARTIAL_KEY));
    if (savedData) {
        flowState.data = savedData.data || flowState.data;
        flowState.currentStep = savedData.step || 1;
    }
    document.getElementById('partialSaveModal').style.display = 'none';
    startFlow();
    if (flowState.currentStep > 1) {
        showStep(flowState.currentStep);
    }
}

function discardProgress() {
    localStorage.removeItem(PARTIAL_KEY);
    localStorage.removeItem(STORAGE_KEY);
    document.getElementById('partialSaveModal').style.display = 'none';
    flowState.data = { ziel: null, haeufigkeit: 3, level: null, daten: {}, equipment: null };
    flowState.currentStep = 1;
}

function savePartialProgress() {
    const partial = {
        step: flowState.currentStep,
        data: flowState.data,
        timestamp: Date.now()
    };
    localStorage.setItem(PARTIAL_KEY, JSON.stringify(partial));
}

/* ============================================
   FLOW CONTROL
   ============================================ */

function startFlow() {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('results-preview').style.display = 'none';
    document.getElementById('wizard').style.display = 'block';
    document.getElementById('faq-teaser').style.display = 'none';
    
    // Reset or continue from saved state
    if (flowState.currentStep === 1) {
        showStep(1);
    } else {
        showStep(flowState.currentStep);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Save progress
    savePartialProgress();
}

function showStep(stepNum) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show current step
    const stepEl = document.getElementById(`step${stepNum === 'results' ? 'Results' : stepNum}`);
    if (stepEl) {
        stepEl.style.display = 'block';
    }
    
    // Update progress
    updateProgress(stepNum);
    
    // Update state
    flowState.currentStep = stepNum;
    
    // Restore previous selections
    restoreSelections(stepNum);
}

function updateProgress(stepNum) {
    const progress = (stepNum / flowState.totalSteps) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `Schritt ${stepNum} von ${flowState.totalSteps}`;
    
    // Update dots
    document.querySelectorAll('.progress-dot').forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index + 1 === stepNum) {
            dot.classList.add('active');
        } else if (index + 1 < stepNum) {
            dot.classList.add('completed');
        }
    });
}

function restoreSelections(stepNum) {
    if (stepNum === 2) {
        document.getElementById('frequencySlider').value = flowState.data.haeufigkeit || 3;
        updateFrequency(flowState.data.haeufigkeit || 3);
    }
}

function nextStep(currentStep, key, value) {
    // Save data
    if (key === 'haeufigkeit') {
        flowState.data[key] = parseInt(value);
    } else {
        flowState.data[key] = value;
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowState.data));
    savePartialProgress();
    
    // Move to next step
    if (currentStep < flowState.totalSteps) {
        showStep(currentStep + 1);
    } else {
        showResults();
    }
}

function prevStep(currentStep) {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function skipStep(key, defaultValue) {
    flowState.data[key] = defaultValue;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowState.data));
    savePartialProgress();
    
    const currentStep = flowState.currentStep;
    if (currentStep < flowState.totalSteps) {
        showStep(currentStep + 1);
    } else {
        showResults();
    }
}

/* ============================================
   SELECTION HANDLERS
   ============================================ */

function selectOption(element, key, value) {
    // Visual selection
    const parent = element.closest('.options-grid');
    if (parent) {
        parent.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
    }
    element.classList.add('selected');
    
    // Save data
    flowState.data[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowState.data));
    savePartialProgress();
    
    // Auto-advance after short delay
    setTimeout(() => {
        const currentStep = flowState.currentStep;
        if (currentStep < flowState.totalSteps) {
            nextStep(currentStep, key, value);
        } else {
            showResults();
        }
    }, 300);
}

function updateFrequency(value) {
    flowState.data.haeufigkeit = parseInt(value);
    document.getElementById('frequencyValue').textContent = `${value} Tage`;
    
    // Update description based on value
    const desc = document.getElementById('frequencyDesc');
    if (value <= 2) {
        desc.innerHTML = '<p>2 Tage pro Woche ist ein guter Einstieg. Du kannst später steigern!</p>';
    } else if (value <= 4) {
        desc.innerHTML = '<p>3-4 Tage pro Woche ist ideal für die meisten Ziele. Gute Balance!</p>';
    } else {
        desc.innerHTML = '<p>5-6 Tage ist intensiv! Nur empfehlenswert wenn du erfahren bist.</p>';
    }
}

function saveDataAndNext() {
    // Collect data
    flowState.data.daten = {
        age: document.getElementById('age').value,
        weight: document.getElementById('weight').value,
        height: document.getElementById('height').value,
        gender: document.getElementById('gender').value
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowState.data));
    savePartialProgress();
    
    nextStep(4, 'daten', flowState.data.daten);
}

/* ============================================
   RESULTS GENERATION
   ============================================ */

function showResults() {
    showStep('results');
    
    const { ziel, haeufigkeit, level, daten, equipment } = flowState.data;
    
    // Generate personalized results
    const results = generateResults(ziel, haeufigkeit, level, equipment, daten);
    
    // Display results
    const grid = document.getElementById('resultsGrid');
    grid.innerHTML = results.map(item => `
        <div class="result-card ${item.featured ? 'featured' : ''}">
            <div class="result-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="result-content">
                ${item.tag ? `<span class="result-tag">${item.tag}</span>` : ''}
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <ul class="result-features">
                    ${item.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <div class="result-price">
                    ${item.price ? `
                        <span class="price-from">${item.priceLabel || 'ab'}</span>
                        <span class="price">${item.price}€</span>
                        ${item.pricePeriod ? `<span class="price-period">${item.pricePeriod}</span>` : ''}
                    ` : ''}
                </div>
                <a href="kontakt.html" class="btn-primary btn-block">${item.cta}</a>
            </div>
        </div>
    `).join('');
    
    // Clear partial save on completion
    localStorage.removeItem(PARTIAL_KEY);
    
    // Scroll to results
    document.getElementById('wizard').scrollIntoView({ behavior: 'smooth' });
}

function generateResults(ziel, haeufigkeit, level, equipment, daten) {
    const results = [];
    
    // Image mapping based on goal
    const goalImages = {
        muskelaufbau: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=500&q=80',
        fettabbau: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80',
        fitness: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80'
    };
    
    // Primary recommendation - based on goal
    if (ziel === 'Muskelaufbau') {
        results.push({
            image: goalImages.muskelaufbau,
            featured: true,
            tag: 'Empfohlen',
            title: 'Massaufbau Programm',
            description: 'Ein strukturierter 12-Wochen-Plan speziell für Muskelaufbau. Mit progres siver Belastungssteigerung und Ernährungsleitfaden.',
            features: [
                '✓ 12-Wochen Trainingsplan',
                '✓ Übungsvideos mit Anleitung',
                '✓ Makro-Rechner für Ernährung',
                '✓ Wochenweise Progression'
            ],
            price: 49,
            priceLabel: 'einmalig',
            cta: 'Plan starten'
        });
        results.push({
            image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&q=80',
            tag: 'Premium',
            title: '1:1 Coaching',
            description: 'Persönliche Betreuung mit wöchentlichen Check-ins und individueller Plananpassung.',
            features: [
                '✓ Wöchentliche Check-ins',
                '✓ WhatsApp-Support',
                '✓ Monatliche Plananpassung',
                '✓ Ernährungsberatung inkl.'
            ],
            price: 149,
            pricePeriod: '/Monat',
            cta: 'Beratung starten'
        });
    } else if (ziel === 'Fettabbau') {
        results.push({
            image: goalImages.fettabbau,
            featured: true,
            tag: 'Empfohlen',
            title: 'Fatburn Programm',
            description: 'Effektives Programm für Fettabbau mit Cardio- und Krafttraining-Kombination.',
            features: [
                '✓ 8-Wochen Fatburn-Plan',
                '✓ HIIT-Einheiten inkl.',
                '✓ Kalorienrechner',
                '✓ Meal Prep Leitfaden'
            ],
            price: 39,
            priceLabel: 'einmalig',
            cta: 'Plan starten'
        });
        results.push({
            image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
            tag: 'Premium',
            title: '1:1 Coaching',
            description: 'Persönliche Betreuung mit wöchentlichen Check-ins und individueller Plananpassung.',
            features: [
                '✓ Wöchentliche Check-ins',
                '✓ WhatsApp-Support',
                '✓ Monatliche Plananpassung',
                '✓ Ernährungsberatung inkl.'
            ],
            price: 129,
            pricePeriod: '/Monat',
            cta: 'Beratung starten'
        });
    } else {
        results.push({
            image: goalImages.fitness,
            featured: true,
            tag: 'Empfohlen',
            title: 'Fitness Grundprogramm',
            description: 'Ein ausgewogener Trainingsplan für allgemeine Fitness und Wohlbefinden.',
            features: [
                '✓ 8-Wochen Trainingsplan',
                '✓ Ganzkörpertraining',
                '✓ Flexibility-Übungen',
                '✓ Stressmanagement-Tipps'
            ],
            price: 29,
            priceLabel: 'einmalig',
            cta: 'Plan starten'
        });
        results.push({
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80',
            tag: 'Premium',
            title: '1:1 Coaching',
            description: 'Persönliche Betreuung mit wöchentlichen Check-ins und individueller Plananpassung.',
            features: [
                '✓ Wöchentliche Check-ins',
                '✓ WhatsApp-Support',
                '✓ Monatliche Plananpassung',
                '✓ Yoga & Mobility inkl.'
            ],
            price: 99,
            pricePeriod: '/Monat',
            cta: 'Beratung starten'
        });
    }
    
    // Equipment-specific add-on
    if (equipment === 'Bodyweight') {
        results.push({
            image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&q=80',
            title: 'Bodyweight Mastery',
            description: 'Das Spezialpaket für Training ohne Geräte. Fortschrittliche Körpergewichtsübungen.',
            features: [
                '✓ Calisthenics-Progressionen',
                '✓ kein Equipment nötig',
                '✓ überall trainierbar',
                '✓ 20+ neue Übungsvarianten'
            ],
            price: 19,
            priceLabel: 'einmalig',
            cta: 'Mehr erfahren'
        });
    }
    
    return results;
}

function resetFlow() {
    // Clear all data
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PARTIAL_KEY);
    flowState.data = { ziel: null, haeufigkeit: 3, level: null, daten: {}, equipment: null };
    flowState.currentStep = 1;
    
    // Reset UI
    document.getElementById('wizard').style.display = 'none';
    document.getElementById('hero').style.display = 'grid';
    document.getElementById('results-preview').style.display = 'block';
    document.getElementById('faq-teaser').style.display = 'block';
    
    // Reset form fields
    document.getElementById('age').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('height').value = '';
    document.getElementById('gender').value = '';
    
    // Reset selections
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset slider
    document.getElementById('frequencySlider').value = 3;
    updateFrequency(3);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToResults() {
    document.getElementById('results-preview').scrollIntoView({ behavior: 'smooth' });
}