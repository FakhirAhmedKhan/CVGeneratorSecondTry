// Global state
let currentStep = 0;
let cvData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  },
  experience: [{ company: "", position: "", duration: "", description: "" }],
  education: [{ institution: "", degree: "", year: "", gpa: "" }],
  skills: [],
  achievements: [],
};

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  loadSavedData();
  renderExperience();
  renderEducation();
  renderSkills();
  renderAchievements();
  updatePreview();

  // Add event listeners for personal info inputs
  document
    .getElementById("fullName")
    .addEventListener("input", (e) =>
      updatePersonal("fullName", e.target.value)
    );
  document
    .getElementById("email")
    .addEventListener("input", (e) => updatePersonal("email", e.target.value));
  document
    .getElementById("phone")
    .addEventListener("input", (e) => updatePersonal("phone", e.target.value));
  document
    .getElementById("location")
    .addEventListener("input", (e) =>
      updatePersonal("location", e.target.value)
    );
  document
    .getElementById("summary")
    .addEventListener("input", (e) =>
      updatePersonal("summary", e.target.value)
    );

  // Mode toggle listeners
  document
    .getElementById("editModeBtn")
    .addEventListener("click", () => setViewMode("edit"));
  document
    .getElementById("previewModeBtn")
    .addEventListener("click", () => setViewMode("preview"));

  // Step navigation listeners
  document.querySelectorAll(".step-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const step = parseInt(e.currentTarget.getAttribute("data-step"));
      setCurrentStep(step);
    });
  });
});

// Save data to localStorage
function saveData() {
  localStorage.setItem("cvData", JSON.stringify(cvData));
}

// Load data from localStorage
function loadSavedData() {
  const saved = localStorage.getItem("cvData");
  if (saved) {
    cvData = JSON.parse(saved);
    populatePersonalInfo();
  }
}

// Populate personal info fields
function populatePersonalInfo() {
  document.getElementById("fullName").value = cvData.personal.fullName;
  document.getElementById("email").value = cvData.personal.email;
  document.getElementById("phone").value = cvData.personal.phone;
  document.getElementById("location").value = cvData.personal.location;
  document.getElementById("summary").value = cvData.personal.summary;
}

// Update personal information
function updatePersonal(field, value) {
  cvData.personal[field] = value;
  saveData();
  updatePreview();
}

// Step navigation functions
function setCurrentStep(step) {
  currentStep = step;

  // Update step buttons
  document.querySelectorAll(".step-btn").forEach((btn, index) => {
    btn.classList.toggle("active", index === step);
  });

  // Show/hide step content
  document.querySelectorAll(".step-content").forEach((content, index) => {
    content.classList.toggle("hidden", index !== step);
  });

  // Update navigation buttons
  document.getElementById("prevBtn").disabled = step === 0;
  document.getElementById("nextBtn").disabled = step === 3;

  if (step === 3) {
    document.getElementById("nextBtn").textContent = "Complete";
  } else {
    document.getElementById("nextBtn").textContent = "Next";
  }
}

function nextStep() {
  if (currentStep < 3) {
    setCurrentStep(currentStep + 1);
  }
}

function previousStep() {
  if (currentStep > 0) {
    setCurrentStep(currentStep - 1);
  }
}

// View mode functions
function setViewMode(mode) {
  const editMode = document.getElementById("editMode");
  const previewMode = document.getElementById("previewMode");
  const editBtn = document.getElementById("editModeBtn");
  const previewBtn = document.getElementById("previewModeBtn");

  if (mode === "edit") {
    editMode.classList.remove("hidden");
    previewMode.classList.add("hidden");
    editBtn.classList.add("active");
    previewBtn.classList.remove("active");
  } else {
    editMode.classList.add("hidden");
    previewMode.classList.remove("hidden");
    editBtn.classList.remove("active");
    previewBtn.classList.add("active");
    updateFullPreview();
  }
}

