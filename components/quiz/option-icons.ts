import {
  Heart, Home, Armchair, PartyPopper, Users, Briefcase, Baby, Sparkles, PawPrint,
  Cake, TreePine, CalendarHeart, Flower2, Gem, GraduationCap, Gift,
  Coffee, Wine, ChefHat, Candy, Sprout, Wrench, Tent, Dumbbell, Car, BookOpen, Clapperboard,
  Dices, Gamepad2, Smartphone, Shirt, Lamp, Palette, Plane, HelpCircle, Hammer, UtensilsCrossed, Lightbulb,
  type LucideIcon,
} from 'lucide-react'

// Ikony u možností kvízu, podle hodnoty odpovědi. Jednotná tenká linka místo emoji,
// která vypadají na každém telefonu jinak. Věk, rozpočet, pohlaví a kraj ikonu nemají, stačí text.
export const OPTION_ICONS: Record<string, LucideIcon> = {
  // komu
  partner: Heart, parent: Home, grandparent: Armchair, friend: PartyPopper, sibling: Users,
  colleague: Briefcase, child: Baby, self: Sparkles, pet: PawPrint,
  // příležitost
  birthday: Cake, christmas: TreePine, nameday: CalendarHeart, valentine: Heart, mothers_day: Flower2,
  wedding: Gem, graduation: GraduationCap, just_because: Gift,
  // záliby
  kava: Coffee, vino: Wine, vareni: ChefHat, sladke: Candy, zahrada: Sprout, kutil: Wrench, priroda: Tent,
  sport: Dumbbell, auta: Car, knihy: BookOpen, hudba_film: Clapperboard, deskovky: Dices, pc_hry: Gamepad2,
  technika: Smartphone, moda: Shirt, krasa: Sparkles, bydleni: Lamp, tvoreni: Palette, zvirata: PawPrint,
  cestovani: Plane, unknown: HelpCircle,
  // co potěší
  practical: Hammer, aesthetic: Gem, adventurous: PartyPopper, food_drink: UtensilsCrossed, comfort: Heart,
  intellectual: Lightbulb, any_style: HelpCircle,
}
