 async function fetchWithRetry(
    url: string,
    options: RequestInit = {},
    config: RequestConfig = {}
  ) {
    const { retries = 3, retryDelay = 1000 } = config;
  
    for (let i = 0; i < retries; i++) {
      try {
        const resp = await fetch(url, options);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return await resp.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, retryDelay * 2 ** i));
      }
    }
  }
  // 定义要post的数据
  interface RequestConfig {
    retries?: number;
    retryDelay?: number;
  }

   function waitForPageLoad() {
    // 添加等待页面加载的函数
    console.log("waitForPageLoad start ...");
    // 如果页面已经加载完成，直接返回
    if (document.readyState === "complete") {
      console.log("waitForPageLoad ok");
      return;
    }
  
    // 否则等待 load 事件
    return new Promise<void>((resolve) => {
      console.log("waitForPageLoad addEventListener");
      window.addEventListener("load", () => {
        resolve();
      });
    });
  }

  

export  {waitForPageLoad,fetchWithRetry};