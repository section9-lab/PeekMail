<script lang="ts">
    import { count,language,url,model,apiKey } from "../storage";
    import Options from "./Options.svelte";
    
</script>

<div class="overlay">
    <!-- <Options {count} /> -->
    <Options {language} {url} {model} {apiKey} />
</div>

<style>
    .overlay {
        position: fixed;
        width: 300px;
        top: 16px;
        left: 16px;
        background-color: white;
        border: 1px solid black;
        padding: 16px;
    }
</style>
