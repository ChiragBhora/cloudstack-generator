function validateProject() {

    const projectName =
        document.getElementById("projectName")?.value.trim();

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
        document.getElementById("vmCheck")?.checked &&
        !document.getElementById("vmName")?.value.trim()
    ) {
        alert("VM Name is required");
        return false;
    }

    if (
        document.getElementById("vmCheck")?.checked &&
        !document.getElementById("adminUser")?.value.trim()
    ) {
        alert("Admin Username is required");
        return false;
    }

    if (
        document.getElementById("vmCheck")?.checked &&
        !document.getElementById("adminPassword")?.value.trim()
    ) {
        alert("Admin Password is required");
        return false;
    }

    return true;
}