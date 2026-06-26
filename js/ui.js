// ============================================
// CloudStack Generator - UI Module
// ============================================
const deploymentType = document.getElementById("deploymentType");
const dynamicFields = document.getElementById("dynamicFields");


// --------------------------------------------
// Deployment Type
// --------------------------------------------

deploymentType.addEventListener("change", renderDeploymentFields);

function renderDeploymentFields() {

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

<div id="versionFields"></div>

<label>Deployment Target</label>
<select id="target">
    <option>Azure App Service</option>
    <option>Azure VM</option>
    <option>Azure Kubernetes Service (AKS)</option>
</select>

<div id="aksFields"></div>

<label>Deployment Slot</label>
<select id="deploymentSlot">
    <option>production</option>
    <option>staging</option>
</select>

<label>Require Approval</label>
<select id="approvalRequired">
    <option>No</option>
    <option>Yes</option>
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

<label>Build Configuration</label>
<select id="buildConfiguration">
    <option>Debug</option>
    <option>Release</option>
</select>

<label>Variable Group</label>
<input
type="text"
id="variableGroup"
placeholder="My-Variable-Group">

<label>Enable Docker</label>
<select id="dockerEnabled">
    <option>No</option>
    <option>Yes</option>
</select>

<label>Docker Image Name</label>
<input
type="text"
id="dockerImageName"
placeholder="myapp">

<label>Azure Container Registry</label>
<input
type="text"
id="acrName"
placeholder="myacr.azurecr.io">

<label>ACR Service Connection</label>
<input
type="text"
id="acrServiceConnection"
placeholder="My-ACR-ServiceConnection">
`;

        initializeBackendVersions();
        initializeTargetFields();
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

        initializeResourceConfiguration();
    }

}
// --------------------------------------------
// Backend Versions
// --------------------------------------------

function initializeBackendVersions() {

    const backend = document.getElementById("backend");

    if (!backend) return;

    backend.addEventListener("change", renderBackendVersions);

    renderBackendVersions();
}

function renderBackendVersions() {

    const backend = document.getElementById("backend");

    const versionFields =
        document.getElementById("versionFields");

    if (!backend || !versionFields) return;

    switch (backend.value) {

        case "NodeJS":

            versionFields.innerHTML = `
<label>Node Version</label>
<select id="nodeVersion">
<option>18.x</option>
<option>20.x</option>
<option>22.x</option>
</select>
`;
            break;

        case "Python":

            versionFields.innerHTML = `
<label>Python Version</label>
<select id="pythonVersion">
<option>3.10</option>
<option>3.11</option>
<option>3.12</option>
</select>
`;
            break;

        case "Java":

            versionFields.innerHTML = `
<label>Java Version</label>
<select id="javaVersion">
<option>17</option>
<option>21</option>
</select>
`;
            break;

        case ".NET":

            versionFields.innerHTML = `
<label>.NET Version</label>
<select id="dotnetVersion">
<option>6.0</option>
<option>7.0</option>
<option>8.0</option>
</select>
`;
            break;
    }

}

// --------------------------------------------
// AKS Dynamic Fields
// --------------------------------------------

function initializeTargetFields() {

    const target =
        document.getElementById("target");

    if (!target) return;

    target.addEventListener("change", renderTargetFields);

    renderTargetFields();

}

function renderTargetFields() {

    const target =
        document.getElementById("target");

    const aksFields =
        document.getElementById("aksFields");

    if (!target || !aksFields) return;

    if (target.value === "Azure Kubernetes Service (AKS)") {

        aksFields.innerHTML = `

<label>AKS Cluster Name</label>
<input
type="text"
id="aksCluster"
placeholder="my-aks-cluster">

<label>Namespace</label>
<input
type="text"
id="aksNamespace"
placeholder="production">

<label>Manifest Path</label>
<input
type="text"
id="manifestPath"
placeholder="k8s/deployment.yml">

<label>Enable Helm</label>
<select id="helmEnabled">
<option>No</option>
<option>Yes</option>
</select>

`;

    }

    else {

        aksFields.innerHTML = "";

    }

}

// --------------------------------------------
// Infrastructure Resources
// --------------------------------------------

function initializeResourceConfiguration() {

    document.addEventListener("change", handleInfrastructureChange);

}

function handleInfrastructureChange(event) {

    if (![
        "rgCheck",
        "vmCheck",
        "storageCheck",
        "vnetCheck"
    ].includes(event.target.id)) {

        return;

    }

    const config =
        document.getElementById("resourceConfig");

    if (!config) return;

    if (
        event.target.id === "vmCheck" &&
        event.target.checked
    ) {

        document.getElementById("rgCheck").checked = true;
        document.getElementById("vnetCheck").checked = true;
    }

    let html = "";

    if (isChecked("rgCheck")) {

        html += `

<h3>Resource Group</h3>

<label>Resource Group Name</label>

<input
type="text"
id="rgName"
placeholder="demo-rg">

`;

    }

    if (isChecked("vmCheck")) {

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
<input
type="password"
id="adminPassword">

`;

    }

    if (isChecked("storageCheck")) {

        html += `

<h3>Storage Account</h3>

<label>Storage Name</label>

<input
type="text"
id="storageName">

`;

    }

    if (isChecked("vnetCheck")) {

        html += `

<h3>Virtual Network</h3>

<label>VNet Name</label>

<input
type="text"
id="vnetName">

`;

    }

    config.innerHTML = html;

}

// ============================================
// End of UI Module
// ============================================