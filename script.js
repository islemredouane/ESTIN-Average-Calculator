// Semester data
const semesterData = {
  "1CP-S1": {
    name: "1CP - Semester 1",
    modules: [
      { unit: "UEF 1", module: "ALSDS", coef: 5, credit: 6 },
      { unit: "UEF 1", module: "ARCH 1", coef: 4, credit: 5 },
      { unit: "UEF 1", module: "SYST 1", coef: 3, credit: 3 },
      { unit: "UEF 2", module: "ANA 1", coef: 5, credit: 6 },
      { unit: "UEF 2", module: "ALG 1", coef: 3, credit: 3 },
      { unit: "UEF 2", module: "ELECT", coef: 3, credit: 4 },
      { unit: "UET", module: "TEE", coef: 2, credit: 2 },
      { unit: "UED", module: "BTW", coef: 1, credit: 1 }
    ]
  },
  "1CP-S2": {
    name: "1CP - Semester 2",
    modules: [
      { unit: "UEF 3", module: "ALSDD", coef: 5, credit: 6 },
      { unit: "UEF 3", module: "SYST 2", coef: 3, credit: 3 },
      { unit: "UEF 4", module: "ANA 2", coef: 5, credit: 6 },
      { unit: "UEF 4", module: "ALG 2", coef: 3, credit: 4 },
      { unit: "UEM 1", module: "MECA", coef: 3, credit: 3 },
      { unit: "UET", module: "TEO", coef: 2, credit: 2 }
    ]
  },
  "2CP-S1": {
    name: "2CP - Semester 1",
    modules: [
      { unit: "UEF 5", module: "SFSD", coef: 4, credit: 4 },
      { unit: "UEF 5", module: "ARCH 2", coef: 4, credit: 4 },
      { unit: "UEF 5", module: "ELECT2", coef: 4, credit: 4 },
      { unit: "UEF 6", module: "ANA 3", coef: 5, credit: 6 },
      { unit: "UEF 6", module: "ALG 3", coef: 3, credit: 3 },
      { unit: "UEF 6", module: "PROBA1", coef: 4, credit: 4 },
      { unit: "UET", module: "ANGLAIS", coef: 2, credit: 2 },
      { unit: "UED", module: "ECONOMY", coef: 2, credit: 3 }
    ]
  },
  "2CP-S2": {
    name: "2CP - Semester 2",
    modules: [
      { unit: "UEF 8", module: "ANAL4", coef: 5, credit: 6 },
      { unit: "UEF 8", module: "LOGM", coef: 4, credit: 4 },
      { unit: "UEM 3", module: "OOE", coef: 3, credit: 3 },
      { unit: "UEM 3", module: "PRJP", coef: 4, credit: 4 },
      { unit: "UEM 4", module: "PRST2", coef: 4, credit: 4 },
      { unit: "UET", module: "ANG3", coef: 2, credit: 2 },
      { unit: "UEF 7", module: "POO", coef: 4, credit: 4 },
      { unit: "UEF 7", module: "SINF", coef: 3, credit: 3 }
    ]
  }
};

// Global state
let currentSemester = "1CP-S1";
let grades = {};

// DOM Elements
const header = document.getElementById('header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const semesterSelector = document.getElementById('semesterSelector');
const scrollIndicator = document.getElementById('scrollIndicator');
const modulesTableBody = document.getElementById('modulesTableBody');
const currentSemesterName = document.getElementById('currentSemesterName');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const printBtn = document.getElementById('printBtn');
const resultsSection = document.getElementById('results');
const resultsGrid = document.getElementById('resultsGrid');
const studentNameDiv = document.getElementById('studentName');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  renderModulesTable();
  setupEventListeners();
});

// Handle scroll for header
window.addEventListener('scroll', function() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Setup event listeners
function setupEventListeners() {
  // Mobile menu toggle
  if (hamburger) {
    console.log('✅ Hamburger button found!');
    hamburger.addEventListener('click', function() {
      console.log('🍔 Hamburger clicked!');
      navLinks.classList.toggle('active');
      const isActive = navLinks.classList.contains('active');
      hamburger.innerHTML = isActive
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
      console.log('Menu is now:', isActive ? 'OPEN ✕' : 'CLOSED ☰');
    });
  } else {
    console.error('❌ Hamburger button NOT found!');
  }

  // Close mobile menu when clicking nav links
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.classList.remove('active');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      console.log('Nav link clicked, menu closed');
    });
  });

  // Semester selector
  const semesterBtns = semesterSelector.querySelectorAll('.semester-btn');
  semesterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      semesterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      // Update current semester
      currentSemester = this.dataset.semester;
      grades = {};
      resultsSection.style.display = 'none';
      renderModulesTable();
      currentSemesterName.textContent = semesterData[currentSemester].name;
      // Scroll to calculator
      setTimeout(() => {
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
      }, 300);
    });
  });

  // Scroll indicator
  scrollIndicator.addEventListener('click', function() {
    document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
  });

  // Calculate button
  calculateBtn.addEventListener('click', calculateResults);

  // Reset button
  resetBtn.addEventListener('click', resetForm);

  // Print button
  printBtn.addEventListener('click', function() {
    window.print();
  });
}

