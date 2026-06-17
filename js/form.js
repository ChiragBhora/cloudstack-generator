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

        let yamlCode = "";
            yamlCode = generateDynamicYAML(
            frontend,
            backend,
            target,
            serviceConnection,
            appName,
            resourceGroup
);
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
