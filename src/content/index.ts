import { mount } from "svelte";
import Overlay from "../components/Overlay.svelte";
import Options from "../components/Options.svelte";
import { language } from "../storage";
import { createAImail } from "./core";
// Content scripts
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/

// Some global styles on the page
// import "./styles.css";

// Some JS on the page
// count.subscribe(console.log);

// // Some svelte component on the page
// mount(Overlay, { target: document.body });

// 存储当前页面的URL，用于检测URL变化
const lastUrl = window.location.href;
let lastMailId = lastUrl.split("/mail/u/0/#inbox/")[1];
// 监听 URL 变化
function setupUrlChangeListener() {
  console.log("Setting up URL change listener");
  // 定期检查 URL 变化
  setInterval(() => {
    // 存储当前页面的URL，用于检测URL变化
    const currentMailID = window.location.href.split("/mail/u/0/#inbox/")[1];
    // 如果 gmailID 为空打印信息
    if (currentMailID === undefined) {
      console.log("gmailID is empty");
      removeExistingButton();
      return;
    } else if (currentMailID !== lastMailId) {
      console.log("URL changed \ncid:" + currentMailID + " lid:" + lastMailId);
      // 移除现有按钮
      // 创建按钮
      createButton();
      lastMailId = currentMailID; // 更新 lastUrl
    } else {
      // 检查按钮是否存在
      if (!document.querySelector(".Peek-mail-btn")) {
        console.log("Button not found");
        createButton();
      }
    }
  }, 1000);
}

// 创建并添加按钮
function createButton() {
  try {
    const existingButton = document.querySelector(".Peek-mail-btn");
    if (existingButton) {
      return;
    }
    console.log("Creating button");

    // 创建 SVG 图标
    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL("src/assets/sparkles.svg");
    icon.style.width = "20px";
    icon.style.height = "20px";
    icon.style.marginRight = "10px";
    icon.style.verticalAlign = "middle";

    // 创建按钮
    const button = document.createElement("button");
    const text = document.createTextNode("AI总结");

    button.appendChild(icon);
    button.appendChild(text);
    button.onclick = createAImail;
    button.className = "Peek-mail-btn";

    button.style = `
  background-image: linear-gradient(to top right, rgb(239, 68, 68), rgb(128, 32, 219));
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  margin-right: 8px;
  padding: 8px 14px;
    `;

    const buttonXpath = '//*[@id=":1"]/div/div[position()=1 or position()=2]/div/div[2]/div[1]/div/div[1]/div/span[1]';

    // 查找目标元素并插入按钮
    try {
      const targetElement = document.evaluate(
        buttonXpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (targetElement && targetElement.parentNode) {
        console.log("Target element found");
        console.log(targetElement);
        console.log(targetElement.parentNode);
        // 将按钮插入到目标元素之前
        targetElement.parentNode.insertBefore(button, targetElement);
        // 验证按钮是否真的被插入到 DOM 中
        console.log("Button in DOM:", document.querySelector(".Peek-mail-btn"));
      } else {
        console.log("Target element not found");
        console.log(targetElement);
        document.body.appendChild(button); //将按钮添加到页面的 body 中
        // 验证按钮是否真的被插入到 DOM 中
        console.log("Button in DOM:", document.querySelector(".Peek-mail-btn"));
      }
    } catch (error) {
      console.error("Error inserting button:", error);
      // 作为备选方案，直接添加到 body
      document.body.appendChild(button);
    }
  } catch (error) {
    console.error("Error in createButton:", error);
    if ((error as Error).message.includes("Extension context invalidated")) {
      console.log("Extension context invalidated, reloading page...");
      window.location.reload();
    }
  }
}

// 移除现有按钮
function removeExistingButton() {
  const existingButton = document.querySelector(".Peek-mail-btn");
  if (existingButton) {
    existingButton.remove();
  }
}

// 初始化扩展
function initialize() {
  console.log("Initializing extension");
  // 等待 Gmail 界面加载完成
  setTimeout(() => {
    setupUrlChangeListener();
  }, 8000); //等待 8 秒浏览器加载完成
}

// 确保页面完全加载后执行
window.addEventListener("load", () => {
  console.log("Window loaded");
  initialize();
});
