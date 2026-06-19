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