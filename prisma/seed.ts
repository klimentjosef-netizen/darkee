import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PRODUCTS = [
  { id:"d001", name:"Balíček pivních specialit z celého světa", price:785, url:"https://www.darek.cz/osobni-darky-k22608/pivo-a-pivni-speciality-k23269/balik-pivnich-specialit", shop:"Darek.cz", rating:4.8, gender_fit:["male","neutral"], age_range:["young_adult","adult","senior"], interest_tags:["food"], style_fit:["comfort","practical"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:true },
  { id:"d002", name:"Belgické pivní speciály Van Steenberge – 6 ks", price:665, url:"https://www.darek.cz/osobni-darky-k22608/pivo-a-pivni-speciality-k23269/belgicke-pivni-specialy", shop:"Darek.cz", rating:4.9, gender_fit:["male","neutral"], age_range:["young_adult","adult","senior"], interest_tags:["food"], style_fit:["comfort","intellectual"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d003", name:"Rocková pivní sada AC/DC & Iron Maiden Trooper", price:685, url:"https://www.darek.cz/osobni-darky-k22608/darky-pro-muzikanty-k23466/rockova-pivni-sada", shop:"Darek.cz", rating:4.9, gender_fit:["male","neutral"], age_range:["young_adult","adult"], interest_tags:["food","games"], style_fit:["adventurous","comfort"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d004", name:"České pivní speciály – Na zdraví!", price:445, url:"https://www.darek.cz/ceske-pivni-specialy", shop:"Darek.cz", rating:4.7, gender_fit:["male","neutral"], age_range:["young_adult","adult","senior"], interest_tags:["food"], style_fit:["practical","comfort"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:true },
  { id:"d005", name:"Dárková sada pro vousáče Byjome Gentleman", price:1385, url:"https://www.darek.cz/darky-pro-muze/byjome-gentleman", shop:"Darek.cz", rating:5.0, gender_fit:["male"], age_range:["young_adult","adult"], interest_tags:["fashion","wellness"], style_fit:["aesthetic","practical"], occasion_fit:["birthday","christmas","valentine"], gift_type:"physical", is_personalizable:false, is_local:true },
  { id:"d006", name:"Pánský parfém Jack Saloon – orientální vůně", price:1490, url:"https://www.darek.cz/darky-pro-muze/jack-saloon", shop:"Darek.cz", rating:4.8, gender_fit:["male"], age_range:["young_adult","adult","senior"], interest_tags:["fashion"], style_fit:["aesthetic","comfort"], occasion_fit:["birthday","christmas","valentine"], gift_type:"physical", is_personalizable:false, is_local:true },
  { id:"d007", name:"Dárkový set pro muže – 2× sprchový gel 250 ml", price:285, url:"https://www.darek.cz/osobni-darky-k22608/vtipne-darky-pro-muze-i-zeny-k23615/sprchovy-gel", shop:"Darek.cz", rating:4.8, gender_fit:["male"], age_range:["young_adult","adult","senior"], interest_tags:["wellness"], style_fit:["practical","comfort"], occasion_fit:["birthday","christmas","just_because","mothers_day"], gift_type:"physical", is_personalizable:false, is_local:true },
  { id:"d008", name:"Elegantní stříbrná souprava Srdce", price:1185, url:"https://www.darek.cz/darky-pro-zeny/stribrna-souprava-srdce", shop:"Darek.cz", rating:4.9, gender_fit:["female"], age_range:["teen","young_adult","adult","senior"], interest_tags:["fashion"], style_fit:["aesthetic","comfort"], occasion_fit:["birthday","christmas","valentine","wedding","mothers_day"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d009", name:"Klíčenka Andílek Valerie – luxusní přívěsek", price:415, url:"https://www.darek.cz/osobni-darky-k22608/klicenka-andilek", shop:"Darek.cz", rating:5.0, gender_fit:["female","neutral"], age_range:["young_adult","adult","senior","elderly"], interest_tags:["fashion"], style_fit:["aesthetic","comfort"], occasion_fit:["birthday","christmas","just_because","mothers_day"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d010", name:"Bohemia – Přírodní kosmetika Levandule", price:395, url:"https://www.darek.cz/zdravi-odpocinek-relax-k23716/bohemia-levandule", shop:"Darek.cz", rating:4.7, gender_fit:["female","neutral"], age_range:["young_adult","adult","senior","elderly"], interest_tags:["wellness","fashion"], style_fit:["comfort","aesthetic"], occasion_fit:["birthday","christmas","mothers_day","just_because"], gift_type:"physical", is_personalizable:false, is_local:true },
  { id:"d011", name:"Dárková sada pro maminku – 6 dárků v balení", price:895, url:"https://www.darek.cz/zdravi-odpocinek-relax-k23716/sada-pro-maminku", shop:"Darek.cz", rating:4.8, gender_fit:["female"], age_range:["adult","senior","elderly"], interest_tags:["wellness","home"], style_fit:["comfort","practical"], occasion_fit:["birthday","christmas","mothers_day"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d012", name:"Masážní polštářek na záda – relaxace celého těla", price:645, url:"https://www.darek.cz/zdravi-odpocinek-relax-k23716/masazni-polistarek", shop:"Darek.cz", rating:4.9, gender_fit:["female","male","neutral"], age_range:["adult","senior","elderly"], interest_tags:["wellness","sport"], style_fit:["practical","comfort"], occasion_fit:["birthday","christmas","mothers_day","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d013", name:"Čajová kolekce Aroma Exclusive – luxusní dárkové balení", price:475, url:"https://www.darek.cz/osobni-darky-k22608/darkove-caje-k23458/aroma-exclusive", shop:"Darek.cz", rating:5.0, gender_fit:["female","male","neutral"], age_range:["young_adult","adult","senior","elderly"], interest_tags:["food","wellness"], style_fit:["aesthetic","comfort","intellectual"], occasion_fit:["birthday","christmas","mothers_day","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d014", name:"Čaj Richard Royal – dárková sada designové balení", price:495, url:"https://www.darek.cz/osobni-darky-k22608/darkove-caje-k23458/richard-royal", shop:"Darek.cz", rating:4.8, gender_fit:["female","male","neutral"], age_range:["adult","senior","elderly"], interest_tags:["food"], style_fit:["aesthetic","comfort"], occasion_fit:["birthday","christmas","mothers_day","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d015", name:"Čajová souprava Japandi – termoizolační", price:985, url:"https://www.darek.cz/osobni-darky-k22608/darkove-caje-k23458/japandi", shop:"Darek.cz", rating:4.7, gender_fit:["female","male","neutral"], age_range:["young_adult","adult","senior"], interest_tags:["food","home"], style_fit:["aesthetic","intellectual"], occasion_fit:["birthday","christmas","wedding","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d016", name:"Smaltovaná cedule s textem dle přání – 400×200 mm", price:890, url:"https://www.darek.cz/smaltovana-cedule", shop:"Darek.cz", rating:4.9, gender_fit:["female","male","neutral"], age_range:["young_adult","adult","senior","elderly"], interest_tags:["home","crafts"], style_fit:["aesthetic","practical"], occasion_fit:["birthday","christmas","wedding","valentine","just_because"], gift_type:"physical", is_personalizable:true, is_local:true },
  { id:"d017", name:"Slánka a pepřenka – houpačka Balvi design", price:565, url:"https://www.darek.cz/best-darky-v676/slanka-peprenka", shop:"Darek.cz", rating:5.0, gender_fit:["female","neutral"], age_range:["young_adult","adult","senior"], interest_tags:["home","food"], style_fit:["aesthetic","comfort"], occasion_fit:["birthday","christmas","wedding","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d018", name:"Rotující fotokostka s hodinami – 5 fotek 10×10 cm", price:438, url:"https://www.darek.cz/best-darky-v676/fotokostka", shop:"Darek.cz", rating:5.0, gender_fit:["female","male","neutral"], age_range:["young_adult","adult","senior","elderly"], interest_tags:["home","crafts"], style_fit:["comfort","aesthetic"], occasion_fit:["birthday","christmas","valentine","wedding","mothers_day"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d019", name:"Chladič piva BALVI Ice Cold Beer – kovový kyblík", price:590, url:"https://www.darek.cz/best-darky-v676/chladic-piva", shop:"Darek.cz", rating:4.6, gender_fit:["male","neutral"], age_range:["young_adult","adult","senior"], interest_tags:["food","home"], style_fit:["practical","comfort"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d020", name:"Dárkové láhve na alkohol Schody do nebe – masiv", price:895, url:"https://www.darek.cz/osobni-darky-k22608/vtipne-darky-pro-muze-i-zeny-k23615/schody-do-nebe", shop:"Darek.cz", rating:4.8, gender_fit:["male","neutral"], age_range:["young_adult","adult","senior"], interest_tags:["home","food"], style_fit:["aesthetic","adventurous"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:true },
  { id:"d021", name:"Hasičák se skleničkami – minibar dárková sada", price:2745, url:"https://www.darek.cz/osobni-darky-k22608/vtipne-darky-pro-muze-i-zeny-k23615/hasicak", shop:"Darek.cz", rating:4.6, gender_fit:["male","neutral"], age_range:["young_adult","adult","senior"], interest_tags:["home","food","games"], style_fit:["adventurous","comfort"], occasion_fit:["birthday","christmas","valentine"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d022", name:"Láhev na alkohol ve tvaru kytary – skleněná", price:985, url:"https://www.darek.cz/osobni-darky-k22608/darky-pro-muzikanty-k23466/lahev-kytara", shop:"Darek.cz", rating:5.0, gender_fit:["male","female","neutral"], age_range:["young_adult","adult"], interest_tags:["food","games","crafts"], style_fit:["aesthetic","adventurous"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d023", name:"Interaktivní mluvicí glóbus – Kouzelné čtení Albi", price:1714, url:"https://www.darek.cz/darky-pro-deti/k-narozeninam-prilezitost/globus-albi", shop:"Darek.cz", rating:5.0, gender_fit:["female","male","neutral"], age_range:["school","preschool"], interest_tags:["books","games","tech"], style_fit:["intellectual","adventurous"], occasion_fit:["birthday","christmas","graduation"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d024", name:"Antigravitační autíčko Wall Climber – jezdí po stropě", price:485, url:"https://www.darek.cz/darky-pro-deti/k-narozeninam-prilezitost/wall-climber", shop:"Darek.cz", rating:4.5, gender_fit:["male","neutral"], age_range:["school","preschool"], interest_tags:["tech","games"], style_fit:["adventurous","practical"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d025", name:"Pokladnička Krtek – kovová retro kasička", price:158, url:"https://www.darek.cz/darky-pro-deti/pokladnicka-krtek", shop:"Darek.cz", rating:4.8, gender_fit:["female","male","neutral"], age_range:["baby","preschool","school"], interest_tags:["home","crafts"], style_fit:["practical","comfort"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:true },
  { id:"d026", name:"Parker Royal I.M. Black GT – kuličkové pero s gravírováním", price:890, url:"https://www.darek.cz/best-darky-v676/parker-royal", shop:"Darek.cz", rating:4.9, gender_fit:["male","female","neutral"], age_range:["young_adult","adult","senior"], interest_tags:["crafts","books"], style_fit:["aesthetic","practical","intellectual"], occasion_fit:["birthday","graduation","christmas","wedding"], gift_type:"physical", is_personalizable:true, is_local:false },
  { id:"d027", name:"IT hrnek – vtipný dárek pro ajťáka", price:295, url:"https://www.darek.cz/osobni-darky-k22608/darky-k-pocitacum-k23283/it-hrnek", shop:"Darek.cz", rating:4.5, gender_fit:["male","female","neutral"], age_range:["young_adult","adult"], interest_tags:["tech","games"], style_fit:["practical","comfort"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d028", name:"Klíčenka pro motorkáře – kovový přívěsek", price:495, url:"https://www.darek.cz/klicenka-motorkar", shop:"Darek.cz", rating:4.6, gender_fit:["male","neutral"], age_range:["young_adult","adult","senior"], interest_tags:["sport","tech"], style_fit:["adventurous","practical"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d029", name:"Termohrnek Yorkshire Terrier – designový", price:495, url:"https://www.darek.cz/termohrnek-yorkie", shop:"Darek.cz", rating:4.7, gender_fit:["female","neutral"], age_range:["young_adult","adult","senior"], interest_tags:["pets","food"], style_fit:["comfort","aesthetic"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d030", name:"Pantofle Kravička – designový materiál, protiskluzové", price:395, url:"https://www.darek.cz/zdravi-odpocinek-relax-k23716/pantofle-kravicka", shop:"Darek.cz", rating:4.8, gender_fit:["female","neutral"], age_range:["young_adult","adult","senior","elderly"], interest_tags:["wellness","home","pets"], style_fit:["comfort","aesthetic"], occasion_fit:["birthday","christmas","just_because","mothers_day"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d031", name:"Dětské tričko s dinosaurem Lightning REX", price:665, url:"https://www.darek.cz/darky-pro-deti/tricko-rex", shop:"Darek.cz", rating:4.6, gender_fit:["male","neutral"], age_range:["preschool","school"], interest_tags:["fashion","games"], style_fit:["adventurous","comfort"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d032", name:"Tričko Born to Drink – bílé pánské, pivní motiv", price:345, url:"https://www.darek.cz/osobni-darky-k22608/pivo-a-pivni-speciality-k23269/tricko-born-to-drink", shop:"Darek.cz", rating:4.4, gender_fit:["male"], age_range:["young_adult","adult"], interest_tags:["fashion","food","games"], style_fit:["adventurous","comfort"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d033", name:"Stojánek na brýle – polyresinový designový", price:99, url:"https://www.darek.cz/best-darky-v676/stojanek-bryle", shop:"Darek.cz", rating:4.5, gender_fit:["female","male","neutral"], age_range:["adult","senior","elderly"], interest_tags:["home"], style_fit:["practical","comfort"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d034", name:"Keramický stojánek na tužky a brýle", price:229, url:"https://www.darek.cz/best-darky-v676/stojanek-tuzky-bryle", shop:"Darek.cz", rating:5.0, gender_fit:["female","male","neutral"], age_range:["adult","senior","elderly"], interest_tags:["home","crafts"], style_fit:["practical","aesthetic"], occasion_fit:["birthday","christmas","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
  { id:"d035", name:"Keramické servírovací misky FOOD Balvi", price:490, url:"https://www.darek.cz/best-darky-v676/servirovaci-misky", shop:"Darek.cz", rating:4.7, gender_fit:["female","male","neutral"], age_range:["young_adult","adult","senior"], interest_tags:["food","home"], style_fit:["aesthetic","practical"], occasion_fit:["birthday","christmas","wedding","just_because"], gift_type:"physical", is_personalizable:false, is_local:false },
]

async function main() {
  console.log('Seeding database with 35 products...')

  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { url: p.url },
      create: {
        name: p.name,
        price: p.price,
        url: p.url,
        imageUrl: '',
        sourceShop: p.shop,
        categories: p.interest_tags.slice(0, 1),
        ageRange: p.age_range,
        genderFit: p.gender_fit,
        occasionFit: p.occasion_fit,
        interestTags: p.interest_tags,
        styleFit: p.style_fit,
        giftType: p.gift_type,
        isPersonalizable: p.is_personalizable,
        isLocal: p.is_local,
        rating: p.rating,
        popularityScore: p.rating * 20,
        inStock: true,
      },
      update: {
        name: p.name,
        price: p.price,
        rating: p.rating,
      },
    })
  }

  console.log(`Seeded ${PRODUCTS.length} products.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