// Render modules table
function renderModulesTable() {
  const modules = semesterData[currentSemester].modules;
  modulesTableBody.innerHTML = '';
  
  let currentUnit = '';
  
  modules.forEach((module, index) => {
    const moduleKey = `${module.module}-${index}`;
    
    // Add unit header row if unit changes
    if (module.unit !== currentUnit) {
      currentUnit = module.unit;
      const unitRow = document.createElement('tr');
      unitRow.className = 'unit-row';
      unitRow.innerHTML = `<td colspan="8" class="unit-cell">${module.unit}</td>`;
      modulesTableBody.appendChild(unitRow);
    }
    
    // Add module row
    const moduleRow = document.createElement('tr');
    moduleRow.className = 'module-row';
    moduleRow.innerHTML = `
      <td class="unit-name">${module.unit}</td>
      <td class="module-name-cell">${module.module}</td>
      <td class="text-center">${module.coef}</td>
      <td class="text-center">${module.credit}</td>
      <td>
        <input
          type="number"
          min="0"
          max="20"
          step="0.5"
          placeholder="0-20"
          class="grade-input"
          data-module="${moduleKey}"
          data-type="exam"
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="20"
          step="0.5"
          placeholder="0-20"
          class="grade-input"
          data-module="${moduleKey}"
          data-type="td"
        />
      </td>
      <td class="text-center">
        <span class="avg-value" id="avg-${moduleKey}">--</span>
      </td>
      <td class="text-center">
        <span class="credits-value" id="credits-${moduleKey}">--</span>
      </td>
    `;
    modulesTableBody.appendChild(moduleRow);
  });
  
  // Add event listeners to all grade inputs
  const gradeInputs = document.querySelectorAll('.grade-input');
  gradeInputs.forEach(input => {
    input.addEventListener('input', handleGradeInput);
  });
}

// Handle grade input
function handleGradeInput(e) {
  const moduleKey = e.target.dataset.module;
  const type = e.target.dataset.type;
  const value = e.target.value;
  
  if (!grades[moduleKey]) {
    grades[moduleKey] = { exam: '', td: '' };
  }
  
  grades[moduleKey][type] = value;
  
  // Update real-time calculation for this module
  updateModuleDisplay(moduleKey);
}

// Update module display (average and credits)
function updateModuleDisplay(moduleKey) {
  const moduleData = grades[moduleKey];
  const avgElement = document.getElementById(`avg-${moduleKey}`);
  const creditsElement = document.getElementById(`credits-${moduleKey}`);
  
  if (!moduleData || (!moduleData.exam && !moduleData.td)) {
    avgElement.textContent = '--';
    avgElement.className = 'avg-value';
    creditsElement.textContent = '--';
    creditsElement.className = 'credits-value';
    return;
  }
  
  const examGrade = parseFloat(moduleData.exam || 0);
  const tdGrade = parseFloat(moduleData.td || 0);
  const moduleAvg = calculateModuleAverage(examGrade, tdGrade);
  
  // Find module credit
  const modules = semesterData[currentSemester].modules;
  const moduleIndex = parseInt(moduleKey.split('-').pop());
  const credit = modules[moduleIndex].credit;
  
  avgElement.textContent = moduleAvg.toFixed(2);
  avgElement.className = `avg-value ${moduleAvg >= 10 ? 'pass' : 'fail'}`;
  
  const creditsObtained = moduleAvg >= 10 ? credit : 0;
  creditsElement.textContent = creditsObtained;
  creditsElement.className = `credits-value ${creditsObtained > 0 ? 'pass' : ''}`;
}

// Calculate module average
function calculateModuleAverage(exam, td) {
  return (exam * 0.67 + td * 0.33);
}

