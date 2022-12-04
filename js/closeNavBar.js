function closeNavBar() {
    const navbar = document.getElementById("navbarContents");
    navbar.setAttribute("class", "navbar-collapse justify-content-start collapse");
  }
  
  function addEventListenersToCloseNavBar() {
    const homeDiv = document.getElementById("home");
    const aboutDiv = document.getElementById("about");
    const toolsDiv = document.getElementById("tools");
    const projectsDiv = document.getElementById("projects");
    const contactDiv = document.getElementById("contact");
    const navLinks = document.getElementsByClassName("nav-link");
    homeDiv.addEventListener("click", closeNavBar);
    aboutDiv.addEventListener("click", closeNavBar);
    toolsDiv.addEventListener("click", closeNavBar);
    projectsDiv.addEventListener("click", closeNavBar);
    contactDiv.addEventListener("click", closeNavBar);
    for (navLink of navLinks) {
      navLink.addEventListener("click", closeNavBar);
    }
  }
  
  addEventListenersToCloseNavBar();
  