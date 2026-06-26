function generateDynamicYAML(
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
    acrServiceConnection,
    repoType,
    repoName,
    repoUrl
) 
{
      let variableGroupBlock = "";

    if (variableGroup.trim()) {

        variableGroupBlock = `- group: ${variableGroup}
`;
    }
let dockerSteps = "";

if (dockerEnabled === "Yes") {

    dockerSteps = `
- task: Docker@2
  displayName: Build Docker Image

  inputs:
    command: build
    Dockerfile: '**/Dockerfile'
    repository: '$(imageName)'

- task: Docker@2
  displayName: Push Docker Image

  inputs:
    command: push
    containerRegistry: '${acrServiceConnection}'
    repository: '$(imageName)'
`;
}
    let buildSteps = "";
    let frontendBuild = "";

if (frontend === "React") {

    frontendBuild = `
- script: npm install
  displayName: Install React Dependencies

- script: npm run build
  displayName: Build React App
`;
}

else if (frontend === "Angular") {

    frontendBuild = `
- script: npm install
  displayName: Install Angular Dependencies

- script: ng build --configuration production
  displayName: Build Angular App
`;
}

else if (frontend === "Vue") {

    frontendBuild = `
- script: npm install
  displayName: Install Vue Dependencies

- script: npm run build
  displayName: Build Vue App
`;
}

else if (frontend === "HTML/CSS/JS") {

    frontendBuild = `
- script: echo Building Static Website
  displayName: Static Website Build
`;
}
    let testSteps = `
- script: echo Running Unit Tests...
  displayName: Unit Testing

- script: echo Running Security Scan...
  displayName: Security Validation
`;

    if (backend === "NodeJS") {

        buildSteps = `
- task: NodeTool@0
  inputs:
    versionSpec: '${nodeVersion}'

- script: npm install
  displayName: Install Dependencies

- script: npm run build -- --configuration $(buildConfiguration)
  displayName: Build Application
`;
    }

    else if (backend === "Python") {

        buildSteps = `
- task: UsePythonVersion@0
  inputs:
    versionSpec: '${pythonVersion}'

- script: pip install -r requirements.txt
  displayName: Install Dependencies
`;
    }

    else if (backend === "Java") {

    buildSteps = `
- task: Maven@3
  displayName: Build Java Application

  inputs:
    jdkVersionOption: '${javaVersion}'
`;

    }

    else if (backend === ".NET") {

        buildSteps = `
- task: UseDotNet@2
  inputs:
    packageType: 'sdk'
    version: '${dotnetVersion}'

- script: dotnet restore
  displayName: Restore Packages

- script: dotnet build --configuration $(buildConfiguration)
  displayName: Build Application
`;
    }

    let deployStep = "";

    if (target === "Azure App Service") {

        deployStep = `
- task: AzureWebApp@1
  inputs:
    azureSubscription: '${serviceConnection}'
    appName: '$(appService)'
    resourceGroupName: '${resourceGroup}'
    slotName: '${deploymentSlot}'
`;
    }

    else {

        deployStep = `
- task: CopyFilesOverSSH@0
  displayName: Deploy To Azure VM
`;
    }

    return `
# =================================================
# ============================================
# CloudStack Generator
# Azure DevOps Pipeline
#
# Repository : ${repoName}
# Repository Type : ${repoType}
# Repository URL : ${repoUrl}
#
# Target : ${target}
# Environment : ${environment}
# Generated : Auto
# ============================================
# =================================================

trigger:
  branches:
    include:
      - main
      - develop

name: ${repoName}-$(Date:yyyyMMdd)-$(Rev:.r)

variables:
- name: imageName
  value: ${dockerImageName}

- name: appService
  value: ${appName}
- name: acrName
  value: ${acrName}
${variableGroupBlock}
- name: buildConfiguration
  value: ${buildConfiguration}

- name: environmentName
  value: ${environment}

stages:

- stage: Build

  jobs:

  - job: BuildJob

    pool:
      vmImage: ${agentOS}

    steps:

${frontendBuild}

${buildSteps}
${dockerSteps}

- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(Build.SourcesDirectory)'
    ArtifactName: 'drop'

- stage: Test
  dependsOn: Build

  jobs:

  - job: TestJob

    pool:
      vmImage: ${agentOS}

    steps:

${testSteps}

- stage: Deploy

  dependsOn: Test

  jobs:

  - deployment: DeployJob

    environment: ${environment}

    pool:
      vmImage: ${agentOS}

    strategy:
      runOnce:
        deploy:
          steps:

${deployStep}
`;
}