// Experience functions
function addExperience() {
  cvData.experience.push({
    company: "",
    position: "",
    duration: "",
    description: "",
  });
  renderExperience();
  saveData();
}

function removeExperience(index) {
  if (cvData.experience.length > 1) {
    cvData.experience.splice(index, 1);
    renderExperience();
    saveData();
    updatePreview();
  }
}

function updateExperience(index, field, value) {
  cvData.experience[index][field] = value;
  saveData();
  updatePreview();
}

function renderExperience() {
  const container = document.getElementById("experienceContainer");
  container.innerHTML = "";

  cvData.experience.forEach((exp, index) => {
    const expDiv = document.createElement("div");
    expDiv.className = "form-section slide-in";
    expDiv.innerHTML = `
                    <div class="section-header">
                        <div class="section-title">
                            <span class="icon">🔄</span>
                            Experience ${index + 1}
                        </div>
                    </div>
                    ${
                      cvData.experience.length > 1
                        ? `<button class="delete-btn" onclick="removeExperience(${index})">🗑️</button>`
                        : ""
                    }
                    <div class="form-row">
                        <div class="form-group">
                            <label>Company Name</label>
                            <input type="text" value="${
                              exp.company
                            }" placeholder="Company Name" 
                                   oninput="updateExperience(${index}, 'company', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Job Title</label>
                            <input type="text" value="${
                              exp.position
                            }" placeholder="Job Title"
                                   oninput="updateExperience(${index}, 'position', this.value)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Duration</label>
                        <input type="text" value="${
                          exp.duration
                        }" placeholder="Jan 2020 - Present"
                               oninput="updateExperience(${index}, 'duration', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea placeholder="Key responsibilities and achievements..." 
                                  oninput="updateExperience(${index}, 'description', this.value)">${
      exp.description
    }</textarea>
                    </div>
                `;
    container.appendChild(expDiv);
  });
}

// Education functions
function addEducation() {
  cvData.education.push({ institution: "", degree: "", year: "", gpa: "" });
  renderEducation();
  saveData();
}

function removeEducation(index) {
  if (cvData.education.length > 1) {
    cvData.education.splice(index, 1);
    renderEducation();
    saveData();
    updatePreview();
  }
}

function updateEducation(index, field, value) {
  cvData.education[index][field] = value;
  saveData();
  updatePreview();
}

function renderEducation() {
  const container = document.getElementById("educationContainer");
  container.innerHTML = "";

  cvData.education.forEach((edu, index) => {
    const eduDiv = document.createElement("div");
    eduDiv.className = "form-section slide-in";
    eduDiv.innerHTML = `
                    <div class="section-header">
                        <div class="section-title">
                            <span class="icon">🔄</span>
                            Education ${index + 1}
                        </div>
                    </div>
                    ${
                      cvData.education.length > 1
                        ? `<button class="delete-btn" onclick="removeEducation(${index})">🗑️</button>`
                        : ""
                    }
                    <div class="form-row">
                        <div class="form-group">
                            <label>Institution</label>
                            <input type="text" value="${
                              edu.institution
                            }" placeholder="University Name" 
                                   oninput="updateEducation(${index}, 'institution', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Degree</label>
                            <input type="text" value="${
                              edu.degree
                            }" placeholder="Degree & Major"
                                   oninput="updateEducation(${index}, 'degree', this.value)">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Year</label>
                            <input type="text" value="${
                              edu.year
                            }" placeholder="Graduation Year"
                                   oninput="updateEducation(${index}, 'year', this.value)">
                        </div>
                        <div class="form-group">
                            <label>GPA (Optional)</label>
                            <input type="text" value="${
                              edu.gpa
                            }" placeholder="3.8"
                                   oninput="updateEducation(${index}, 'gpa', this.value)">
                        </div>
                    </div>
                `;
    container.appendChild(eduDiv);
  });
}

