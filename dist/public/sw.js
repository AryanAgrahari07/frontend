/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-5a5d9309'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "index.html",
    "revision": "160940160d08124c5472228560804c34"
  }, {
    "url": "assets/zap-D1XOCof0.js",
    "revision": null
  }, {
    "url": "assets/WaiterTerminalPage-DB3CfuWD.js",
    "revision": null
  }, {
    "url": "assets/utensils-DzorYFAd.js",
    "revision": null
  }, {
    "url": "assets/utensils-crossed-Dsy_0G56.js",
    "revision": null
  }, {
    "url": "assets/users-Bl4bCBUx.js",
    "revision": null
  }, {
    "url": "assets/useRazorpay-Cxa9_oZR.js",
    "revision": null
  }, {
    "url": "assets/user-plus-BRarESW-.js",
    "revision": null
  }, {
    "url": "assets/user-DgOHUnWA.js",
    "revision": null
  }, {
    "url": "assets/trash-2-DP-lVIzi.js",
    "revision": null
  }, {
    "url": "assets/TransactionsPage-FFdxr2NU.js",
    "revision": null
  }, {
    "url": "assets/timer-Dt8Ywr9g.js",
    "revision": null
  }, {
    "url": "assets/textarea-BCyBW-W8.js",
    "revision": null
  }, {
    "url": "assets/TestimonialsSection-Dt-bPNrX.js",
    "revision": null
  }, {
    "url": "assets/tabs-GLzWpIfv.js",
    "revision": null
  }, {
    "url": "assets/table-esUui_VC.js",
    "revision": null
  }, {
    "url": "assets/table-C8v0d9wG.js",
    "revision": null
  }, {
    "url": "assets/SubscriptionExpiredPage-WTO58kAI.js",
    "revision": null
  }, {
    "url": "assets/store-CEVkrbIm.js",
    "revision": null
  }, {
    "url": "assets/StaffSubscriptionExpiredPage-C76JSLD8.js",
    "revision": null
  }, {
    "url": "assets/StaffManagementPage-WpgUfD4D.js",
    "revision": null
  }, {
    "url": "assets/skeleton-CMQK697E.js",
    "revision": null
  }, {
    "url": "assets/shopping-cart-DRn2-KSK.js",
    "revision": null
  }, {
    "url": "assets/shield-check-BCFT-4jD.js",
    "revision": null
  }, {
    "url": "assets/SettingsPage-C0rFLRTf.js",
    "revision": null
  }, {
    "url": "assets/separator-Dgq6B7ug.js",
    "revision": null
  }, {
    "url": "assets/select-Bb0235GJ.js",
    "revision": null
  }, {
    "url": "assets/search-cHQxD3yb.js",
    "revision": null
  }, {
    "url": "assets/scroll-area-BSjGhI0C.js",
    "revision": null
  }, {
    "url": "assets/refresh-cw-BlsJhwDZ.js",
    "revision": null
  }, {
    "url": "assets/receipt-DXpCrt7l.js",
    "revision": null
  }, {
    "url": "assets/radio-group-8Rx9XBw7.js",
    "revision": null
  }, {
    "url": "assets/QueueRegistrationPage-e598RnZ5.js",
    "revision": null
  }, {
    "url": "assets/QueuePage-BtlT_rri.js",
    "revision": null
  }, {
    "url": "assets/QRCodesPage-TxFHuYIk.js",
    "revision": null
  }, {
    "url": "assets/purify.es-C_uT9hQ1.js",
    "revision": null
  }, {
    "url": "assets/PublicMenuPage-C3Zbj-w0.js",
    "revision": null
  }, {
    "url": "assets/plus-BXsyfK3J.js",
    "revision": null
  }, {
    "url": "assets/phone-D3IWwnhp.js",
    "revision": null
  }, {
    "url": "assets/OnboardingPage-DmRbnbij.js",
    "revision": null
  }, {
    "url": "assets/MenuPage-Cxdtw3gW.js",
    "revision": null
  }, {
    "url": "assets/map-pin-Br39RZDp.js",
    "revision": null
  }, {
    "url": "assets/mail-BbH92cSD.js",
    "revision": null
  }, {
    "url": "assets/LoginPage-BqwEx2qH.js",
    "revision": null
  }, {
    "url": "assets/log-out-CW78vx7n.js",
    "revision": null
  }, {
    "url": "assets/LiveOrdersPage-uZKeTY3B.js",
    "revision": null
  }, {
    "url": "assets/layers-B_0vQtnk.js",
    "revision": null
  }, {
    "url": "assets/LanguageSelector-ECsPNVfY.js",
    "revision": null
  }, {
    "url": "assets/LandingPage-Ct4WLvq9.js",
    "revision": null
  }, {
    "url": "assets/label-BEWeN70n.js",
    "revision": null
  }, {
    "url": "assets/kot-data-BOfpsrFX.js",
    "revision": null
  }, {
    "url": "assets/KitchenKDSPage-Di44-Ko3.js",
    "revision": null
  }, {
    "url": "assets/InventoryPage-CVQuAADK.js",
    "revision": null
  }, {
    "url": "assets/input-BSHJfj1Y.js",
    "revision": null
  }, {
    "url": "assets/index.es-CxD7Zx12.js",
    "revision": null
  }, {
    "url": "assets/index-D8omvCMt.css",
    "revision": null
  }, {
    "url": "assets/index-Cqtsn-jn.js",
    "revision": null
  }, {
    "url": "assets/index-CbqWPerb.js",
    "revision": null
  }, {
    "url": "assets/index-Bg-A-dY4.js",
    "revision": null
  }, {
    "url": "assets/image-CpFyDu6b.js",
    "revision": null
  }, {
    "url": "assets/html2canvas.esm-CBrSDip1.js",
    "revision": null
  }, {
    "url": "assets/globe-C7xFEYzG.js",
    "revision": null
  }, {
    "url": "assets/formatDistanceToNow-Crqrgwto.js",
    "revision": null
  }, {
    "url": "assets/format-K_dhCO_h.js",
    "revision": null
  }, {
    "url": "assets/FoodShowcaseSection-DtXYI7e_.js",
    "revision": null
  }, {
    "url": "assets/FloorMapPage-CMfSuPpv.js",
    "revision": null
  }, {
    "url": "assets/FeaturesSection-dXu_mdPI.js",
    "revision": null
  }, {
    "url": "assets/eye-BSepOJpl.js",
    "revision": null
  }, {
    "url": "assets/external-link-m_8tCRy0.js",
    "revision": null
  }, {
    "url": "assets/en-US-DsS4pHqz.js",
    "revision": null
  }, {
    "url": "assets/download-B-jYr5P8.js",
    "revision": null
  }, {
    "url": "assets/dollar-sign-BE1MSWF8.js",
    "revision": null
  }, {
    "url": "assets/differenceInMilliseconds-Q6T7lIof.js",
    "revision": null
  }, {
    "url": "assets/dialog-BfQusleG.js",
    "revision": null
  }, {
    "url": "assets/desktoppos-CbLKB2tN.js",
    "revision": null
  }, {
    "url": "assets/DashboardPage-Dt0asFwW.js",
    "revision": null
  }, {
    "url": "assets/DashboardLayout-BFzCQvE0.js",
    "revision": null
  }, {
    "url": "assets/crown-BQeSTO2H.js",
    "revision": null
  }, {
    "url": "assets/credit-card-9Cue0tPR.js",
    "revision": null
  }, {
    "url": "assets/copy-nbsZUMS0.js",
    "revision": null
  }, {
    "url": "assets/ContactSection-DxY52iAC.js",
    "revision": null
  }, {
    "url": "assets/constants-CzULGhDK.js",
    "revision": null
  }, {
    "url": "assets/clock-E0t42n9I.js",
    "revision": null
  }, {
    "url": "assets/circle-x-CbT8QZBT.js",
    "revision": null
  }, {
    "url": "assets/circle-user-Dy3LBT4U.js",
    "revision": null
  }, {
    "url": "assets/circle-minus-BikmjeD6.js",
    "revision": null
  }, {
    "url": "assets/circle-check-DNYrKKes.js",
    "revision": null
  }, {
    "url": "assets/chevron-right-Bo0YCIzT.js",
    "revision": null
  }, {
    "url": "assets/chevron-left-tfXcKt5O.js",
    "revision": null
  }, {
    "url": "assets/chevron-down-R9Q0G_IE.js",
    "revision": null
  }, {
    "url": "assets/chef-hat-D_sndlkP.js",
    "revision": null
  }, {
    "url": "assets/checkbox-C_g9kEv_.js",
    "revision": null
  }, {
    "url": "assets/check-Wg2Mkavy.js",
    "revision": null
  }, {
    "url": "assets/chart-column-BlgGDQNi.js",
    "revision": null
  }, {
    "url": "assets/CancelledOrdersPage-BN29c4FX.js",
    "revision": null
  }, {
    "url": "assets/calendar-BlfuoR3z.js",
    "revision": null
  }, {
    "url": "assets/bell-xjS7TQWu.js",
    "revision": null
  }, {
    "url": "assets/BarChart-CCUE3dAK.js",
    "revision": null
  }, {
    "url": "assets/badge-B2wlF2vx.js",
    "revision": null
  }, {
    "url": "assets/arrow-left--r0e3bKW.js",
    "revision": null
  }, {
    "url": "assets/api-w0JLchyZ.js",
    "revision": null
  }, {
    "url": "assets/AnalyticsPage-DNnBbBbN.js",
    "revision": null
  }, {
    "url": "favicon.png",
    "revision": "ed6740d90cd839744d48523d4991a6f7"
  }, {
    "url": "pwa-192x192.png",
    "revision": "ed6740d90cd839744d48523d4991a6f7"
  }, {
    "url": "pwa-512x512.png",
    "revision": "ed6740d90cd839744d48523d4991a6f7"
  }, {
    "url": "manifest.webmanifest",
    "revision": "3afd52c29c53fff3691594654031ff42"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
