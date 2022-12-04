class TypeWriter {
  constructor(textElement, words, wait) {
    this.textElement = textElement;
    this.words = words;
    this.wait = parseInt(wait, 10); //base 10; this.wait = 1000ms

    this.text = "";
    this.wordIndex = 0;
    this.isDeleting = false;
    this.type(); //can call a method/function in the constructor.
  }
  
  type() {
    // Current index of word
    const currentIndex = this.wordIndex % this.words.length;

    // Get full text of current word
    const currentWord = this.words[currentIndex];

    // Check if deleting
    if (this.isDeleting) {
      // Remove character
      this.text = currentWord.substring(0, this.text.length - 1);
    } else {
      // Add character
      this.text = currentWord.substring(0, this.text.length + 1);
    }

    // Insert text into element
    this.textElement.innerHTML = `${this.text}`;

    // Initial Typing Speed
    let typingSpeed = 100;

    // if this.isDeleting = true, aka when deleting, it will become the speed of deleting
    if (this.isDeleting) {
      typingSpeed /= 2;
    }

    // If word has just completely typed finish
    if (!this.isDeleting && this.text === currentWord) {
      // Make pause at end
      typingSpeed = this.wait; //this.wait === 1000ms
      // Set delete to true
      this.isDeleting = true;
    } else if (this.isDeleting && this.text === "") {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typingSpeed = 500;
    }

    setTimeout(() => this.type(), typingSpeed);
  }
}
  
function init() {
  const textElement = document.querySelector(".text-type"); //finds in the document/DOM an element that matches the CSS selector in the parentheses. We are getting the span element here
  const words = JSON.parse(textElement.getAttribute("data-words")); //words is an array of words [S, P, A]
  const wait = textElement.getAttribute("data-wait"); //wait="1000" (1000 in string form, which later we  parseInt to convert to 1000ms in integer form)

  // Instantiate TypeWriter
  new TypeWriter(textElement, words, wait);
}
  
  // 'DOMContentLoaded' is an event that will fire, when the initial HTML document is loaded; without waiting for the CSS/images/subframes etc.
  // Hence we are adding to the DOM/document, an event listener, which will listen for the event 'DOMContentLoaded'
  // and when that event fires/runs, the init() fn will run
document.addEventListener("DOMContentLoaded", init);
