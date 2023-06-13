// pass options to ace.edit


// code for the uploaded code editor

let element = document.querySelector("#editor");
// window.alert("here is the ocde");

let file_name = document.getElementsByClassName("file_name")[0].textContent;
let programming_lang = "";
for(let i = file_name.length - 1; i >= 0; i--){
    if(file_name[i] == '.'){
        break;
    }
    programming_lang += file_name[i];
}

programming_lang = programming_lang.split("").reverse().join("").trim();
console.log(programming_lang)

let final_lang;

if(programming_lang === "cpp") final_lang = "c_cpp";
else if(programming_lang === 'py') final_lang = 'python';
else if(programming_lang === 'java') final_lang = 'java';
console.log(final_lang);

ace.edit(element, {
    theme: "ace/theme/monokai",
    mode: "ace/mode/" + final_lang,
})



