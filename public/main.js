// pass options to ace.edit

let element = document.querySelector("#editor");
// window.alert("here is the ocde");

ace.edit(element, {
    mode: "ace/mode/javascript",
    theme: "ace/theme/cobalt",
})
