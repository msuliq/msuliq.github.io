/**
 * Usually, just calling the function checkIfMobileView() once would be enough.
 * However, if the function is only executed once on initialization of script
 * I noticed that when switching from desktop view to mobile view using chrome dev tools, it will not "re-render" the appropriate navbar (i.e. got padding in desktop view VS no padding in mobile view)
 * Hence, setInterval() is utilized here every 100ms to check whether the current view checkIfMobileView or not (if yes --> remove padding, else if no --> don't remove padding)
 * You can think of setInterval() as sort of a function that helps to "re-render" the navbar to the correct view (desktop or mobile view) every 100ms
 */

 function checkIfMobileView() {
    const navLinks = document.getElementsByClassName("nav-link");
    const mobileViewRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileView =
      mobileViewRegex.test(navigator.userAgent) || window.innerWidth <= 480;
  
    if (isMobileView) {
      // Mobile View (smaller devices like mobile phones or tablets)
      for (navLink of navLinks) {
        navLink.className = "nav-link remove-padding";
      }
  
      // Change font-awesome fa-6x classname to fa-2x in mobile view (<= 480px)
      const fontAwesomeIcons =
        document.getElementsByClassName("fontawesome-logo");
      if (window.innerWidth <= 480) {
        for (icon of fontAwesomeIcons) {
          const newClass = icon.className.replace("fa-6x", "fa-2x");
          icon.className = newClass;
        }
      }
  
      // Fix Scratch logo in 'Projects' section (originally was too large)
      const scratchLogo = document.getElementById("scratchLogo");
      scratchLogo.width = "48px";
      scratchLogo.height = "48px";
      scratchLogo.style.marginLeft = "20px";
      scratchLogo.style.marginTop = "12px";
  
      return true;
    } else {
      // Desktop View (bigger devices like laptops, desktops etc)
      // If switch from mobile view to desktop view in Chrome devtools, this block of code will:
      //  - 'Revert' back the fontawesome icons classNames from 2x to 6x
      //  - 'Revert' the size of scratchLogo back to original
      const fontAwesomeIcons =
        document.getElementsByClassName("fontawesome-logo");
      for (icon of fontAwesomeIcons) {
        const newClass = icon.className.replace("fa-2x", "fa-6x");
        icon.className = newClass;
      }
      const scratchLogo = document.getElementById("scratchLogo");
      scratchLogo.width = "128px";
      scratchLogo.height = "128px";
  
      // 992px width is an arbitary cut off value whereby >= 992px (nav links appear horizontally), <= 991px (nav links appear vertically)
      const viewportWidth = window.innerWidth;
      if (viewportWidth < 992) {
        for (navLink of navLinks) {
          navLink.className = "nav-link remove-padding";
        }
      } else {
        for (navLink of navLinks) {
          navLink.className = "nav-link";
        }
      }
  
      // Also using 768px as a pivot point to add or remove additional margin for scratchLogo
      if (viewportWidth >= 768) {
        scratchLogo.style.marginLeft = "28px";
      } else {
        scratchLogo.style.marginLeft = "0px";
      }
  
      return false;
    }
  }
  
  checkIfMobileView();
  setInterval(checkIfMobileView, 100);
  