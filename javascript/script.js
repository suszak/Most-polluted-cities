var inputFlag = 0;

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

window.addEventListener('DOMContentLoaded', () => {
    
    document.querySelector("#country").addEventListener("click", (e) => {
        if (inputFlag === 0) {
            document.querySelector(".choice__label").classList.add("choice__label--active");
            document.querySelector(".choice__input").classList.add("choice__input--active");
            inputFlag = 1;
            console.log("active");
        }
    });

    document.addEventListener("click", (e) => {
        if (inputFlag === 1 && document.querySelector("#country").value === "" && e.target.id !== "country") {
            document.querySelector(".choice__label").classList.remove("choice__label--active");
            document.querySelector(".choice__input").classList.remove("choice__input--active");
            inputFlag = 0;
            console.log(e.target.id);
        }
    })

});
