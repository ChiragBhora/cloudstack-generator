const steps = document.querySelectorAll(".step");
const nextBtns = document.querySelectorAll(".nextBtn");
const prevBtns = document.querySelectorAll(".prevBtn");
const progressBar = document.getElementById("progressBar");

let currentStep = 0;

// ------------------------
// Step Navigation
// ------------------------
function updateForm() {
    steps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
    });

    const progress = ((currentStep + 1) / steps.length) * 100;
    progressBar.style.width = progress + "%";
}

nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateForm();
        }
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            updateForm();
        }
    });
});

updateForm();

// ------------------------
// Dynamic Fields
// ------------------------
const deploymentType = document.getElementById("deploymentType");
const dynamicFields = document.getElementById("dynamicFields");

deploymentType.addEventListener("change", () => {

    if (deploymentType.value === "application") {

        dynamicFields.innerHTML = `
            <label>Frontend Type</label>
            <select id="frontend">
                <option>React</option>
                <option>Angular</option>
                <option>Vue</option>
                <option>HTML/CSS/JS</option>
            </select>

            <label>Backend Type</label>
            <select id="backend">
                <option>NodeJS</option>
                <option>Python</option>
                <option>Java</option>
                <option>.NET</option>
            </select>

            <label>Deployment Target</label>
            <select id="target">
                <option>Azure App Service</option>
                <option>Azure VM</option>
            </select>
        `;
    }

    else if (deploymentType.value === "infrastructure") {

        dynamicFields.innerHTML = `
            <label>IaC Tool</label>
            <select>
                <option>Terraform</option>
            </select>

            <label>Cloud Provider</label>
            <select>
                <option>Azure</option>
            </select>

            <label>Resources</label>

            <div class="checkbox-group">

                <label>
                    <input type="checkbox" id="vmCheck">
                    Virtual Machine
                </label>

            </div>

            <div id="resourceConfig"></div>
        `;
    }
});

// ------------------------
// VM Configuration
// ------------------------
document.addEventListener("change", (event) => {

    if (event.target.id !== "vmCheck") {
        return;
    }

    const configDiv = document.getElementById("resourceConfig");

    if (!configDiv) return;

    if (event.target.checked) {

        configDiv.innerHTML = `
            <h3>Virtual Machine</h3>

            <label>VM Name</label>
            <input type="text" id="vmName">

            <label>VM Size</label>
            <select id="vmSize">
                <option>Standard_B1s</option>
                <option>Standard_B2s</option>
                <option>Standard_D2s_v3</option>
            </select>

            <label>Admin Username</label>
            <input type="text" id="adminUser">
        `;
    }
    else {
        configDiv.innerHTML = "";
    }
});

// ------------------------
// Generate Output
// ------------------------
document.getElementById("multiStepForm")
.addEventListener("submit", (e) => {

    e.preventDefault();

    const output = document.getElementById("terraformOutput");
    const outputTitle = document.getElementById("outputTitle");

    // APPLICATION DEPLOYMENT
    if (deploymentType.value === "application") {

        const frontend =
            document.getElementById("frontend")?.value || "";

        const backend =
            document.getElementById("backend")?.value || "";

        const target =
            document.getElementById("target")?.value || "";

        outputTitle.textContent =
            "Generated Azure DevOps YAML";

        const yamlCode = `
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:

- task: NodeTool@0
  inputs:
    versionSpec: '18.x'

- script: npm install
  displayName: Install Dependencies

- script: npm run build
  displayName: Build Application

- script: echo "Frontend = ${frontend}"
  displayName: Frontend

- script: echo "Backend = ${backend}"
  displayName: Backend

- script: echo "Deploying to ${target}"
  displayName: Deployment Target
`;

        output.value = yamlCode;
    }

    // INFRASTRUCTURE DEPLOYMENT
    else if (deploymentType.value === "infrastructure") {

        const data = {
            projectName:
                document.getElementById("projectName")?.value || "",

            vmName:
                document.getElementById("vmName")?.value || "",

            vmSize:
                document.getElementById("vmSize")?.value || "",

            adminUser:
                document.getElementById("adminUser")?.value || ""
        };

        outputTitle.textContent =
            "Generated Terraform";

        const terraformCode = `
resource "azurerm_resource_group" "rg" {
  name     = "${data.projectName}-rg"
  location = "Central India"
}

resource "azurerm_linux_virtual_machine" "vm" {
  name           = "${data.vmName}"
  size           = "${data.vmSize}"
  admin_username = "${data.adminUser}"
}
`;

        output.value = terraformCode;
    }
});