const steps = document.querySelectorAll(".step");

const nextBtns = document.querySelectorAll(".nextBtn");
const prevBtns = document.querySelectorAll(".prevBtn");

const progressBar = document.getElementById("progressBar");

let currentStep = 0;

function updateForm() {

    steps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
    });

    const progress =
        ((currentStep + 1) / steps.length) * 100;

    progressBar.style.width = progress + "%";
}

nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        if(currentStep < steps.length - 1){
            currentStep++;
            updateForm();
        }

    });
});

prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        if(currentStep > 0){
            currentStep--;
            updateForm();
        }

    });
});

document
.getElementById("multiStepForm")
.addEventListener("submit", e => {

    e.preventDefault();

    alert("Sprint 1 Complete!");
});

updateForm();

const deploymentType =
document.getElementById("deploymentType");

const dynamicFields =
document.getElementById("dynamicFields");

deploymentType.addEventListener("change", () => {

    const value = deploymentType.value;

    if(value === "application"){

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

    else if(value === "infrastructure"){

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
                    <input type="checkbox">
                    Resource Group
                </label>

                <label>
                    <input type="checkbox">
                    Virtual Network
                </label>

                <label>
                    <input type="checkbox">
                    Virtual Machine
                </label>

                <label>
                    <input type="checkbox">
                    Storage Account
                </label>

            </div>
        `;
    }

});