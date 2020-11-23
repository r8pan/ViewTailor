(async () => {
  const src = chrome.extension.getURL('style.js');
  const contentScript = await import(src);
  contentScript.main();
})();
