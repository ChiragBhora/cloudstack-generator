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

document
.getElementById("multiStepForm")
.addEventListener("submit", e => {

    e.preventDefault();

    const data = {
        projectName: document.getElementById("projectName")?.value || "",
        repoName: document.getElementById("repoName")?.value || "",
        deploymentType: document.getElementById("deploymentType")?.value || "",
        vmName: document.getElementById("vmName")?.value || "",
        vmSize: document.getElementById("vmSize")?.value || "",
        adminUser: document.getElementById("adminUser")?.value || ""
    };

    const terraformCode = generateTerraform(data);

document.getElementById("terraformOutput").value =
terraformCode;
});

updateForm();

const deploymentType = document.getElementById("deploymentType");
const dynamicFields = document.getElementById("dynamicFields");

deploymentType.addEventListener("change", () => {

    const value = deploymentType.value;

    if (value === "application") {

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

    else if (value === "infrastructure") {

        dynamicFields.innerHTML = `
            <label>IaC Tool</label>
            <select id="iac">
                <option>Terraform</option>
            </select>

            <label>Cloud Provider</label>
            <select id="cloud">
                <option>Azure</option>
            </select>

            <label>Resources</label>

            <div class="checkbox-group">

                <label>
                    <input type="checkbox" id="rgCheck">
                    Resource Group
                </label>

                <label>
                    <input type="checkbox" id="vmCheck">
                    Virtual Machine
                </label>

                <label>
                    <input type="checkbox" id="storageCheck">
                    Storage Account
                </label>

            </div>

            <div id="resourceConfig"></div>
        `;
    }
});

document.addEventListener("change", (event) => {

    if (
        event.target.id !== "rgCheck" &&
        event.target.id !== "vmCheck" &&
        event.target.id !== "storageCheck"
    ) {
        return;
    }

    const configDiv = document.getElementById("resourceConfig");

    if (!configDiv) return;

    let html = "";

    const rgCheck = document.getElementById("rgCheck");
    const vmCheck = document.getElementById("vmCheck");
    const storageCheck = document.getElementById("storageCheck");

    if (rgCheck && rgCheck.checked) {

        html += `
            <h3>Resource Group</h3>

            <label>Resource Group Name</label>
            <input type="text" id="rgName">

            <label>Location</label>
            <select id="location">
                <option>Central India</option>
                <option>East US</option>
                <option>West Europe</option>
            </select>
        `;
    }

    if (vmCheck && vmCheck.checked) {

        html += `
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

    if (storageCheck && storageCheck.checked) {

        html += `
            <h3>Storage Account</h3>

            <label>Storage Name</label>
            <input type="text" id="storageName">

            <label>Replication</label>
            <select id="replication">
                <option>LRS</option>
                <option>GRS</option>
                <option>ZRS</option>
            </select>
        `;
    }

    configDiv.innerHTML = html;
});
function generateTerraform(data) {

    return `
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
}
