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
        step.classList.toggle(
            "active",
            index === currentStep
        );
    });

    const progress =
        ((currentStep + 1) / steps.length) * 100;

    progressBar.style.width =
        progress + "%";
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

const deploymentType =
    document.getElementById("deploymentType");

const dynamicFields =
    document.getElementById("dynamicFields");

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

            <label>Azure Service Connection</label>
            <input
                type="text"
                id="serviceConnection"
                placeholder="My-ServiceConnection">

            <label>App Service Name</label>
            <input
                type="text"
                id="appName"
                placeholder="my-web-app">

            <label>Resource Group Name</label>
            <input
                type="text"
                id="resourceGroup"
                placeholder="rg-dev">

            <label>Environment</label>
            <select id="environment">
                <option>Dev</option>
                <option>QA</option>
                <option>Prod</option>
            </select>
            <label>Agent OS</label>
<select id="agentOS">
    <option>ubuntu-latest</option>
    <option>windows-latest</option>
    <option>macos-latest</option>
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

            <label>Azure Region</label>

            <select id="azureLocation">
                <option>Central India</option>
                <option>South India</option>
                <option>West India</option>
                <option>East US</option>
                <option>East US 2</option>
                <option>West US</option>
                <option>North Europe</option>
                <option>West Europe</option>
                <option>UK South</option>
                <option>Southeast Asia</option>
                <option>Australia East</option>
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

                <label>
                    <input type="checkbox" id="vnetCheck">
                    Virtual Network
                </label>

            </div>

            <div id="resourceConfig"></div>
        `;
    }
});

// ------------------------
// Resource Configuration
// ------------------------

document.addEventListener("change", (event) => {

    if (
        event.target.id !== "rgCheck" &&
        event.target.id !== "vmCheck" &&
        event.target.id !== "storageCheck" &&
        event.target.id !== "vnetCheck"
    ) {
        return;
    }

    const configDiv =
        document.getElementById("resourceConfig");

    if (!configDiv) return;

    if (
        event.target.id === "vmCheck" &&
        event.target.checked
    ) {

        document.getElementById("rgCheck").checked = true;
        document.getElementById("vnetCheck").checked = true;
    }

    let html = "";

    if (
        document.getElementById("rgCheck")?.checked
    ) {

        html += `
            <h3>Resource Group</h3>

            <label>Resource Group Name</label>

            <input
                type="text"
                id="rgName"
                placeholder="demo-rg">
        `;
    }

    if (
        document.getElementById("vmCheck")?.checked
    ) {

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

            <label>Subnet Name</label>
            <input type="text" id="subnetName">

            <label>Public IP Name</label>
            <input type="text" id="publicIpName">

            <label>Network Interface Name</label>
            <input type="text" id="nicName">

            <label>Admin Password</label>
            <input type="password" id="adminPassword">
        `;
    }

    if (
        document.getElementById("storageCheck")?.checked
    ) {

        html += `
            <h3>Storage Account</h3>

            <label>Storage Name</label>
            <input type="text" id="storageName">
        `;
    }

    if (
        document.getElementById("vnetCheck")?.checked
    ) {

        html += `
            <h3>Virtual Network</h3>

            <label>VNet Name</label>
            <input type="text" id="vnetName">
        `;
    }

    configDiv.innerHTML = html;
});

// ------------------------
// Generate Output
// ------------------------

document.getElementById("multiStepForm")
.addEventListener("submit", (e) => {

    e.preventDefault();

    const output =
        document.getElementById("terraformOutput");

    const outputTitle =
        document.getElementById("outputTitle");

    if (!validateProject()) {
        return;
    }

    if (deploymentType.value === "application") {

        const frontend =
            document.getElementById("frontend")?.value || "";

        const backend =
            document.getElementById("backend")?.value || "";

        const target =
            document.getElementById("target")?.value || "";

        const serviceConnection =
            document.getElementById("serviceConnection")?.value || "";

        const appName =
            document.getElementById("appName")?.value || "";

        if (
            !validateApplication(
                serviceConnection,
                appName
            )
        ) {
            return;
        }

        const resourceGroup =
            document.getElementById("resourceGroup")?.value || "";

        const environment =
            document.getElementById("environment")?.value || "Dev";
        const agentOS =
            document.getElementById("agentOS")?.value || "ubuntu-latest";

        outputTitle.textContent =
            "Generated Azure DevOps YAML";

        output.value = generateDynamicYAML(
            frontend,
            backend,
            target,
            serviceConnection,
            appName,
            resourceGroup,
            environment,
            agentOS
        );
    }

    else if (deploymentType.value === "infrastructure") {

        if (!validateInfrastructure()) {
            return;
        }

        outputTitle.textContent =
            "Generated Terraform";

        output.value =
            generateTerraform();
    }
});