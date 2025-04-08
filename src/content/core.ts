import { language } from "../storage";
import { mount } from "svelte";
import { fetchWithRetry, waitForPageLoad } from "./utils";

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
  const destXPath =
    "//*[@id=':1']/div[position()=1 or position()=2]/div/div[2]/div[1] | //*[@id=':1']/div/div/div/div[2]/div[1]";

  //   const destXPath = "//*[@id=':1']/div[position()=1 or position()=2]/div/div[2]/div[1]";
  //*[@id=":1"]/div/div/div/div[2]/div[1]
  // "//*[@id=':1']/div/[position()=1 or position()=2]/div/div[2]/div[1]";
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

/**
 * 发送POST请求到服务器
 * @param sourceEmailText 要发送的文本数据
 * @returns 返回服务器响应
 */
async function postMail2Server(sourceEmailText: any) {
  language.subscribe(console.log);
  console.log("languge:" + language);
  const mailObjData = { emailContent: sourceEmailText, language: language };
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
  console.log("response:" + response);
  return response;
}
