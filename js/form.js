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
// VM Configuration
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

    const configDiv = document.getElementById("resourceConfig");

    if (!configDiv) return;

    let html = "";

    if (document.getElementById("rgCheck")?.checked) {

        html += `
            <h3>Resource Group</h3>

            <label>Resource Group Name</label>
<input
    type="text"
    id="rgName"
    placeholder="my-resource-group">
        `;
    }

    if (document.getElementById("vmCheck")?.checked) {

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
<input
    type="text"
    id="adminUser"
    placeholder="azureuser">
    <label>Subnet Name</label>
<input type="text" id="subnetName">

<label>Public IP Name</label>
<input type="text" id="publicIpName">

<label>Network Interface Name</label>
<input type="text" id="nicName">
        `;
    }


    if (document.getElementById("storageCheck")?.checked) {

        html += `
            <h3>Storage Account</h3>

            <label>Storage Name</label>
            <input type="text" id="storageName">
        `;
    }

    if (document.getElementById("vnetCheck")?.checked) {

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

    const output = document.getElementById("terraformOutput");
    const outputTitle = document.getElementById("outputTitle");

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

        const resourceGroup =
            document.getElementById("resourceGroup")?.value || "";

        outputTitle.textContent =
            "Generated Azure DevOps YAML";

        const yamlCode = generateDynamicYAML(
            frontend,
            backend,
            target,
            serviceConnection,
            appName,
            resourceGroup
        );

        output.value = yamlCode;
    }

    else if (deploymentType.value === "infrastructure") {

    outputTitle.textContent =
        "Generated Terraform";

    output.value = generateTerraform();
}

});
function generateDynamicYAML(
    frontend,
    backend,
    target,
    serviceConnection,
    appName,
    resourceGroup
) {

    let buildSteps = "";

    // Backend Build Logic
    if (backend === "NodeJS") {

        buildSteps = `
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'

- script: npm install

- script: npm run build
`;
    }

    else if (backend === "Python") {

        buildSteps = `
- task: UsePythonVersion@0
  inputs:
    versionSpec: '3.11'

- script: pip install -r requirements.txt
`;
    }

    else if (backend === "Java") {

        buildSteps = `
- task: Maven@3
`;
    }

    else if (backend === ".NET") {

        buildSteps = `
- task: UseDotNet@2
  inputs:
    packageType: 'sdk'
    version: '8.x'

- script: dotnet restore

- script: dotnet build
`;
    }

    let deployStep = "";

    // Deployment Logic
    if (target === "Azure App Service") {

        deployStep = `
- task: AzureWebApp@1
  inputs:
    azureSubscription: '${serviceConnection}'
    appName: '${appName}'
    resourceGroupName: '${resourceGroup}'
`;
    }

    else {

        deployStep = `
- task: CopyFilesOverSSH@0
  displayName: Deploy To Azure VM
`;
    }

    return `
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:

${buildSteps}

${deployStep}
`;
}
function generateTerraform() {
    const location =
    document.getElementById("azureLocation")?.value
    || "Central India";
const subnetName =
    document.getElementById("subnetName")?.value ||
    "demo-subnet";

const publicIpName =
    document.getElementById("publicIpName")?.value ||
    "demo-pip";

const nicName =
    document.getElementById("nicName")?.value ||
    "demo-nic";
    let tf = "";

    if (document.getElementById("rgCheck")?.checked) {

        tf += `
resource "azurerm_resource_group" "rg" {
  name     = "${document.getElementById('rgName')?.value || 'demo-rg'}"
  location = "${location}"
}
`;
    }

    if (document.getElementById("storageCheck")?.checked) {

        tf += `
resource "azurerm_storage_account" "storage" {
  name = "${document.getElementById('storageName')?.value || 'demostorage'}"
  location                 = "${location}"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}
`;
    }

    if (document.getElementById("vnetCheck")?.checked) {

        tf += `
resource "azurerm_virtual_network" "vnet" {
  name = "${document.getElementById('vnetName')?.value || 'demo-vnet'}"
  location = "${location}"
  address_space = ["10.0.0.0/16"]
}
`;
    }

    if (document.getElementById("vmCheck")?.checked) {

        tf += `
resource "azurerm_linux_virtual_machine" "vm" {
  name           = "${document.getElementById('vmName')?.value || 'demo-vm'}"
  location       = "${location}"
  size           = "${document.getElementById('vmSize')?.value || 'Standard_B1s'}"
  admin_username = "${document.getElementById('adminUser')?.value || 'azureuser'}"
}
`;
    }

    return tf;
}
document
.getElementById("downloadBtn")
.addEventListener("click", () => {

    const content =
        document.getElementById("terraformOutput").value;

    if (!content) {
        alert("Generate output first");
        return;
    }

    const deployment =
        document.getElementById("deploymentType").value;

    const filename =
        deployment === "application"
            ? "azure-pipelines.yml"
            : "main.tf";

    const blob = new Blob(
        [content],
        { type: "text/plain" }
    );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        filename;

    link.click();
});
document
.getElementById("copyBtn")
.addEventListener("click", async () => {

    const content =
        document.getElementById("terraformOutput").value;

    if (!content) {
        alert("Generate output first");
        return;
    }

    try {

        await navigator.clipboard.writeText(content);

        alert("Output copied successfully!");

    } catch (error) {

        console.error(error);

        alert("Copy failed");
    }
});
