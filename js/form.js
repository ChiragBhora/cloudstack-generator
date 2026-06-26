// ============================================
// CloudStack Generator - Form Controller
// ============================================
// NOTE: This file intentionally uses global functions (helpers.js/validator.js/etc)
// to remain compatible with index.html script loading order.

const steps = document.querySelectorAll(".step");
const nextBtns = document.querySelectorAll(".nextBtn");
const prevBtns = document.querySelectorAll(".prevBtn");
const progressBar = document.getElementById("progressBar");

let currentStep = 0;

function updateForm() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  const progress = ((currentStep + 1) / steps.length) * 100;
  if (progressBar) progressBar.style.width = progress + "%";
}

nextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateForm();
    }
  });
});

prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateForm();
    }
  });
});

updateForm();

// ------------------------
// Generate Output
// ------------------------

document.getElementById("multiStepForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // These are used by validators & generators.
  const repoType = getValue("repoType");
  const repoName = getValue("repoName");
  const repoUrl = getValue("repoUrl");

  if (!validateProject()) return;

  if (deploymentType.value === "application") {
    const frontend = getValue("frontend");
    const backend = getValue("backend");
    const target = getValue("target");
    const serviceConnection = getValue("serviceConnection");
    const appName = getValue("appName");
    const deploymentSlot = getValue("deploymentSlot", "production");
    const resourceGroup = getValue("resourceGroup");
    const environment = getValue("environment", "Dev");
    const agentOS = getValue("agentOS", "ubuntu-latest");
    const nodeVersion = getValue("nodeVersion", "18.x");
    const pythonVersion = getValue("pythonVersion", "3.11");
    const javaVersion = getValue("javaVersion", "17");
    const dotnetVersion = getValue("dotnetVersion", "8.0");
    const buildConfiguration = getValue("buildConfiguration", "Release");
    const variableGroup = getValue("variableGroup");
    const dockerEnabled = getValue("dockerEnabled", "No");
    const dockerImageName = getValue("dockerImageName");
    const acrName = getValue("acrName");

    if (!validateApplication(serviceConnection, appName)) return;

    setTitle("Generated Azure DevOps YAML");
    setOutput(
      generateDynamicYAML(
        frontend,
        backend,
        target,
        serviceConnection,
        appName,
        deploymentSlot,
        resourceGroup,
        environment,
        agentOS,
        nodeVersion,
        pythonVersion,
        javaVersion,
        dotnetVersion,
        buildConfiguration,
        variableGroup,
        dockerEnabled,
        dockerImageName,
        acrName,
        repoType,
        repoName,
        repoUrl
      )
    );
  } else if (deploymentType.value === "infrastructure") {
    if (!validateInfrastructure()) return;

    setTitle("Generated Terraform");
    setOutput(generateTerraform());
  }
});

