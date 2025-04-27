<script lang="ts">
  import { type Writable } from "svelte/store";

  // interface Props {
  //     count: Writable<number>;
  // }

  // let { count }: Props = $props();

  interface Props {
    language: Writable<string>;
    url: Writable<string>;
    model: Writable<string>;
    apiKey: Writable<string>;
  }

  let { language }: Props = $props();

  const languages = [
    { value: "中文", label: "中文" },
    { value: "English", label: "English" },
    { value: "日本語", label: "日本語" },
  ];
  let isEnabled = $state(false);

  let url = $state("");
  let model = $state("");
  let apiKey = $state("");
</script>

<div class="container">
  <!-- <p>Current count: <b>{$count}</b></p>
    <div>
        <button onclick={() => ($count -= 1)}>-</button>
        <button onclick={() => ($count += 1)}>+</button>
    </div> -->
  <div>
    <p>Summary Language:</p>
    <select bind:value={$language}>
      {#each languages as lang}
        <option value={lang.value}>{lang.label}</option>
      {/each}
    </select>
    <br />
    <p>Mid Map(Coming...):</p>
    <div class="toggle-container">
      <label class="switch">
        <input type="checkbox" bind:checked={isEnabled} />
        <span class="slider"></span>
      </label>
    </div>
    <br />
    <p>LLM Setting:</p>
    <div class="model-config">
      <div class="input-group">
        <label for="url">API url:</label>
        <input
          type="text"
          id="url"
          bind:value={url}
          placeholder="https://api.groq.com/openai/v1/chat/completions"
        />
      </div>
      <div class="input-group">
        <label for="model">model:</label>
        <input
          type="text"
          id="model"
          bind:value={model}
          placeholder="Please enter model"
        />
      </div>
      <div class="input-group">
        <label for="apikey">API key:</label>
        <input
          type="password"
          id="apikey"
          bind:value={apiKey}
          placeholder="Please enter your API key"
        />
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    min-width: 200px;
    min-height: 300px;
  }

  select {
    border-radius: 4px;
    /* box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6); */
    /* background-color: #2ecc71; */
    background-image: linear-gradient(to top right, rgb(239, 68, 68), rgb(128, 32, 219));
    color: white;
    transition: background-color 0.3s;
    padding: 5px 10px;
    cursor: pointer;
    text-align: center;
  }

  select option {
    text-align: center;
    background-color: white;
    color: #2c3e50;
    padding: 6px;
  }

  .toggle-container {
    margin-top: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 24px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-image: linear-gradient(to top right, rgb(239, 68, 68), rgb(128, 32, 219));
  }

  input:checked + .slider:before {
    transform: translateX(26px);
  }

  .model-config {
    margin-top: 10px;
    padding: 4px;
    border: 1px solid #e0e0e0;
    border-radius: 1px;
  }

  .input-group {
    margin-bottom: 12px;
  }

  .input-group label {
    display: block;
    margin-bottom: 5px;
    color: #2c3e50;
    font-size: 11px;
  }

  .input-group input {
    width: 95%;
    /* padding: 2px; */
    /* border-radius: 1px; */
    font-size: 11px;
  }

  .input-group input:focus {
    /* color: white; */
    /* outline: none; */
    border-color: grey;
  }
</style>