// Skills functions
function addSkill() {
  const skillInput = document.getElementById("skillInput");
  const skill = skillInput.value.trim();

  if (skill && !cvData.skills.includes(skill)) {
    cvData.skills.push(skill);
    skillInput.value = "";
    renderSkills();
    saveData();
    updatePreview();
  }
}

function removeSkill(index) {
  cvData.skills.splice(index, 1);
  renderSkills();
  saveData();
  updatePreview();
}

function renderSkills() {
  const container = document.getElementById("skillsContainer");
  container.innerHTML = "";

  cvData.skills.forEach((skill, index) => {
    const skillTag = document.createElement("div");
    skillTag.className = "skill-tag";
    skillTag.innerHTML = `${skill} <span onclick="removeSkill(${index})" style="margin-left: 5px; cursor: pointer;">×</span>`;
    container.appendChild(skillTag);
  });
}

function handleSkillEnter(event) {
  if (event.key === "Enter") {
    addSkill();
  }
}

// Achievements functions
function addAchievement() {
  const achievementInput = document.getElementById("achievementInput");
  const achievement = achievementInput.value.trim();

  if (achievement) {
    cvData.achievements.push(achievement);
    achievementInput.value = "";
    renderAchievements();
    saveData();
    updatePreview();
  }
}

function removeAchievement(index) {
  cvData.achievements.splice(index, 1);
  renderAchievements();
  saveData();
  updatePreview();
}

function renderAchievements() {
  const container = document.getElementById("achievementsContainer");
  container.innerHTML = "";

  cvData.achievements.forEach((achievement, index) => {
    const achievementDiv = document.createElement("div");
    achievementDiv.className = "achievement-item";
    achievementDiv.innerHTML = `
                    <span>${achievement}</span>
                    <span onclick="removeAchievement(${index})" style="color: #ef4444; cursor: pointer;">×</span>
                `;
    container.appendChild(achievementDiv);
  });
}

function handleAchievementEnter(event) {
  if (event.key === "Enter") {
    addAchievement();
  }
}

// Preview functions
function updatePreview() {
  const preview = generateCVHTML();
  document.getElementById("cvPreview").innerHTML = preview;
}

function updateFullPreview() {
  const preview = generateCVHTML();
  document.getElementById("fullPreview").innerHTML = preview;
}

