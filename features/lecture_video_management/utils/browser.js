function initBrowser() {
  const leftButton = document.getElementById("leftPageButton");
  const rightButton = document.getElementById("rightPageButton");
  const reloadButton = document.getElementById("reloadPageButton");
  const searchButton = document.getElementById("searchPageButton");

  const webView = document.getElementById("searchWebView");

  leftButton.addEventListener("click", () => {
    webView.goBack();
  });

  rightButton.addEventListener("click", () => {
    webView.goForward();
  });

  reloadButton.addEventListener("click", () => {
    webView.reload();
  });

  function isValidURL(string) {
    const urlPattern =
      /^(https?:\/\/)?([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
    return urlPattern.test(string);
  }

  async function handleURL(url) {
    const searchQuery = "https://duckduckgo.com/?t=h_&q=";
    const PATH_TO_SORRY_PAGE = "./pages/sorryPage.html";

    if (!isValidURL(url)) {
      return searchQuery + url;
    }

    // Validate the URL
    try {
      const response = await fetch(url, { method: "HEAD" });

      // if ok then return it . Else return the link to sorry page
      if (response.ok) {
        console.log("wtf ?");

        return url;
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.error(
        `Failed to connect to ${url}. Falling back to default search engine.`,
        error,
      );
    }

    return PATH_TO_SORRY_PAGE;
  }

  searchButton.addEventListener("click", async () => {
    const url = document.getElementById("searchPageInput").value;
    const result = await handleURL(url);

    webView.src = result;
  });
}

initBrowser();
