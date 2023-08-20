/**
 * First detect is it admin dashboard?
 * if so then check is user already exist?
 * If not then send a request to wp-admin.ajax
 * then save the successful result to the list
 */
let wpAdmin = document.querySelector(".wp-admin");
let lmnExt = document.querySelector("#lmnExt");
let email = document.getElementById("lmnEmail");
let siteurl = document.getElementById("lmnSiteUrl");
let lmnExpiration = document.getElementById("lmnExpiration");

if (
  wpAdmin &&
  typeof wpAdmin !== "undefined" &&
  lmnExt &&
  typeof lmnExt !== "undefined" &&
  email &&
  typeof email !== "undefined" &&
  siteurl &&
  typeof siteurl !== "undefined"
) {
  // eslint-disable-next-line no-undef
  chrome.storage.local.get({ loginMeNowTokens: {} }, function (data) {
    let tokens = data.loginMeNowTokens;
    if (tokens) {
      let filtered = Object.entries(tokens).filter(
        ([key, website]) =>
          website.user_email.includes(email.dataset.email) &&
          website.site_url.includes(siteurl.dataset.siteurl)
      );
      if (typeof filtered[0] === "undefined" || !filtered[0]) {
        console.log(typeof filtered[0])
        console.log(!filtered[0])
        lmnExt.style.display = "flex";
      }
    }
  });

  let lmnSave = document.getElementById("lmn-save");
  let security = document.getElementById("lmnSecurity");
  let ajaxUrl = document.getElementById("lmnAjaxUrl");

  if (
    typeof lmnSave !== "undefined" ||
    lmnSave ||
    typeof security !== "undefined" ||
    security
  ) {
    lmnSave.addEventListener("click", function (e) {
      let expiration = lmnExpiration.value;

      let formdata = new FormData();
      formdata.append("action", "login_me_now_browser_token_generate");
      formdata.append("security", security.dataset.security);
      formdata.append("expiration", expiration);
      formdata.append("additional_data", true);

      let requestOptions = {
        method: "POST",
        body: formdata,
      };
      fetch(ajaxUrl.dataset.ajaxurl, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.data.link) {
            let unique = Date.now();
            // eslint-disable-next-line no-undef
            chrome.storage.local.get({ loginMeNowTokens: {} }, function (data) {
              let tokens = data.loginMeNowTokens ? data.loginMeNowTokens : {};
              tokens[unique] = result.data.link;
              // eslint-disable-next-line no-undef
              chrome.storage.local.set({ loginMeNowTokens: tokens });
              lmnExt.style.bottom = "-60px";
              setTimeout(() => {
                lmnExt.style.display = "none";
              }, 1000);
            });
          }
        });
    });
  }
}
