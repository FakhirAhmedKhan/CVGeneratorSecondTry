document.addEventListener("DOMContentLoaded", () => {
  // --- STATE MANAGEMENT ---
  let currentStep = 0;
  let viewMode = "edit"; // 'edit' or 'preview'

  // The central data store for the CV
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

  const steps = [
    { title: "Personal Info", icon: "user" },
    { title: "Experience", icon: "briefcase" },
    { title: "Education", icon: "graduation-cap" },
    { title: "Skills & Awards", icon: "award" },
  ];

  // --- DOM ELEMENT REFERENCES ---
  const mainContent = document.getElementById("mainContent");
  const fullPreviewContent = document.getElementById("fullPreviewContent");
  const editModeBtn = document.getElementById("editModeBtn");
  const previewModeBtn = document.getElementById("previewModeBtn");

  // --- RENDER FUNCTIONS ---

  /**
   * The main render function. It decides what to show based on the current viewMode.
   */
  const renderApp = () => {
    if (viewMode === "edit") {
      mainContent.innerHTML = renderEditView();
      fullPreviewContent.innerHTML = "";
      mainContent.classList.remove("hidden");
      fullPreviewContent.classList.add("hidden");
      renderStepContent();
      renderPreview();
      addEditViewEventListeners();
    } else {
      // preview mode
      fullPreviewContent.innerHTML = renderFullPreviewView();
      mainContent.innerHTML = "";
      mainContent.classList.add("hidden");
      fullPreviewContent.classList.remove("hidden");
      addFullPreviewEventListeners();
    }
    // Activate lucide icons
    lucide.createIcons();
  };

  /**
   * Renders the HTML structure for the edit view (form + live preview).
   */
  const renderEditView = () => {
    return `
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Form Side -->
                        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                            <!-- Step Navigation -->
                            <div class="flex justify-around mb-8">
                                ${steps
                                  .map(
                                    (step, index) => `
                                    <button data-step="${index}" class="step-nav-btn flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-300 ${
                                      currentStep === index
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-white/10"
                                    }">
                                        <i data-lucide="${
                                          step.icon
                                        }" class="w-5 h-5"></i>
                                        <span class="text-xs hidden sm:block">${
                                          step.title
                                        }</span>
                                    </button>
                                `
                                  )
                                  .join("")}
                            </div>

                            <!-- Step Content Area -->
                            <div id="stepContent" class="mb-8 min-h-[350px]"></div>

                            <!-- Navigation Buttons -->
                            <div class="flex justify-between">
                                <button id="prevBtn" class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                                <button id="nextBtn" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                            </div>
                        </div>

                        <!-- Preview Side -->
                        <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-xl font-semibold text-white">Live Preview</h2>
                                <button id="downloadPdfBtn" class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300">
                                    <i data-lucide="download" class="w-4 h-4"></i> Download PDF
                                </button>
                            </div>
                            <div id="previewContainer" class="max-h-[800px] overflow-y-auto custom-scrollbar"></div>
                        </div>
                    </div>
                `;
  };

  /**
   * Renders the content for the current step in the form.
   */
  const renderStepContent = () => {
    const stepContentContainer = document.getElementById("stepContent");
    if (!stepContentContainer) return;

    let content = "";
    switch (currentStep) {
      case 0: // Personal Info
        content = `
                            <div class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                        <input type="text" data-field="fullName" data-section="personal" value="${cvData.personal.fullName}" class="cv-input w-full" placeholder="John Doe">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                        <input type="email" data-field="email" data-section="personal" value="${cvData.personal.email}" class="cv-input w-full" placeholder="john@example.com">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                                        <input type="tel" data-field="phone" data-section="personal" value="${cvData.personal.phone}" class="cv-input w-full" placeholder="+1 (555) 123-4567">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                        <input type="text" data-field="location" data-section="personal" value="${cvData.personal.location}" class="cv-input w-full" placeholder="New York, NY">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">Professional Summary</label>
                                    <textarea data-field="summary" data-section="personal" rows="4" class="cv-input w-full resize-none" placeholder="Brief professional summary...">${cvData.personal.summary}</textarea>
                                </div>
                            </div>
                        `;
        break;
      case 1: // Experience
        content = `
                            <div class="space-y-6">
                                ${cvData.experience
                                  .map(
                                    (exp, index) => `
                                    <div class="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                                        <div class="flex justify-between items-center mb-4">
                                            <h3 class="text-lg font-semibold text-white">Experience ${
                                              index + 1
                                            }</h3>
                                            <button class="remove-experience-btn text-red-400 hover:text-red-300" data-index="${index}">Remove</button>
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <input type="text" data-index="${index}" data-field="company" data-section="experience" value="${
                                      exp.company
                                    }" class="cv-input" placeholder="Company Name">
                                            <input type="text" data-index="${index}" data-field="position" data-section="experience" value="${
                                      exp.position
                                    }" class="cv-input" placeholder="Job Title">
                                        </div>
                                        <input type="text" data-index="${index}" data-field="duration" data-section="experience" value="${
                                      exp.duration
                                    }" class="cv-input w-full mb-4" placeholder="Jan 2020 - Present">
                                        <textarea data-index="${index}" data-field="description" data-section="experience" rows="3" class="cv-input w-full resize-none" placeholder="Key responsibilities...">${
                                      exp.description
                                    }</textarea>
                                    </div>
                                `
                                  )
                                  .join("")}
                                <button id="addExperienceBtn" class="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium">+ Add Experience</button>
                            </div>
                        `;
        break;
      case 2: // Education
        content = `
                            <div class="space-y-6">
                                ${cvData.education
                                  .map(
                                    (edu, index) => `
                                    <div class="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                                        <div class="flex justify-between items-center mb-4">
                                            <h3 class="text-lg font-semibold text-white">Education ${
                                              index + 1
                                            }</h3>
                                            <button class="remove-education-btn text-red-400 hover:text-red-300" data-index="${index}">Remove</button>
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input type="text" data-index="${index}" data-field="institution" data-section="education" value="${
                                      edu.institution
                                    }" class="cv-input" placeholder="University Name">
                                            <input type="text" data-index="${index}" data-field="degree" data-section="education" value="${
                                      edu.degree
                                    }" class="cv-input" placeholder="Degree & Major">
                                            <input type="text" data-index="${index}" data-field="year" data-section="education" value="${
                                      edu.year
                                    }" class="cv-input" placeholder="Graduation Year">
                                            <input type="text" data-index="${index}" data-field="gpa" data-section="education" value="${
                                      edu.gpa
                                    }" class="cv-input" placeholder="GPA (optional)">
                                        </div>
                                    </div>
                                `
                                  )
                                  .join("")}
                                <button id="addEducationBtn" class="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium">+ Add Education</button>
                            </div>
                        `;
        break;
      case 3: // Skills & Awards
        content = `
                            <div class="space-y-8">
                                <div>
                                    <h3 class="text-xl font-semibold text-white mb-4">Skills</h3>
                                    <div class="flex gap-2 mb-4">
                                        <input type="text" id="newSkillInput" class="cv-input flex-1" placeholder="Add a skill...">
                                        <button id="addSkillBtn" class="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300">Add</button>
                                    </div>
                                    <div id="skillsContainer" class="flex flex-wrap gap-2">
                                        ${cvData.skills
                                          .map(
                                            (skill, index) => `
                                            <span class="skill-tag px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 text-blue-100 rounded-full text-sm cursor-pointer hover:bg-red-500/20 transition-all duration-300" data-index="${index}">${skill} ×</span>
                                        `
                                          )
                                          .join("")}
                                    </div>
                                </div>
                                <div>
                                    <h3 class="text-xl font-semibold text-white mb-4">Achievements</h3>
                                    <div class="flex gap-2 mb-4">
                                        <input type="text" id="newAchievementInput" class="cv-input flex-1" placeholder="Add an achievement...">
                                        <button id="addAchievementBtn" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300">Add</button>
                                    </div>
                                    <div id="achievementsContainer" class="space-y-2">
                                        ${cvData.achievements
                                          .map(
                                            (ach, index) => `
                                            <div class="achievement-item p-3 bg-white/5 border border-white/10 rounded-lg text-gray-200 cursor-pointer hover:bg-red-500/10 transition-all duration-300" data-index="${index}">
                                                ${ach} <span class="text-red-400 float-right">×</span>
                                            </div>
                                        `
                                          )
                                          .join("")}
                                    </div>
                                </div>
                            </div>
                        `;
        break;
    }
    stepContentContainer.innerHTML = content;
    // Add common class to all inputs for easier event handling
    stepContentContainer.querySelectorAll("input, textarea").forEach((el) => {
      el.classList.add(
        "px-4",
        "py-3",
        "bg-white/10",
        "border",
        "border-white/20",
        "rounded-lg",
        "text-white",
        "placeholder-gray-400",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-blue-500",
        "backdrop-blur-sm"
      );
    });
  };

  /**
   * Renders the CV preview based on the current cvData.
   */
  const renderPreview = () => {
    const previewContainer = document.getElementById("previewContainer");
    if (!previewContainer) return;

    const { personal, experience, education, skills, achievements } = cvData;

    // Helper to check if any object in an array has at least one truthy value
    const hasContent = (arr) =>
      arr.some((item) => Object.values(item).some((val) => !!val));

    previewContainer.innerHTML = `
                    <div id="cvPreviewContent" class="bg-white text-gray-900 rounded-xl overflow-hidden shadow-2xl">
                        <!-- Header -->
                        <div class="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8">
                            <h1 class="text-3xl font-bold mb-2">${
                              personal.fullName || "Your Name"
                            }</h1>
                            <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                ${
                                  personal.email
                                    ? `<div class="flex items-center gap-1"><i data-lucide="mail" class="w-4 h-4"></i><span>${personal.email}</span></div>`
                                    : ""
                                }
                                ${
                                  personal.phone
                                    ? `<div class="flex items-center gap-1"><i data-lucide="phone" class="w-4 h-4"></i><span>${personal.phone}</span></div>`
                                    : ""
                                }
                                ${
                                  personal.location
                                    ? `<div class="flex items-center gap-1"><i data-lucide="map-pin" class="w-4 h-4"></i><span>${personal.location}</span></div>`
                                    : ""
                                }
                            </div>
                        </div>

                        <div class="p-8">
                            <!-- Summary -->
                            ${
                              personal.summary
                                ? `
                                <div class="mb-6">
                                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">Professional Summary</h2>
                                    <p class="text-gray-700 leading-relaxed">${personal.summary.replace(
                                      /\n/g,
                                      "<br>"
                                    )}</p>
                                </div>
                            `
                                : ""
                            }

                            <!-- Experience -->
                            ${
                              hasContent(experience)
                                ? `
                                <div class="mb-6">
                                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">Professional Experience</h2>
                                    ${experience
                                      .map((exp) =>
                                        exp.company || exp.position
                                          ? `
                                        <div class="mb-4 p-4 border-l-4 border-blue-600 bg-blue-50 rounded-r-lg">
                                            <div class="flex justify-between items-start mb-1">
                                                <div>
                                                    <h3 class="font-semibold text-lg text-gray-800">${
                                                      exp.position
                                                    }</h3>
                                                    <p class="text-blue-600 font-medium">${
                                                      exp.company
                                                    }</p>
                                                </div>
                                                <span class="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded flex-shrink-0 ml-2">${
                                                  exp.duration
                                                }</span>
                                            </div>
                                            ${
                                              exp.description
                                                ? `<p class="text-gray-700 mt-2 text-sm">${exp.description.replace(
                                                    /\n/g,
                                                    "<br>"
                                                  )}</p>`
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

                            <!-- Education -->
                            ${
                              hasContent(education)
                                ? `
                                <div class="mb-6">
                                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">Education</h2>
                                    ${education
                                      .map((edu) =>
                                        edu.institution || edu.degree
                                          ? `
                                        <div class="mb-4 p-4 border-l-4 border-green-600 bg-green-50 rounded-r-lg">
                                            <div class="flex justify-between items-start">
                                                <div>
                                                    <h3 class="font-semibold text-lg text-gray-800">${
                                                      edu.degree
                                                    }</h3>
                                                    <p class="text-green-600 font-medium">${
                                                      edu.institution
                                                    }</p>
                                                </div>
                                                <div class="text-right text-sm text-gray-600 flex-shrink-0 ml-2">
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

                            <!-- Skills & Achievements Grid -->
                            ${
                              skills.length > 0 || achievements.length > 0
                                ? `
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <!-- Skills -->
                                ${
                                  skills.length > 0
                                    ? `
                                    <div class="mb-6">
                                        <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">Skills</h2>
                                        <div class="flex flex-wrap gap-2">
                                            ${skills
                                              .map(
                                                (skill) =>
                                                  `<span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">${skill}</span>`
                                              )
                                              .join("")}
                                        </div>
                                    </div>
                                `
                                    : ""
                                }

                                <!-- Achievements -->
                                ${
                                  achievements.length > 0
                                    ? `
                                    <div>
                                        <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">Achievements</h2>
                                        <ul class="space-y-2">
                                            ${achievements
                                              .map(
                                                (ach) => `
                                                <li class="flex items-start gap-2">
                                                    <i data-lucide="award" class="text-yellow-600 mt-1 flex-shrink-0 w-4 h-4"></i>
                                                    <span class="text-gray-700">${ach}</span>
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
                            `
                                : ""
                            }
                        </div>
                    </div>
                `;
    lucide.createIcons();
  };

  /**
   * Renders the full-page preview view.
   */
  const renderFullPreviewView = () => {
    return `
                    <div class="max-w-4xl mx-auto">
                        <div class="flex justify-center mb-6">
                            <button id="downloadPdfBtnFull" class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 text-lg">
                                <i data-lucide="download" class="w-5 h-5"></i>
                                Download CV as PDF
                            </button>
                        </div>
                        <div id="previewContainer"></div>
                    </div>
                `;
  };

  // --- EVENT LISTENER SETUP ---

  /**
   * Adds all necessary event listeners for the edit view.
   */
  const addEditViewEventListeners = () => {
    // Step navigation
    document.querySelectorAll(".step-nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        currentStep = parseInt(e.currentTarget.dataset.step);
        renderApp();
      });
    });

    // Prev/Next buttons
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    if (prevBtn) {
      prevBtn.disabled = currentStep === 0;
      prevBtn.addEventListener("click", () => {
        if (currentStep > 0) {
          currentStep--;
          renderApp();
        }
      });
    }
    if (nextBtn) {
      nextBtn.disabled = currentStep === steps.length - 1;
      nextBtn.addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
          currentStep++;
          renderApp();
        }
      });
    }

    // Form input changes
    document
      .getElementById("stepContent")
      .addEventListener("input", handleFormInput);

    // Add/Remove buttons for dynamic sections
    if (currentStep === 1) {
      // Experience
      document
        .getElementById("addExperienceBtn")
        .addEventListener("click", addExperience);
      document
        .querySelectorAll(".remove-experience-btn")
        .forEach((btn) =>
          btn.addEventListener("click", (e) =>
            removeExperience(e.currentTarget.dataset.index)
          )
        );
    }
    if (currentStep === 2) {
      // Education
      document
        .getElementById("addEducationBtn")
        .addEventListener("click", addEducation);
      document
        .querySelectorAll(".remove-education-btn")
        .forEach((btn) =>
          btn.addEventListener("click", (e) =>
            removeEducation(e.currentTarget.dataset.index)
          )
        );
    }
    if (currentStep === 3) {
      // Skills & Awards
      document
        .getElementById("addSkillBtn")
        .addEventListener("click", addSkill);
      document
        .getElementById("newSkillInput")
        .addEventListener("keypress", (e) => {
          if (e.key === "Enter") addSkill();
        });
      document
        .querySelectorAll(".skill-tag")
        .forEach((tag) =>
          tag.addEventListener("click", (e) =>
            removeSkill(e.currentTarget.dataset.index)
          )
        );

      document
        .getElementById("addAchievementBtn")
        .addEventListener("click", addAchievement);
      document
        .getElementById("newAchievementInput")
        .addEventListener("keypress", (e) => {
          if (e.key === "Enter") addAchievement();
        });
      document
        .querySelectorAll(".achievement-item")
        .forEach((item) =>
          item.addEventListener("click", (e) =>
            removeAchievement(e.currentTarget.dataset.index)
          )
        );
    }

    // Download button
    document
      .getElementById("downloadPdfBtn")
      .addEventListener("click", downloadPDF);
  };

  /**
   * Adds event listeners for the full preview view.
   */
  const addFullPreviewEventListeners = () => {
    renderPreview(); // Render the preview content into the container
    document
      .getElementById("downloadPdfBtnFull")
      .addEventListener("click", downloadPDF);
  };

  // --- DATA HANDLING FUNCTIONS ---

  const handleFormInput = (e) => {
    const { section, field, index } = e.target.dataset;
    const value = e.target.value;

    if (section === "personal") {
      cvData.personal[field] = value;
    } else if (section === "experience" || section === "education") {
      cvData[section][index][field] = value;
    }

    renderPreview();
  };

  const addExperience = () => {
    cvData.experience.push({
      company: "",
      position: "",
      duration: "",
      description: "",
    });
    renderStepContent();
    addEditViewEventListeners(); // Re-add listeners to new elements
  };

  const removeExperience = (index) => {
    cvData.experience.splice(index, 1);
    renderStepContent();
    renderPreview();
    addEditViewEventListeners();
  };

  const addEducation = () => {
    cvData.education.push({ institution: "", degree: "", year: "", gpa: "" });
    renderStepContent();
    addEditViewEventListeners();
  };

  const removeEducation = (index) => {
    cvData.education.splice(index, 1);
    renderStepContent();
    renderPreview();
    addEditViewEventListeners();
  };

  const addSkill = () => {
    const input = document.getElementById("newSkillInput");
    if (input && input.value.trim()) {
      cvData.skills.push(input.value.trim());
      input.value = "";
      renderStepContent();
      renderPreview();
      addEditViewEventListeners();
    }
  };

  const removeSkill = (index) => {
    cvData.skills.splice(index, 1);
    renderStepContent();
    renderPreview();
    addEditViewEventListeners();
  };

  const addAchievement = () => {
    const input = document.getElementById("newAchievementInput");
    if (input && input.value.trim()) {
      cvData.achievements.push(input.value.trim());
      input.value = "";
      renderStepContent();
      renderPreview();
      addEditViewEventListeners();
    }
  };

  const removeAchievement = (index) => {
    cvData.achievements.splice(index, 1);
    renderStepContent();
    renderPreview();
    addEditViewEventListeners();
  };

  // --- MODE & PDF FUNCTIONS ---

  const setViewMode = (mode) => {
    viewMode = mode;
    if (mode === "edit") {
      editModeBtn.classList.add("bg-blue-500", "text-white");
      editModeBtn.classList.remove("text-gray-300", "hover:text-white");
      previewModeBtn.classList.remove("bg-blue-500", "text-white");
      previewModeBtn.classList.add("text-gray-300", "hover:text-white");
    } else {
      previewModeBtn.classList.add("bg-blue-500", "text-white");
      previewModeBtn.classList.remove("text-gray-300", "hover:text-white");
      editModeBtn.classList.remove("bg-blue-500", "text-white");
      editModeBtn.classList.add("text-gray-300", "hover:text-white");
    }
    renderApp();
  };

  const downloadPDF = () => {
    const cvContentEl = document.getElementById("cvPreviewContent");
    if (!cvContentEl) {
      console.error("Preview content not found!");
      return;
    }
    const cvContent = cvContentEl.innerHTML;
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
                    <html>
                        <head>
                            <title>CV - ${
                              cvData.personal.fullName || "Preview"
                            }</title>
                            <script src="https://cdn.tailwindcss.com"><\/script>
                            <script src="https://unpkg.com/lucide@latest"><\/script>
                            <style>
                                body { 
                                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                                    margin: 0; 
                                    padding: 0;
                                    -webkit-print-color-adjust: exact !important;
                                    print-color-adjust: exact !important;
                                }
                                .cv-preview { max-width: 800px; margin: 0 auto; }
                            </style>
                        </head>
                        <body class="bg-white">
                            <div class="cv-preview">${cvContent}</div>
                            <script>
                                // We need to run createIcons in the new window as well
                                lucide.createIcons();
                                // Use a timeout to ensure all content/styles are loaded before printing
                                setTimeout(() => {
                                    window.print();
                                    window.close();
                                }, 500);
                            <\/script>
                        </body>
                    </html>
                `);
    printWindow.document.close();
  };

  // --- INITIALIZATION ---
  editModeBtn.addEventListener("click", () => setViewMode("edit"));
  previewModeBtn.addEventListener("click", () => setViewMode("preview"));

  // Initial render on page load
  renderApp();
});
