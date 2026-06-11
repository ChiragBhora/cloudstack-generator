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
