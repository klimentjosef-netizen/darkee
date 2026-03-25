#!/bin/bash
# Batch import all new shops
cd "$(dirname "$0")/.."

import() {
  echo "=== Importing $2 ==="
  npx tsx prisma/import-shop.ts "$1" "$2" $3 2>&1 | tail -3
  echo ""
}

import "https://www.ozonidy.cz/wp-content/XML/heureka_ozonidy-cz_feed-3446488.xml" "Ozonidy.cz"
import "https://www.doogee-shop.cz/heureka/export/products.xml?hash=4yjdggub5qnBgbGHgODyT1" "Doogee-shop.cz"
import "https://www.renovality.cz/heureka/export/products.xml" "Renovality.cz"
import "https://www.bagmaster.cz/export/heureka_cs.xml" "Bagmaster.cz"
import "https://www.fitami.cz/heureka/export/products.xml" "Fitami.cz"
import "https://peterlegwood.cz/data-xml/modul-heureka/heureka-read.php?shop=1&type=productscz&token=3bcf7e806c" "PeterLegwood.cz"
import "https://www.promobily.cz/feeds/zbozi-export-heureka.xml" "ProMobily.cz"
import "https://www.loomah.cz/heureka/export/products.xml?hash=URC1aryRn1FzUsB4KodiqD2D" "Loomah.cz"
import "https://www.baglik.cz/feed-heureka-6pp9xl1wn0.xml" "Báglík.cz"
import "https://www.obujtese.cz/heureka/export/products.xml" "Obujtese.cz"
import "https://www.c-store.cz/fotky38463/xml/heureka_cz.xml" "C-store.cz"
import "https://www.embishop.cz/heureka/export/products.xml" "EmbiShop.cz"
import "https://www.eleven-sportswear.cz/heureka/export/products.xml" "Eleven-sportswear.cz"
import "https://www.homein.cz/heureka/export/products.xml" "Homein.cz"
import "https://www.bagin.cz/heureka/export/products.xml" "Bagin.cz"
import "https://www.vyspimese.cz/heureka/export/products.xml" "Vyspímese.cz"
import "https://www.granulebardog.cz/feed-heureka-48b3db986d.xml" "Granulebardog.cz"
import "https://www.iphonemarket.cz/heureka/export/products.xml?hash=jrc1IMxLqglvYjmK5UW6vy60" "iPhoneMarket.cz"
import "https://www.actimaris.cz/wp-content/uploads/woo-product-feed-pro/xml/1CUBUS04ip34Ppzd9gK88u1jidmZA9Jt.xml" "ActiMaris.cz"

# These need Google format or special handling — try anyway
import "https://www.jabkolevne.cz/google/export/products.xml" "Jabkolevně.cz"
import "https://www.sablio.cz/xml/google" "Sablio.cz"
import "https://www.jbl.cz/gmerchant-JBL-cz.xml" "JBL.cz"

# Large feeds — with max price limit
import "https://www.bscom.cz/exchange/7813c634-8c47-47b7-8d5e-e01fbce7451b/xml/ehub.xml" "Bscom.cz" "--max-price=5000"
import "https://feeds.mergado.com/korus-eshop-cz-heureka-cz-produktovy-cz-0ff1b735266ca12fb4464e7981f1d3bc.xml" "Korus-eshop.cz" "--max-price=5000"

echo "=== ALL DONE ==="
