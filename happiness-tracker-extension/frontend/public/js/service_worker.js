const getFromStorage = (arr) =>
  new Promise((resolve) => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(arr, (res) => resolve(res));
  });

const syncPlanner = async () => {
  // eslint-disable-next-line no-undef
  let storageRes = await getFromStorage(["payload", "user", "userId", "date"]);

  const headers = new Headers();
  headers.append(
    "Authorization",
    `Bearer ${storageRes.user && storageRes.user.token}`
  );

  const requestOptions = {
    method: "PUT",
    headers: headers,
    body: storageRes.payload,
    redirect: "follow",
  };

  fetch(
    `http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/plans/${storageRes.userId}/${storageRes.date}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log("Updated on tab close");
      console.log(result);
    })
    .catch((error) => console.log("error", error));
};

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log(msg);
  if (msg.command === "savePlanner") {
    console.log({ ...msg.data, tabId: sender.tab.id });
    // eslint-disable-next-line no-undef
    chrome.storage.local.set({ ...msg.data, tabId: sender.tab.id });
  }
  sendResponse(true);
});

// eslint-disable-next-line no-undef
chrome.tabs.onRemoved.addListener(async (tabId) => {
  let storageRes = await getFromStorage("tabId");

  if (storageRes.tabId === tabId) syncPlanner();
});
