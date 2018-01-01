// host this as public github gist

function getRobinhoodAccessToken() {
  // 1. get token from window object set by
  // 2. unhash
  // 3. works here
  return window.robinhoodPortfolio.robinhoodAccessToken;
}
