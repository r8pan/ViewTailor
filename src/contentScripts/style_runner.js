(async () => {
  const src = chrome.extension.getURL('src/contentScripts/style.js');
  const contentScript = await import(src);
  contentScript.main();
})();
