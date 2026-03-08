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
    "revision": "ae232d06396a5ce1e3de441a68b0aa81"
  }, {
    "url": "assets/zap-DFVZx0rD.js",
    "revision": null
  }, {
    "url": "assets/WaiterTerminalPage-CFhhxchj.js",
    "revision": null
  }, {
    "url": "assets/utensils-CTGx_rJO.js",
    "revision": null
  }, {
    "url": "assets/utensils-crossed-DUayykPd.js",
    "revision": null
  }, {
    "url": "assets/users-C6R2hVR9.js",
    "revision": null
  }, {
    "url": "assets/useRazorpay-B7iPi3mY.js",
    "revision": null
  }, {
    "url": "assets/user-RhaHN6Ao.js",
    "revision": null
  }, {
    "url": "assets/user-plus-DTYzfYZV.js",
    "revision": null
  }, {
    "url": "assets/trash-2-DdtbHL7I.js",
    "revision": null
  }, {
    "url": "assets/TransactionsPage-BlGy7YEe.js",
    "revision": null
  }, {
    "url": "assets/timer-yc5UfPDH.js",
    "revision": null
  }, {
    "url": "assets/textarea-Druq0vA7.js",
    "revision": null
  }, {
    "url": "assets/TestimonialsSection-Bce5vSwc.js",
    "revision": null
  }, {
    "url": "assets/tabs-1xxHH2UF.js",
    "revision": null
  }, {
    "url": "assets/table-Da9GA8IO.js",
    "revision": null
  }, {
    "url": "assets/table-BDSFpZKY.js",
    "revision": null
  }, {
    "url": "assets/SubscriptionExpiredPage-GhJlH0NB.js",
    "revision": null
  }, {
    "url": "assets/store-C95X6URu.js",
    "revision": null
  }, {
    "url": "assets/StaffSubscriptionExpiredPage-IWEvNIxi.js",
    "revision": null
  }, {
    "url": "assets/StaffManagementPage-ccROHLsR.js",
    "revision": null
  }, {
    "url": "assets/skeleton-DorroV9I.js",
    "revision": null
  }, {
    "url": "assets/shopping-cart-Du-kqa9R.js",
    "revision": null
  }, {
    "url": "assets/shield-check-yDSke7rB.js",
    "revision": null
  }, {
    "url": "assets/SettingsPage-CnLljhQ4.js",
    "revision": null
  }, {
    "url": "assets/separator-DjKCyYhH.js",
    "revision": null
  }, {
    "url": "assets/select-N4XA0g75.js",
    "revision": null
  }, {
    "url": "assets/search-B-d7_Zeo.js",
    "revision": null
  }, {
    "url": "assets/scroll-area-DqLg8RKy.js",
    "revision": null
  }, {
    "url": "assets/refresh-cw-CLv08hzv.js",
    "revision": null
  }, {
    "url": "assets/receipt-Bo1pRbya.js",
    "revision": null
  }, {
    "url": "assets/radio-group-Y1GTMUDY.js",
    "revision": null
  }, {
    "url": "assets/QueueRegistrationPage-DT6TPT04.js",
    "revision": null
  }, {
    "url": "assets/QueuePage-B_1Enr1L.js",
    "revision": null
  }, {
    "url": "assets/QRCodesPage-C_rWG08D.js",
    "revision": null
  }, {
    "url": "assets/purify.es-C_uT9hQ1.js",
    "revision": null
  }, {
    "url": "assets/PublicMenuPage-lVmJChBx.js",
    "revision": null
  }, {
    "url": "assets/plus-BUtzwQ-i.js",
    "revision": null
  }, {
    "url": "assets/phone-CEDmiqzl.js",
    "revision": null
  }, {
    "url": "assets/OnboardingPage-g0klmNRh.js",
    "revision": null
  }, {
    "url": "assets/MenuPage-wt1SWqhq.js",
    "revision": null
  }, {
    "url": "assets/map-pin-DDchMlOj.js",
    "revision": null
  }, {
    "url": "assets/mail-RDnwPFZh.js",
    "revision": null
  }, {
    "url": "assets/LoginPage-DwZMD5Ao.js",
    "revision": null
  }, {
    "url": "assets/log-out-CJ39IIJZ.js",
    "revision": null
  }, {
    "url": "assets/LiveOrdersPage-DbyMb_7-.js",
    "revision": null
  }, {
    "url": "assets/layers-Ch6sgnCH.js",
    "revision": null
  }, {
    "url": "assets/LanguageSelector-BoeUQ8dM.js",
    "revision": null
  }, {
    "url": "assets/LandingPage-C85XqgjW.js",
    "revision": null
  }, {
    "url": "assets/label-BsJn8qSj.js",
    "revision": null
  }, {
    "url": "assets/kot-data-BfZJiwRN.js",
    "revision": null
  }, {
    "url": "assets/KitchenKDSPage-D2ucVVK8.js",
    "revision": null
  }, {
    "url": "assets/InventoryPage-DQeT3k1a.js",
    "revision": null
  }, {
    "url": "assets/input-CAoJTGG1.js",
    "revision": null
  }, {
    "url": "assets/index.es-C7PCXeMi.js",
    "revision": null
  }, {
    "url": "assets/index-Bz_49RwU.js",
    "revision": null
  }, {
    "url": "assets/index-BtIv58t5.js",
    "revision": null
  }, {
    "url": "assets/index-BS6bDabe.js",
    "revision": null
  }, {
    "url": "assets/index-ae__rz34.css",
    "revision": null
  }, {
    "url": "assets/image-DjZDy2g4.js",
    "revision": null
  }, {
    "url": "assets/html2canvas.esm-CBrSDip1.js",
    "revision": null
  }, {
    "url": "assets/globe-CRB9sov_.js",
    "revision": null
  }, {
    "url": "assets/formatDistanceToNow-Crqrgwto.js",
    "revision": null
  }, {
    "url": "assets/format-K_dhCO_h.js",
    "revision": null
  }, {
    "url": "assets/FoodShowcaseSection-DMmsCAh0.js",
    "revision": null
  }, {
    "url": "assets/FloorMapPage--wox5ETl.js",
    "revision": null
  }, {
    "url": "assets/FeaturesSection-QU4yeJs_.js",
    "revision": null
  }, {
    "url": "assets/eye-CI_NwmoW.js",
    "revision": null
  }, {
    "url": "assets/external-link-Bx4tiBnb.js",
    "revision": null
  }, {
    "url": "assets/en-US-DsS4pHqz.js",
    "revision": null
  }, {
    "url": "assets/download-DhHmxXXp.js",
    "revision": null
  }, {
    "url": "assets/dollar-sign-CStztV54.js",
    "revision": null
  }, {
    "url": "assets/differenceInMilliseconds-Q6T7lIof.js",
    "revision": null
  }, {
    "url": "assets/dialog-DPwESuR6.js",
    "revision": null
  }, {
    "url": "assets/desktoppos-j2NoeNVp.js",
    "revision": null
  }, {
    "url": "assets/DashboardPage-BoZNVWsB.js",
    "revision": null
  }, {
    "url": "assets/DashboardLayout-C85ZSJ8C.js",
    "revision": null
  }, {
    "url": "assets/crown-BVIUHGgG.js",
    "revision": null
  }, {
    "url": "assets/credit-card-dndQPlfV.js",
    "revision": null
  }, {
    "url": "assets/copy-DXegUy-B.js",
    "revision": null
  }, {
    "url": "assets/ContactSection-D8fr8HYY.js",
    "revision": null
  }, {
    "url": "assets/constants-CzULGhDK.js",
    "revision": null
  }, {
    "url": "assets/clock-DG4nY2jJ.js",
    "revision": null
  }, {
    "url": "assets/circle-x-ogZ9ElKK.js",
    "revision": null
  }, {
    "url": "assets/circle-user-D40ywQRI.js",
    "revision": null
  }, {
    "url": "assets/circle-check-CO5fCky5.js",
    "revision": null
  }, {
    "url": "assets/chevron-right-CzS4S1QJ.js",
    "revision": null
  }, {
    "url": "assets/chevron-left-CCyTwrQq.js",
    "revision": null
  }, {
    "url": "assets/chevron-down-Dk36q7j9.js",
    "revision": null
  }, {
    "url": "assets/chef-hat-CeSEQ-TM.js",
    "revision": null
  }, {
    "url": "assets/checkbox-D1_KCMVe.js",
    "revision": null
  }, {
    "url": "assets/check-BYW1QlCl.js",
    "revision": null
  }, {
    "url": "assets/chart-column-DabS41ZY.js",
    "revision": null
  }, {
    "url": "assets/CancelledOrdersPage-BqyIqgnG.js",
    "revision": null
  }, {
    "url": "assets/calendar-CNaxcEJ6.js",
    "revision": null
  }, {
    "url": "assets/bell-Dl4E6DAX.js",
    "revision": null
  }, {
    "url": "assets/BarChart-DB-PwBrB.js",
    "revision": null
  }, {
    "url": "assets/badge-B6T_Jqoy.js",
    "revision": null
  }, {
    "url": "assets/arrow-left-B5H1igLA.js",
    "revision": null
  }, {
    "url": "assets/api-DBxQ1CN5.js",
    "revision": null
  }, {
    "url": "assets/AnalyticsPage-CV0kvqwX.js",
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