function generateCVHTML() {
  const { personal, experience, education, skills, achievements } = cvData;

  return `
                <div class="cv-header">
                    <h1 class="cv-name">${personal.fullName || "Your Name"}</h1>
                    <div class="cv-contact">
                        ${
                          personal.email
                            ? `<div class="contact-item"><span class="icon-sm">📧</span> ${personal.email}</div>`
                            : ""
                        }
                        ${
                          personal.phone
                            ? `<div class="contact-item"><span class="icon-sm">📞</span> ${personal.phone}</div>`
                            : ""
                        }
                        ${
                          personal.location
                            ? `<div class="contact-item"><span class="icon-sm">📍</span> ${personal.location}</div>`
                            : ""
                        }
                    </div>
                </div>
                
                <div class="cv-body">
                    ${
                      personal.summary
                        ? `
                        <div class="cv-section">
                            <h2 class="cv-section-title">Professional Summary</h2>
                            <p style="color: #4b5563; line-height: 1.7;">${personal.summary}</p>
                        </div>
                    `
                        : ""
                    }
                    
                    ${
                      experience.some((exp) => exp.company || exp.position)
                        ? `
                        <div class="cv-section">
                            <h2 class="cv-section-title">Professional Experience</h2>
                            ${experience
                              .map((exp) =>
                                exp.company || exp.position
                                  ? `
                                    <div class="experience-item">
                                        <div class="item-header">
                                            <div>
                                                <div class="item-title">${
                                                  exp.position
                                                }</div>
                                                <div class="item-company">${
                                                  exp.company
                                                }</div>
                                            </div>
                                            ${
                                              exp.duration
                                                ? `<div class="item-duration">${exp.duration}</div>`
                                                : ""
                                            }
                                        </div>
                                        ${
                                          exp.description
                                            ? `<div class="item-description">${exp.description}</div>`
                                            : ""
                                        }
                                    </div>
                                `
                                  : ""
                              )
                              .join("")}
                        </div>
                    `
                        : ""
                    }
                    
                    ${
                      education.some((edu) => edu.institution || edu.degree)
                        ? `
                        <div class="cv-section">
                            <h2 class="cv-section-title">Education</h2>
                            ${education
                              .map((edu) =>
                                edu.institution || edu.degree
                                  ? `
                                    <div class="education-item" style="border-left-color: #10b981; background: #f0fdf4;">
                                        <div class="item-header">
                                            <div>
                                                <div class="item-title">${
                                                  edu.degree
                                                }</div>
                                                <div class="item-company" style="color: #10b981;">${
                                                  edu.institution
                                                }</div>
                                            </div>
                                            <div style="text-align: right; font-size: 0.9rem; color: #6b7280;">
                                                ${
                                                  edu.year
                                                    ? `<div>${edu.year}</div>`
                                                    : ""
                                                }
                                                ${
                                                  edu.gpa
                                                    ? `<div>GPA: ${edu.gpa}</div>`
                                                    : ""
                                                }
                                            </div>
                                        </div>
                                    </div>
                                `
                                  : ""
                              )
                              .join("")}
                        </div>
                    `
                        : ""
                    }
                    
                    ${
                      skills.length > 0
                        ? `
                        <div class="cv-section">
                            <h2 class="cv-section-title">Skills</h2>
                            <div class="skills-grid">
                                ${skills
                                  .map(
                                    (skill) =>
                                      `<span class="cv-skill-tag">${skill}</span>`
                                  )
                                  .join("")}
                            </div>
                        </div>
                    `
                        : ""
                    }
                    
                    ${
                      achievements.length > 0
                        ? `
                        <div class="cv-section">
                            <h2 class="cv-section-title">Achievements</h2>
                            <ul class="achievements-list">
                                ${achievements
                                  .map(
                                    (achievement) => `
                                    <li class="achievement-item-cv">
                                        <span class="achievement-icon">🏆</span>
                                        <span>${achievement}</span>
                                    </li>
                                `
                                  )
                                  .join("")}
                            </ul>
                        </div>
                    `
                        : ""
                    }
                </div>
            `;
}

