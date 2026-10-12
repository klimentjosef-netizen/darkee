#!/bin/bash
# Import dárkových obchodů schválených v eHubu (feedy z pm.ehub.cz/feed)
cd "$(dirname "$0")/.."

import() {
  echo "=== Importing $2 ==="
  npx tsx prisma/import-shop.ts "$1" "$2" --limit=1200 --max-price=15000 2>&1 | tail -3
  echo ""
}

import "https://feeds.mergado.com/barman-cz-heureka-cz-cz-950b607197b0b98db134a53dbb4e74f9.xml" "Barman.cz"
import "https://www.cafemontana.cz/heureka/export/products.xml" "Cafemontana.cz"
import "https://www.cheesehouse.cz/cs/43/heureka/export/products.xml" "Cheesehouse.cz"
import "https://kidero.cz/feeds/ehub-s5kxyh82r6eotgy-products.xml" "Kidero.cz"
import "https://feeds.mergado.com/ok-hracky-cz-heureka-cz-71192e613c724f98808998e7d8ba5cc3.xml" "OK-Hračky.cz"
import "https://www.topalkohol.cz/heureka/export/products.xml?hash=6BCaU3lTlDKy2eGPiNTKLak" "Topalkohol.cz"
import "https://www.ocenenavina.cz/heureka/export/products.xml" "OceněnáVína.cz"
import "https://www.danfil.cz/heureka.xml" "Danfil.cz"
import "https://www.brilianty.cz/heureka.xml" "Brilianty.cz"
import "https://www.doke.cz/heureka/export/products.xml?hash=JL4afsKdquie8VL0QTFNs" "Doke.cz"
import "https://feeds.mergado.com/kabelka-cz-heureka-cz-produktovy-cz-4c021c4c529a9422a3b52f2b46b48890.xml" "Kabelka.cz"
import "https://www.kozenezbozisara.cz/feed-heureka-d0y067sf37.xml" "SARAbags.cz"
import "https://www.fantomprint.cz/heureka/export/products.xml" "Fantomprint.cz"
import "https://www.willi.cz/xml/feed_heureka_cs.xml" "Willi.cz"
import "https://www.svetnapoju.cz/heureka.xml" "Světnápojů.cz"
import "https://www.embishop.cz/heureka/export/products.xml" "EmbiShop.cz"
import "https://www.loomah.cz/heureka/export/products.xml?hash=URC1aryRn1FzUsB4KodiqD2D" "Loomah.cz"

echo "=== ALL DONE ==="
