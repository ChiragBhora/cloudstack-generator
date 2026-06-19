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