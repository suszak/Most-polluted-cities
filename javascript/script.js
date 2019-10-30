let inputFlag = 0; // input active or not

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// array with countries:
const countriesArray = ["POLAND", "GERMANY", "SPAIN", "FRANCE"];

window.addEventListener('DOMContentLoaded', () => {
    
    // header section events:
    document.querySelector("#goNav").addEventListener("click", () => {
        document.querySelector("#navigation").scrollIntoView();
    });

    // navigation section events:
    // nav: input enabling:
    document.querySelector("#country").addEventListener("click", (e) => {
        if (inputFlag === 0) {
            document.querySelector(".choice__label").classList.add("choice__label--active");
            document.querySelector(".choice__input").classList.add("choice__input--active");
            inputFlag = 1;
            // console.log("active");
        }
    });


    // nav: verifier change:
    document.querySelector("#country").addEventListener("keyup", (e) => {
        
            if (countriesArray.indexOf(document.querySelector("#country").value.toUpperCase()) !== -1) {
                document.querySelector("#verifier").classList.remove("fa-times");
                document.querySelector("#verifier").classList.add("fa-check");
            } else {
                document.querySelector("#verifier").classList.add("fa-times");
                document.querySelector("#verifier").classList.remove("fa-check");
            }
        
    });

    // nav: input disabling:
    document.addEventListener("click", (e) => {

        if (inputFlag === 1 && document.querySelector("#country").value === "" && e.target.id !== "country") {
            document.querySelector(".choice__label").classList.remove("choice__label--active");
            document.querySelector(".choice__input").classList.remove("choice__input--active");
            inputFlag = 0; 
        }
    });

});
