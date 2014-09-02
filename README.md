Dashboard Plus for the Envato Market
==============

Dashboard Plus created by @revaxarts

More details here: http://themeforest.net/forums/thread/introducing-dashboard-plus/71870

Install from the Webstore: https://chrome.google.com/webstore/detail/dashboard-plus-for-envato/gcbcdaghonmljaplbpbbimmmfhmhcheh

Development Howto:
-------------

1. Fork a copy of this repo
2. Checkout your copy of the repo to your local computer
3. Uncomment the `//var dashboardplus_base_uri = chrome.extension.getURL('');` code in `script.js` so files are loaded locally.
3. Disable the real Dashboard Plus extension in Google Chrome
4. Click "Developer Mode" at the top of the Google Chrome extension page
5. Click "Load Unpacked Extension" and select the git checkout folder 
6. This should load your own local copy of the extension into Google Chrome
7. Edit the files and use the "Reload" button on the Extension page to test the changes.
8. Once happy with changes, commit them back to your git repo, then do a pull request so I can merge those changes into this repo for everyone. 

