document.addEventListener("DOMContentLoaded", () =>{
    const form = document.getElementById("saveProfile");
    const inputs = form.querySelectorAll("input[required]");

    form.addEventListener("submit", function(f) {
        let isValid = true;
        inputs.forEach(input => {
            if( input.value.trim() === ""){
                isValid = false;
            }
        });
        if(!isValid){
            f.preventDefault();
        }
    });
});