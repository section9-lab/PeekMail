import { language } from "../storage";
// import { mount } from "svelte";
import { fetchWithRetry, waitForPageLoad } from "./utils";
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';


const model = createOpenAICompatible({
  baseURL: 'https://api.example.com/v1',
  name: 'example',
  apiKey: 'your-api-key',
});

const { text } = await generateText({
  model: model.chatModel('meta-llama/Llama-3-70b-chat-hf'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});


const destXPath =
  "//*[@id=':1']/div[position()=1 or position()=2]/div/div[2]/div[1] | //*[@id=':1']/div/div/div/div[2]/div[1]";

export async function createAImail() {
  console.log("createAImail");
  const sourMailXPath =
    "//*[contains(@id, ':') and string-length(@id) >= 3]/div[1]/div[2]/div[3]";
  //*[@id=":156"]/div[1]/div[2]/div[3]
  let targetElement = undefined;
  targetElement = document.evaluate(
    sourMailXPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (targetElement && targetElement.parentNode) {
    const mailContent = targetElement.textContent;
    const aiText = await postMail2Server(mailContent);
    viweData2Page(aiText);
  } else {
    console.log("targetElement not found");
    console.log("targetElement:" + targetElement);
  }
}

async function viweData2Page(aiText: any) {
  console.log("aiText:" + aiText);
  const postElement = document.evaluate(
    destXPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (postElement && postElement.parentNode) {
    const loadElement = document.getElementById("response-display-div");
    if (loadElement) {
      if (postElement.parentNode) {
        postElement.parentNode.removeChild(loadElement);
      }
    }
    const responseDivId = "response-display-div";
    let responseElement = document.getElementById(responseDivId);

    responseElement = document.createElement("div");
    responseElement.id = responseDivId;
    if (postElement.parentNode) {
      postElement.parentNode.appendChild(responseElement);
      console.log("creat_responseElement:" + responseElement);
    }
    responseElement.innerHTML = formatResponseWithLineBreaks(aiText);
    responseElement.style = `
  background-image: linear-gradient(to top right, rgba(43, 76, 246, 0.4), rgba(236, 82, 203, 0.4));
  padding: 10px;
  margin: 20px 10px 0px 80px;
  border-radius: 5px;
  color: #424242;
  border: 1px solid #e0e0e0;
  font-size: 13px;
    `;
    if (postElement.parentNode) {
      postElement.parentNode.insertBefore(
        responseElement,
        postElement.nextSibling
      );
      console.log("insert_responseElement:" + responseElement.outerHTML);
    }
    console.log("postElement:" + postElement.parentElement);
  }
}
function formatResponseWithLineBreaks(respon: string | object) {
  let text =
    typeof respon === "string" ? respon : JSON.stringify(respon, null, 2);
  text = text.trim();
  text = text.replace(/<think>[\s\S]*?<\/think>/g, "");
  text = text.replace(/^\n+/, ""); // 移除开头的换行符
  text = text.replace(/\n/g, "<br>");
  text = text.replace(/  /g, "&nbsp;&nbsp;");
  return text;
}

function createLoading() {
  console.log("createLoading...");
  const loadingDivId = "loading-div";
  let loadingElement = document.getElementById(loadingDivId);
  if (!loadingElement) {
    const loadingTaget = document.evaluate(
      destXPath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    loadingElement = document.createElement("div");
    loadingElement.id = loadingDivId;
    
    // 显示波浪动画
    loadingElement.innerHTML = `
      <div class="loading-wave"></div>
      <style>
        #${loadingDivId} .loading-wave {
          width: 350px;
          height: 12px;
          background: linear-gradient(90deg,rgb(143, 40, 221),rgb(45, 65, 238),rgb(228, 39, 39),rgb(143, 40, 221));
          background-size: 300% 100%;
          border-radius: 100px;
          animation: wave 3.5s linear infinite;
        }

        @keyframes wave {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      </style>
    `;

    loadingElement.style = `
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      padding-top: 40px;
      padding-bottom: 20px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 9999;
    `;

    if (loadingTaget.parentNode) {
      loadingTaget.parentNode.insertBefore(
        loadingElement,
        loadingTaget.nextSibling
      );
    }
  }
  console.log("createLoaded");
}

function removeLoading() {
  console.log("removeLoading");
  const loadingDivId = "loading-div";
  const loadingElement = document.getElementById(loadingDivId);
  if (loadingElement) {
    loadingElement.remove();
  }
  console.log("removeLoaded");
}

/**
 * 发送POST请求到服务器
 * @param sourceEmailText 要发送的文本数据
 * @returns 返回服务器响应
 */
async function postMail2Server(sourceEmailText: any) {
  //获取语言
  let lang: string;
  language.subscribe((value) => {
    lang = value;
  });
  console.log("language:" + lang);
  createLoading();
  const mailObjData = { emailContent: sourceEmailText, language: lang };
  console.log("mailObjData:" + JSON.stringify(mailObjData));
  const response = await fetchWithRetry(
    "https://peek-mail.section9lab.cn/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mailObjData),
    },
    { retries: 3, retryDelay: 5000 }
  );
  removeLoading();
  console.log("response:" + response);
  return response;
}
