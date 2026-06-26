# CloudStack Generator — Upgrade Plan

## 0) Repo analysis (baseline)
- [x] Read current HTML/CSS/JS/README (index.html, js/*.js, css/style.css, README.md)
- [x] Identify gaps vs requirements (Azure DevOps YAML completeness, Terraform completeness, UX/validation/formatting issues)

## 1) UI/UX modernization
- [ ] index.html: upgrade layout, stepper/progress, loading + toast containers (non-breaking IDs)
- [ ] css/style.css: modern responsive design + stepper + toast + loading spinner + improved buttons
- [ ] js/helpers.js: centralize DOM/toast/loading/YAML/Terraform formatting + sanitizers
- [ ] js/ui.js: refactor dynamic field rendering (no duplicate listeners), render conditional blocks cleanly

## 2) Validation & form flow
- [ ] js/validator.js: replace alert-only validation with structured validation errors
- [x] js/form.js: fix syntax/runtime (restore working single-file script, compatibility preserved)
- [ ] js/download.js: toast-based copy/download; correct filenames for YAML/Terraform outputs

## 3) Azure DevOps generator
- [ ] js/devops.js: produce fully valid multi-stage Azure DevOps YAML with requested features:
  - [ ] Agent OS selection
  - [ ] Runtime version selection
  - [ ] Variable Groups
  - [ ] Deployment Slots (slot + optional approval gate)
  - [ ] Azure App Service deployment
  - [ ] Azure VM deployment (consistent placeholder implementation)
  - [ ] AKS + Helm deployment (conditional)
  - [ ] Docker Build + Push + ACR wiring
  - [ ] Repository information comments
  - [ ] Output formatting/indentation

## 4) Terraform generator
- [ ] js/terraform.js: produce production-grade Terraform with requested resources and correct dependency ordering:
  - [ ] Resource Group
  - [ ] Virtual Network
  - [ ] Subnet
  - [ ] Network Security Group
  - [ ] Public IP
  - [ ] Network Interface
  - [ ] Linux Virtual Machine
  - [ ] Storage Account
  - [ ] variables + outputs + terraform.tfvars generation
  - [ ] Validation prevents invalid combinations (or auto-enables RG if required)
  - [ ] Ensure generated Terraform is syntactically valid

## 5) Documentation
- [ ] README.md: professional rewrite with required sections + screenshots placeholder

## 6) Repository verification
- [ ] Full repo review for broken references, missing IDs, syntax errors
- [ ] Sanity checks: run local lint-like checks (if applicable) / static inspection

## Completion
- [ ] Final summary of all completed changes

