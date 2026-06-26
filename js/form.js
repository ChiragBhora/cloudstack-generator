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
// Generate Output
// ------------------------

document.getElementById("multiStepForm")
.addEventListener("submit", (e) => {

    e.preventDefault();

    const output =
        document.getElementById("terraformOutput");

    const outputTitle =
        document.getElementById("outputTitle");
    const repoName =
        document.getElementById("repoName")?.value || "";
    const repoUrl =
        document.getElementById("repoUrl")?.value || "";
    const repoType =
        document.getElementById("repoType")?.value || "";

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
        const deploymentSlot =
            document.getElementById("deploymentSlot")?.value || "production";

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
        const nodeVersion =
            document.getElementById("nodeVersion")?.value || "18.x";
        const pythonVersion =
            document.getElementById("pythonVersion")?.value || "3.11";
        const javaVersion =
            document.getElementById("javaVersion")?.value || "17";
        const dotnetVersion =
            document.getElementById("dotnetVersion")?.value || "8.0";
        const buildConfiguration =
            document.getElementById("buildConfiguration")?.value
            || "Release";
        const variableGroup =
            document.getElementById("variableGroup")?.value || "";
        const dockerEnabled =
            document.getElementById("dockerEnabled")?.value || "No";

        const dockerImageName =
            document.getElementById("dockerImageName")?.value || "";

        const acrName =
            document.getElementById("acrName")?.value || "";
    
        outputTitle.textContent =
            "Generated Azure DevOps YAML";

        output.value = 
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