// PDF Download function
function downloadPDF() {
  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  const cvContent = generateCVHTML();

  printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>CV - ${cvData.personal.fullName || "Your CV"}</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                            background: white;
                        }
                        
                        .cv-header {
                            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                            color: white;
                            padding: 40px;
                            border-radius: 10px;
                            margin-bottom: 30px;
                        }
                        
                        .cv-name {
                            font-size: 2.5rem;
                            font-weight: bold;
                            margin-bottom: 15px;
                        }
                        
                        .cv-contact {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 20px;
                            font-size: 0.95rem;
                        }
                        
                        .contact-item {
                            display: flex;
                            align-items: center;
                            gap: 6px;
                        }
                        
                        .cv-section {
                            margin-bottom: 30px;
                        }
                        
                        .cv-section-title {
                            font-size: 1.3rem;
                            font-weight: bold;
                            color: #1f2937;
                            border-bottom: 2px solid #3b82f6;
                            padding-bottom: 8px;
                            margin-bottom: 20px;
                        }
                        
                        .experience-item, .education-item {
                            background: #f8faff;
                            border-left: 4px solid #3b82f6;
                            padding: 20px;
                            margin-bottom: 15px;
                            border-radius: 0 8px 8px 0;
                        }
                        
                        .education-item {
                            border-left-color: #10b981;
                            background: #f0fdf4;
                        }
                        
                        .item-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            margin-bottom: 10px;
                        }
                        
                        .item-title {
                            font-size: 1.1rem;
                            font-weight: 600;
                            color: #1f2937;
                        }
                        
                        .item-company {
                            color: #3b82f6;
                            font-weight: 500;
                        }
                        
                        .education-item .item-company {
                            color: #10b981;
                        }
                        
                        .item-duration {
                            background: #e5e7eb;
                            color: #4b5563;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 0.85rem;
                        }
                        
                        .item-description {
                            color: #4b5563;
                            line-height: 1.6;
                            margin-top: 10px;
                        }
                        
                        .skills-grid {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 8px;
                        }
                        
                        .cv-skill-tag {
                            background: #3b82f6;
                            color: white;
                            padding: 6px 12px;
                            border-radius: 20px;
                            font-size: 0.85rem;
                            font-weight: 500;
                        }
                        
                        .achievements-list {
                            list-style: none;
                        }
                        
                        .achievement-item-cv {
                            display: flex;
                            align-items: flex-start;
                            gap: 10px;
                            margin-bottom: 10px;
                            padding: 10px;
                            background: #fef3c7;
                            border-radius: 6px;
                        }
                        
                        .achievement-icon {
                            color: #f59e0b;
                            margin-top: 2px;
                        }
                        
                        @media print {
                            body { margin: 0; padding: 15px; }
                            .cv-header { margin-bottom: 20px; }
                            .cv-section { margin-bottom: 20px; }
                        }
                    </style>
                </head>
                <body>
                    ${cvContent}
                </body>
                </html>
            `);

  printWindow.document.close();

  // Small delay to ensure content loads before printing
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

// Advanced PDF download using html2canvas + jsPDF (for future enhancement)
async function downloadAdvancedPDF() {
  // This would require importing html2canvas and jsPDF libraries
  // For now, we'll use the simple print method above
  // You can enhance this later with:
  /*
            const element = document.getElementById('cvPreview');
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${cvData.personal.fullName || 'CV'}.pdf`);
            */
}

// Auto-save functionality
setInterval(() => {
  if (document.hasFocus()) {
    saveData();
  }
}, 30000); // Auto-save every 30 seconds

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case "s":
        e.preventDefault();
        saveData();
        showNotification("CV data saved!");
        break;
      case "p":
        e.preventDefault();
        downloadPDF();
        break;
    }
  }

  // Arrow key navigation
  if (e.key === "ArrowLeft" && currentStep > 0) {
    e.preventDefault();
    previousStep();
  } else if (e.key === "ArrowRight" && currentStep < 3) {
    e.preventDefault();
    nextStep();
  }
});

// Notification system
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #10b981, #3b82f6);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
            `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-in forwards";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement("style");
style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
document.head.appendChild(style);

// Export data functionality
function exportData() {
  const dataStr = JSON.stringify(cvData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${cvData.personal.fullName || "cv"}-data.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// Import data functionality
function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const importedData = JSON.parse(e.target.result);
          cvData = importedData;
          populatePersonalInfo();
          renderExperience();
          renderEducation();
          renderSkills();
          renderAchievements();
          updatePreview();
          saveData();
          showNotification("CV data imported successfully!");
        } catch (error) {
          showNotification("Error importing CV data!");
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

// Template switching (basic implementation)
function switchTemplate(templateName) {
  // This is a placeholder for template switching
  // You can implement different CSS classes for different templates
  showNotification(`Switched to ${templateName} template!`);
}

// Validation functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/\s/g, ""));
}

// Real-time validation
document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  emailInput.addEventListener("blur", function () {
    if (this.value && !validateEmail(this.value)) {
      this.style.borderColor = "#ef4444";
      showNotification("Please enter a valid email address");
    } else {
      this.style.borderColor = "";
    }
  });

  phoneInput.addEventListener("blur", function () {
    if (this.value && !validatePhone(this.value)) {
      this.style.borderColor = "#ef4444";
      showNotification("Please enter a valid phone number");
    } else {
      this.style.borderColor = "";
    }
  });
});
