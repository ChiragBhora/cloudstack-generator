function getValue(id, defaultValue = "") {
    const element = document.getElementById(id);
    return element ? element.value : defaultValue;
}

function isChecked(id) {
    const element = document.getElementById(id);
    return element ? element.checked : false;
}

function getElement(id) {
    return document.getElementById(id);
}

function setOutput(text) {
    const output = document.getElementById("terraformOutput");
    if (output) {
        output.value = text;
    }
}

function setTitle(title) {
    const outputTitle = document.getElementById("outputTitle");
    if (outputTitle) {
        outputTitle.textContent = title;
    }
}