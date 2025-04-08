import { mount } from "svelte";
import Options from "../components/Options.svelte";
import { language,count } from "../storage";
// Action popup
// https://developer.chrome.com/docs/extensions/reference/action/

function render() {
    const target = document.getElementById("app");

    // if (target) {
    //     mount(Options, { target, props: { count } });
    // }
    if (target) {
        mount(Options, { target, props: { language } });
    }
}

document.addEventListener("DOMContentLoaded", render);


