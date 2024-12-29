function generateDynamicYear() {
    const copyrightElement = document.getElementById("copyright");
    const dateObject = new Date();
    const currentYear = dateObject.getFullYear();
    copyrightElement.innerHTML = `&copy; Copyright ${currentYear}. All rights reserved by msuliq`;
  }
  
  generateDynamicYear();
  