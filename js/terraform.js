function generateTerraform() {

    const location =
        document.getElementById("azureLocation")?.value ||
        "Central India";

    const rgName =
        document.getElementById("rgName")?.value ||
        "demo-rg";

    const subnetName =
        document.getElementById("subnetName")?.value ||
        "demo-subnet";

    const publicIpName =
        document.getElementById("publicIpName")?.value ||
        "demo-pip";

    const nicName =
        document.getElementById("nicName")?.value ||
        "demo-nic";

    let tf = `
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}
`;

    if (document.getElementById("rgCheck")?.checked) {

        tf += `
resource "azurerm_resource_group" "rg" {
  name     = "${rgName}"
  location = "${location}"
}
`;
    }

    if (document.getElementById("storageCheck")?.checked) {

        tf += `
resource "azurerm_storage_account" "storage" {
  name                     = "${document.getElementById("storageName")?.value || "demostorage"}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = "${location}"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}
`;
    }

    if (document.getElementById("vnetCheck")?.checked) {

        tf += `
resource "azurerm_virtual_network" "vnet" {
  name                = "${document.getElementById("vnetName")?.value || "demo-vnet"}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "${location}"
  address_space       = ["10.0.0.0/16"]
}
`;
    }

    if (document.getElementById("vmCheck")?.checked) {

        tf += `
resource "azurerm_subnet" "subnet" {
  name                 = "${subnetName}"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_public_ip" "pip" {
  name                = "${publicIpName}"
  location            = "${location}"
  resource_group_name = azurerm_resource_group.rg.name
  allocation_method   = "Dynamic"
}

resource "azurerm_network_interface" "nic" {
  name                = "${nicName}"
  location            = "${location}"
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.pip.id
  }
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = "${document.getElementById("vmName")?.value || "demo-vm"}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "${location}"

  network_interface_ids = [
    azurerm_network_interface.nic.id
  ]

  size           = "${document.getElementById("vmSize")?.value || "Standard_B1s"}"
  admin_username = "${document.getElementById("adminUser")?.value || "azureuser"}"

  disable_password_authentication = false

  admin_password = "${document.getElementById("adminPassword")?.value || "Password@123456"}"

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
}
`;
    }

    tf += `

output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "vm_name" {
  value = azurerm_linux_virtual_machine.vm.name
}
`;

    return tf;
}