// Calculate results
function calculateResults() {
  const modules = semesterData[currentSemester].modules;
  const unitData = {};
  
  modules.forEach((module, index) => {
    const moduleKey = `${module.module}-${index}`;
    const examGrade = parseFloat(grades[moduleKey]?.exam || 0);
    const tdGrade = parseFloat(grades[moduleKey]?.td || 0);
    const moduleAvg = calculateModuleAverage(examGrade, tdGrade);
    
    if (!unitData[module.unit]) {
      unitData[module.unit] = {
        totalWeightedAverage: 0,
        totalCoefficients: 0,
        totalCredits: 0,
        obtainedCredits: 0,
        modules: []
      };
    }
    
    unitData[module.unit].totalWeightedAverage += moduleAvg * module.coef;
    unitData[module.unit].totalCoefficients += module.coef;
    unitData[module.unit].totalCredits += module.credit;
    unitData[module.unit].obtainedCredits += moduleAvg >= 10 ? module.credit : 0;
    unitData[module.unit].modules.push({
      ...module,
      average: moduleAvg,
      creditsObtained: moduleAvg >= 10 ? module.credit : 0
    });
  });

  let semesterWeightedAverage = 0;
  let semesterTotalCoefficients = 0;
  let semesterTotalCredits = 0;
  let semesterObtainedCredits = 0;

  const units = Object.keys(unitData).map(unitName => {
    const data = unitData[unitName];
    const unitAverage = data.totalCoefficients > 0 
      ? data.totalWeightedAverage / data.totalCoefficients 
      : 0;
    
    if (data.totalCoefficients > 0) {
      semesterWeightedAverage += unitAverage * data.totalCoefficients;
      semesterTotalCoefficients += data.totalCoefficients;
    }
    
    semesterTotalCredits += data.totalCredits;
    semesterObtainedCredits += data.obtainedCredits;
    
    return {
      name: unitName,
      average: unitAverage,
      credits: data.obtainedCredits,
      totalCredits: data.totalCredits,
      modules: data.modules
    };
  });

  const semesterAverage = semesterTotalCoefficients > 0 
    ? semesterWeightedAverage / semesterTotalCoefficients 
    : 0;

  displayResults({
    units,
    semesterAverage,
    semesterObtainedCredits,
    semesterTotalCredits
  });
}

// Display results
function displayResults(results) {
  resultsGrid.innerHTML = '';
  
  // Display student name if available
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  if (firstName || lastName) {
    studentNameDiv.textContent = `${firstName} ${lastName}`;
    studentNameDiv.style.display = 'block';
  } else {
    studentNameDiv.style.display = 'none';
  }
  
  // Create semester summary card FIRST (full width at top)
  const semesterCard = document.createElement('div');
  semesterCard.className = 'result-card semester-card';
  semesterCard.style.animationDelay = '0s';
  semesterCard.innerHTML = `
    <div class="card-header">
      <h4>🎓 Semester Average - ${semesterData[currentSemester].name}</h4>
    </div>
    <div class="card-body">
      <div class="average-display large ${results.semesterAverage >= 10 ? 'pass' : 'fail'}">
        ${results.semesterAverage.toFixed(2)}
      </div>
      <div class="credits-display">
        <span class="credits-obtained">${results.semesterObtainedCredits}</span>
        <span class="credits-separator">/</span>
        <span class="credits-total">${results.semesterTotalCredits}</span>
        <span class="credits-label">Total Credits</span>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill semester" style="width: ${(results.semesterAverage / 20) * 100}%"></div>
    </div>
  `;
  resultsGrid.appendChild(semesterCard);
  
  // Create unit cards
  results.units.forEach((unit, index) => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.animationDelay = `${(index + 1) * 0.1}s`;
    card.innerHTML = `
      <div class="card-header">
        <h4>${unit.name}</h4>
      </div>
      <div class="card-body">
        <div class="average-display ${unit.average >= 10 ? 'pass' : 'fail'}">
          ${unit.average.toFixed(2)}
        </div>
        <div class="credits-display">
          <span class="credits-obtained">${unit.credits}</span>
          <span class="credits-separator">/</span>
          <span class="credits-total">${unit.totalCredits}</span>
          <span class="credits-label">Credits</span>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${(unit.average / 20) * 100}%"></div>
      </div>
    `;
    resultsGrid.appendChild(card);
  });
  
  // Show results section
  resultsSection.style.display = 'block';
  
  // Scroll to results
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

// Reset form
function resetForm() {
  grades = {};
  firstNameInput.value = '';
  lastNameInput.value = '';
  resultsSection.style.display = 'none';
  renderModulesTable();
}
