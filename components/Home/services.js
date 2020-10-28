export const getWithdrawLinkMetadata = (includeLnurl = false) => {
  const withdrawId = "mFSVmMQmjNxmua9KdrgQpC";
  const fields = ["used", "uses"];

  if (includeLnurl) {
    fields.push("lnurl");
  }

  return fetch(
    `https://samsamskies-proxy-27d3u.ondigitalocean.app/withdraw/api/v1/links/${withdrawId}?fields=${fields.join()}`
  ).then((res) => res.json());
};
