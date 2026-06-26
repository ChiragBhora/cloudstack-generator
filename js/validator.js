function validateProject() {

    const projectName =
        getValue("projectName").trim()

    if (!projectName) {

        alert("Project Name is required");

        return false;
    }

    return true;
}

function validateApplication(
    serviceConnection,
    appName
) {

    if (!serviceConnection) {

        alert("Service Connection is required");

        return false;
    }

    if (!appName) {

        alert("App Service Name is required");

        return false;
    }

    return true;
}
function validateInfrastructure() {

    if (
    isChecked("vmCheck") &&
    !getValue("vmName").trim()
) {
    alert("VM Name is required");
    return false;
}

    if (
    isChecked("vmCheck") &&
    !getValue("adminUser").trim()
) {
    alert("Admin Username is required");
    return false;
}

   if (
    isChecked("vmCheck") &&
    !getValue("adminPassword").trim()
) {
    alert("Admin Password is required");
    return false;
}

    return true;
}