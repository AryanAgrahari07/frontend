import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, GripVertical, Image as ImageIcon, Pencil, Trash2, X, Upload, Search, Sparkles, Loader2, Settings, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/context/AuthContext";
import { useRestaurant, useMenuCategories, useCreateCategory, useUpdateCategory, useCreateMenuItem, useUpdateMenuItem, useUpdateMenuItemAvailability, useDeleteMenuItem, useDeleteCategory, useVariantsForMenuItem, useModifierGroupsForMenuItem } from "@/hooks/api";
import { api } from "@/lib/api";
import type { MenuCategory, MenuItem } from "@/types";
import { MenuCardUploader } from "@/components/menu/MenuCardUploader";
import { ExtractionPreview } from "@/components/menu/ExtractionPreview";
import { MenuItemCustomization } from "@/components/menu/MenuItemCustomization";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

// Prefilled item suggestions
// Comprehensive Indian Restaurant Menu Items
const PREFILLED_ITEMS = [
  // STARTERS - VEG
  { name: "Paneer Tikka", description: "Grilled cottage cheese marinated in tandoori spices and yogurt.", price: 249, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Hara Bhara Kabab", description: "Spinach and green peas patties with aromatic spices.", price: 189, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Veg Seekh Kabab", description: "Minced vegetables with spices grilled on skewers.", price: 199, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Malai Paneer Tikka", description: "Creamy cottage cheese marinated in cheese and spices.", price: 269, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Tandoori Mushroom", description: "Button mushrooms marinated in tandoori masala.", price: 229, image: "https://images.unsplash.com/photo-1621510456681-2330135e5871?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Achari Paneer Tikka", description: "Cottage cheese with pickle spices grilled in tandoor.", price: 259, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Tandoori Aloo", description: "Spiced baby potatoes roasted in tandoor.", price: 169, image: "https://images.unsplash.com/photo-1623806649265-6e9e91e07055?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Dahi Ke Kabab", description: "Hung curd patties with spices and herbs.", price: 199, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Veg Manchurian Dry", description: "Crispy vegetable balls tossed in Indo-Chinese sauce.", price: 179, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chilli Paneer Dry", description: "Cottage cheese cubes in spicy Indo-Chinese sauce.", price: 229, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Gobi Manchurian", description: "Crispy cauliflower florets in tangy sauce.", price: 189, image: "https://images.unsplash.com/photo-1604085792782-8d92f276d7d8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Spring Rolls", description: "Crispy rolls filled with vegetables and noodles.", price: 159, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Honey Chilli Potato", description: "Crispy potato fingers in honey chilli glaze.", price: 179, image: "https://images.unsplash.com/photo-1573858265339-e7bce0a1b5d1?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Chilli", description: "Cottage cheese in spicy bell pepper sauce.", price: 239, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Veg Crispy", description: "Mixed vegetables in crispy batter with sauce.", price: 199, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },

  // STARTERS - NON-VEG
  { name: "Chicken Tikka", description: "Boneless chicken marinated in yogurt and spices.", price: 299, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Tandoori Chicken", description: "Half chicken marinated in tandoori masala.", price: 349, image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Seekh Kabab", description: "Minced chicken with spices grilled on skewers.", price: 279, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Malai Chicken Tikka", description: "Creamy chicken marinated in cheese and herbs.", price: 329, image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Achari Chicken Tikka", description: "Chicken pieces marinated in pickle spices.", price: 309, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Tangdi Kabab", description: "Chicken drumsticks in tandoori marinade.", price: 319, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken 65", description: "Spicy fried chicken with curry leaves.", price: 279, image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chilli Chicken Dry", description: "Crispy chicken in spicy Indo-Chinese sauce.", price: 289, image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Lollipop", description: "Fried chicken wingettes in spicy coating.", price: 299, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mutton Seekh Kabab", description: "Minced mutton with spices grilled to perfection.", price: 379, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Tandoori Prawns", description: "Large prawns marinated in tandoori spices.", price: 449, image: "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Fish Tikka", description: "Boneless fish marinated in yogurt and spices.", price: 379, image: "https://images.unsplash.com/photo-1580959375944-ffbe8276d2b4?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Afghani", description: "Creamy white chicken kababs with mild spices.", price: 339, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mutton Boti Kabab", description: "Tender mutton pieces grilled with spices.", price: 399, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Fish Amritsari", description: "Crispy fried fish in gram flour batter.", price: 359, image: "https://images.unsplash.com/photo-1580959375944-ffbe8276d2b4?auto=format&fit=crop&q=80&w=300&h=300" },

  // MAIN COURSE - VEG
  { name: "Paneer Butter Masala", description: "Cottage cheese in rich tomato-based gravy.", price: 269, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Kadhai Paneer", description: "Cottage cheese with bell peppers in spicy gravy.", price: 259, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Palak Paneer", description: "Cottage cheese in spinach gravy with spices.", price: 249, image: "https://images.unsplash.com/photo-1645177628172-a94c30632395?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Shahi Paneer", description: "Cottage cheese in creamy royal gravy.", price: 279, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Tikka Masala", description: "Grilled cottage cheese in spiced tomato gravy.", price: 289, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Bhurji", description: "Scrambled cottage cheese with onions and spices.", price: 239, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Do Pyaza", description: "Cottage cheese with onions in thick gravy.", price: 259, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Lababdar", description: "Cottage cheese in creamy tomato cashew gravy.", price: 279, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Kolhapuri", description: "Spicy cottage cheese in Kolhapuri style gravy.", price: 269, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Pasanda", description: "Cottage cheese stuffed with dry fruits in gravy.", price: 299, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Dal Makhani", description: "Black lentils slow-cooked in creamy tomato gravy.", price: 229, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Dal Tadka", description: "Yellow lentils tempered with ghee and spices.", price: 189, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Dal Fry", description: "Mixed lentils with onion and tomato tempering.", price: 179, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mix Veg Curry", description: "Seasonal vegetables in spiced gravy.", price: 199, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Veg Kolhapuri", description: "Mixed vegetables in spicy Kolhapuri gravy.", price: 219, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Kadhai Veg", description: "Mixed vegetables with bell peppers in kadhai masala.", price: 209, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Navratan Korma", description: "Nine vegetables and dry fruits in creamy gravy.", price: 249, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Malai Kofta", description: "Cottage cheese and potato balls in creamy gravy.", price: 259, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Dum Aloo Kashmiri", description: "Baby potatoes in rich Kashmiri gravy.", price: 229, image: "https://images.unsplash.com/photo-1589621316382-008455b857cd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Aloo Gobi", description: "Potato and cauliflower dry curry with spices.", price: 189, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Baingan Bharta", description: "Roasted eggplant mashed with spices.", price: 199, image: "https://images.unsplash.com/photo-1589621316382-008455b857cd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Bhindi Masala", description: "Okra cooked with onions and spices.", price: 199, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mushroom Masala", description: "Button mushrooms in spicy onion tomato gravy.", price: 229, image: "https://images.unsplash.com/photo-1621510456681-2330135e5871?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chana Masala", description: "Chickpeas in tangy tomato-based gravy.", price: 179, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Rajma Masala", description: "Kidney beans in thick tomato gravy.", price: 189, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300&h=300" },

  // MAIN COURSE - NON-VEG
  { name: "Butter Chicken", description: "Tender chicken in creamy tomato-based gravy.", price: 329, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Tikka Masala", description: "Grilled chicken in spiced tomato gravy.", price: 319, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Kadhai Chicken", description: "Chicken with bell peppers in kadhai masala.", price: 309, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Curry", description: "Traditional chicken curry with home-style spices.", price: 289, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Do Pyaza", description: "Chicken with onions in thick gravy.", price: 299, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Kolhapuri", description: "Spicy chicken in Kolhapuri style gravy.", price: 319, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Lababdar", description: "Chicken in creamy tomato cashew gravy.", price: 329, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Handi", description: "Chicken cooked in traditional handi with spices.", price: 309, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Bhuna", description: "Dry chicken curry with thick spicy gravy.", price: 299, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Keema", description: "Minced chicken with peas and spices.", price: 289, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mutton Rogan Josh", description: "Tender mutton in aromatic Kashmiri gravy.", price: 399, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mutton Curry", description: "Traditional mutton curry with home-style spices.", price: 379, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Kadhai Mutton", description: "Mutton with bell peppers in kadhai masala.", price: 389, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mutton Do Pyaza", description: "Mutton with onions in thick gravy.", price: 389, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mutton Kolhapuri", description: "Spicy mutton in Kolhapuri style gravy.", price: 399, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mutton Keema", description: "Minced mutton with peas and spices.", price: 369, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Fish Curry", description: "Fresh fish in traditional curry gravy.", price: 349, image: "https://images.unsplash.com/photo-1580959375944-ffbe8276d2b4?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Prawn Curry", description: "Large prawns in coastal-style curry.", price: 429, image: "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Goan Fish Curry", description: "Fish in coconut-based Goan curry.", price: 369, image: "https://images.unsplash.com/photo-1580959375944-ffbe8276d2b4?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Egg Curry", description: "Boiled eggs in spiced onion tomato gravy.", price: 189, image: "https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&q=80&w=300&h=300" },

  // BIRYANI & RICE
  { name: "Chicken Biryani", description: "Fragrant basmati rice layered with spiced chicken.", price: 299, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mutton Biryani", description: "Aromatic rice with tender mutton pieces.", price: 379, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Veg Biryani", description: "Mixed vegetables with fragrant basmati rice.", price: 229, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Hyderabadi Dum Biryani", description: "Traditional Hyderabadi style slow-cooked biryani.", price: 349, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Biryani", description: "Cottage cheese with aromatic basmati rice.", price: 269, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Egg Biryani", description: "Boiled eggs layered with fragrant rice.", price: 219, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Prawn Biryani", description: "Succulent prawns with aromatic rice.", price: 399, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Jeera Rice", description: "Basmati rice tempered with cumin seeds.", price: 149, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Steamed Rice", description: "Plain basmati rice steamed to perfection.", price: 129, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Veg Pulao", description: "Aromatic rice with mixed vegetables.", price: 199, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Kashmiri Pulao", description: "Sweet rice with dry fruits and saffron.", price: 229, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Peas Pulao", description: "Basmati rice with green peas and spices.", price: 179, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=300&h=300" },

  // BREADS
  { name: "Tandoori Roti", description: "Whole wheat bread baked in tandoor.", price: 25, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Butter Tandoori Roti", description: "Whole wheat bread with butter.", price: 30, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Plain Naan", description: "Leavened bread baked in tandoor.", price: 35, image: "https://images.unsplash.com/photo-1556910585-03ca199fef35?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Butter Naan", description: "Naan brushed with butter.", price: 40, image: "https://images.unsplash.com/photo-1556910585-03ca199fef35?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Garlic Naan", description: "Naan topped with garlic and coriander.", price: 50, image: "https://images.unsplash.com/photo-1556910585-03ca199fef35?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Cheese Naan", description: "Naan stuffed with cheese.", price: 70, image: "https://images.unsplash.com/photo-1556910585-03ca199fef35?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Naan", description: "Naan stuffed with spiced cottage cheese.", price: 65, image: "https://images.unsplash.com/photo-1556910585-03ca199fef35?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Kashmiri Naan", description: "Sweet naan with dry fruits and coconut.", price: 75, image: "https://images.unsplash.com/photo-1556910585-03ca199fef35?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Keema Naan", description: "Naan stuffed with minced meat.", price: 80, image: "https://images.unsplash.com/photo-1556910585-03ca199fef35?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Pudina Paratha", description: "Layered bread with mint.", price: 45, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Laccha Paratha", description: "Multi-layered crispy bread.", price: 40, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Aloo Paratha", description: "Bread stuffed with spiced potatoes.", price: 50, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Paratha", description: "Bread stuffed with cottage cheese.", price: 60, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Gobi Paratha", description: "Bread stuffed with cauliflower.", price: 50, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Missi Roti", description: "Gram flour bread with spices.", price: 35, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Rumali Roti", description: "Thin soft bread like handkerchief.", price: 20, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Kulcha", description: "Leavened bread baked in tandoor.", price: 40, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Bhatura", description: "Deep-fried leavened bread.", price: 45, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },

  // SOUTH INDIAN
  { name: "Masala Dosa", description: "Crispy rice crepe with spiced potato filling.", price: 99, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Plain Dosa", description: "Crispy rice and lentil crepe.", price: 79, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mysore Masala Dosa", description: "Spicy dosa with chutney and potato filling.", price: 109, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Cheese Dosa", description: "Dosa with cheese filling.", price: 119, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Dosa", description: "Dosa with cottage cheese filling.", price: 129, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paper Dosa", description: "Extra thin and crispy large dosa.", price: 119, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Onion Dosa", description: "Dosa with onion topping.", price: 99, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Rava Dosa", description: "Crispy semolina crepe.", price: 109, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Idli (2 pcs)", description: "Steamed rice cakes with sambhar and chutney.", price: 59, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Medu Vada (2 pcs)", description: "Crispy lentil donuts with sambhar and chutney.", price: 69, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Sambhar Vada", description: "Lentil donuts soaked in sambhar.", price: 79, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Idli Vada Combo", description: "2 idli and 1 vada with sambhar and chutney.", price: 89, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Uttapam Plain", description: "Thick rice pancake.", price: 89, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Onion Uttapam", description: "Rice pancake with onion topping.", price: 99, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mixed Veg Uttapam", description: "Rice pancake with vegetable topping.", price: 109, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Pongal", description: "Rice and lentil comfort food with ghee.", price: 89, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=300&h=300" },

  // BREAKFAST & SNACKS
  { name: "Poha", description: "Flattened rice with peanuts and spices.", price: 69, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Upma", description: "Semolina porridge with vegetables.", price: 69, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Pav Bhaji", description: "Mashed vegetable curry with buttered bread.", price: 129, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Vada Pav", description: "Potato fritter in bread bun.", price: 39, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Samosa (2 pcs)", description: "Crispy pastry with spiced potato filling.", price: 40, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Kachori (2 pcs)", description: "Spicy lentil stuffed fried bread.", price: 50, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chole Bhature", description: "Spicy chickpea curry with fried bread.", price: 149, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Aloo Tikki Chaat", description: "Potato patties with yogurt and chutneys.", price: 79, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Papdi Chaat", description: "Crispy chips with yogurt and chutneys.", price: 79, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Dahi Puri", description: "Crispy puris filled with yogurt and chutneys.", price: 89, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Sev Puri", description: "Crispy puris with potato and sev.", price: 79, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Bhel Puri", description: "Puffed rice with vegetables and chutneys.", price: 69, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Pani Puri (8 pcs)", description: "Crispy puris with spicy water.", price: 59, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Raj Kachori", description: "Large kachori with yogurt and chutneys.", price: 99, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },

  // CHINESE & INDO-CHINESE
  { name: "Veg Hakka Noodles", description: "Stir-fried noodles with vegetables.", price: 159, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Hakka Noodles", description: "Stir-fried noodles with chicken.", price: 189, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Schezwan Noodles Veg", description: "Spicy noodles with vegetables.", price: 169, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Schezwan Noodles Chicken", description: "Spicy noodles with chicken.", price: 199, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Veg Fried Rice", description: "Stir-fried rice with vegetables.", price: 149, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Fried Rice", description: "Stir-fried rice with chicken.", price: 179, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Schezwan Fried Rice Veg", description: "Spicy fried rice with vegetables.", price: 159, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Schezwan Fried Rice Chicken", description: "Spicy fried rice with chicken.", price: 189, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Triple Schezwan Rice", description: "Rice with noodles and gravy in schezwan sauce.", price: 229, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "American Chopsuey", description: "Crispy noodles with sweet and sour gravy.", price: 189, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Veg Manchurian Gravy", description: "Vegetable balls in Indo-Chinese gravy.", price: 189, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chilli Paneer Gravy", description: "Cottage cheese in spicy gravy.", price: 239, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chilli Chicken Gravy", description: "Chicken in spicy Indo-Chinese gravy.", price: 299, image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&q=80&w=300&h=300" },

  // SOUPS
  { name: "Tomato Soup", description: "Classic tomato soup with herbs.", price: 99, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Hot & Sour Veg Soup", description: "Spicy and tangy vegetable soup.", price: 109, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Hot & Sour Chicken Soup", description: "Spicy and tangy chicken soup.", price: 129, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Sweet Corn Veg Soup", description: "Creamy corn soup with vegetables.", price: 99, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Sweet Corn Chicken Soup", description: "Creamy corn soup with chicken.", price: 119, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Manchow Veg Soup", description: "Spicy soup with crispy noodles.", price: 109, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Manchow Chicken Soup", description: "Spicy chicken soup with crispy noodles.", price: 129, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Lemon Coriander Soup", description: "Tangy soup with fresh coriander.", price: 99, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Dal Shorba", description: "Lentil soup with Indian spices.", price: 109, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300&h=300" },

  // SALADS
  { name: "Green Salad", description: "Fresh garden vegetables with dressing.", price: 119, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Kachumber Salad", description: "Chopped cucumber, tomato, and onion salad.", price: 99, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Caesar Salad", description: "Romaine lettuce with caesar dressing.", price: 159, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Caesar Salad", description: "Caesar salad with grilled chicken.", price: 199, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Greek Salad", description: "Mediterranean salad with feta cheese.", price: 179, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300&h=300" },

  // RAITA & ACCOMPANIMENTS
  { name: "Boondi Raita", description: "Yogurt with crispy gram flour balls.", price: 79, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mix Veg Raita", description: "Yogurt with cucumber, tomato, and onion.", price: 89, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Pineapple Raita", description: "Sweet yogurt with pineapple chunks.", price: 99, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Plain Curd", description: "Fresh yogurt.", price: 69, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Papad Roasted (2 pcs)", description: "Crispy lentil wafers.", price: 30, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Papad Fried (2 pcs)", description: "Fried lentil wafers.", price: 35, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Masala Papad", description: "Papad topped with onion, tomato, and spices.", price: 50, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Green Chutney", description: "Mint and coriander chutney.", price: 20, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Tamarind Chutney", description: "Sweet and tangy tamarind sauce.", price: 20, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mixed Pickle", description: "Assorted Indian pickles.", price: 25, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Onion Salad", description: "Sliced onions with lemon and spices.", price: 40, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300&h=300" },

  // DESSERTS
  { name: "Gulab Jamun (2 pcs)", description: "Soft milk dumplings in sugar syrup.", price: 79, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Rasmalai (2 pcs)", description: "Cottage cheese patties in sweetened milk.", price: 99, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Rasgulla (2 pcs)", description: "Spongy cottage cheese balls in sugar syrup.", price: 79, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Gajar Ka Halwa", description: "Carrot pudding with nuts.", price: 119, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Moong Dal Halwa", description: "Lentil pudding with ghee and nuts.", price: 139, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Kheer", description: "Rice pudding with cardamom and nuts.", price: 99, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Shahi Tukda", description: "Bread pudding in sweetened milk.", price: 109, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Kulfi (1 pc)", description: "Traditional Indian ice cream.", price: 69, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Kulfi Falooda", description: "Kulfi with vermicelli and rose syrup.", price: 129, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Ice Cream (2 scoops)", description: "Choice of vanilla, chocolate, or strawberry.", price: 89, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Brownie with Ice Cream", description: "Warm chocolate brownie with vanilla ice cream.", price: 149, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chocolate Lava Cake", description: "Warm cake with molten chocolate center.", price: 159, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Jalebi", description: "Crispy sweet spirals in sugar syrup.", price: 89, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Rabri", description: "Thickened sweet milk with nuts.", price: 109, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300&h=300" },

  // BEVERAGES - HOT
  { name: "Masala Chai", description: "Indian spiced tea.", price: 40, image: "https://images.unsplash.com/photo-1597318130921-53e2e3f44e73?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Ginger Tea", description: "Tea with fresh ginger.", price: 45, image: "https://images.unsplash.com/photo-1597318130921-53e2e3f44e73?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Cardamom Tea", description: "Tea with cardamom flavor.", price: 45, image: "https://images.unsplash.com/photo-1597318130921-53e2e3f44e73?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Black Tea", description: "Plain black tea.", price: 35, image: "https://images.unsplash.com/photo-1597318130921-53e2e3f44e73?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Coffee", description: "Filter coffee or espresso-based.", price: 60, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Cappuccino", description: "Espresso with steamed milk foam.", price: 89, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Latte", description: "Espresso with steamed milk.", price: 99, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Hot Chocolate", description: "Rich chocolate drink.", price: 99, image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&q=80&w=300&h=300" },

  // BEVERAGES - COLD
  { name: "Sweet Lassi", description: "Sweet yogurt drink.", price: 79, image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Salted Lassi", description: "Salted yogurt drink.", price: 79, image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mango Lassi", description: "Yogurt drink with mango.", price: 99, image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Fresh Lime Soda", description: "Fresh lime with soda water.", price: 69, image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Fresh Lime Water", description: "Fresh lime with plain water.", price: 59, image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Jaljeera", description: "Cumin-flavored refreshing drink.", price: 69, image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Masala Chaas", description: "Spiced buttermilk.", price: 69, image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Aam Panna", description: "Raw mango drink.", price: 79, image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Cold Coffee", description: "Iced coffee with milk.", price: 99, image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Iced Tea", description: "Chilled tea with lemon.", price: 79, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Fresh Juice - Orange", description: "Freshly squeezed orange juice.", price: 89, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Fresh Juice - Watermelon", description: "Freshly squeezed watermelon juice.", price: 79, image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Fresh Juice - Mosambi", description: "Sweet lime juice.", price: 79, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Fresh Juice - Pineapple", description: "Freshly squeezed pineapple juice.", price: 89, image: "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mixed Fruit Juice", description: "Blend of seasonal fruits.", price: 99, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Soft Drink", description: "Choice of cola, sprite, or fanta.", price: 50, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mineral Water", description: "Bottled water.", price: 30, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=300&h=300" },

  // THALIS & COMBOS
  { name: "Veg Thali", description: "2 veg curries, dal, rice, 2 rotis, salad, papad, dessert.", price: 299, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Special Veg Thali", description: "3 veg curries, paneer, dal, rice, 3 rotis, raita, salad, dessert.", price: 399, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Non-Veg Thali", description: "Chicken curry, dal, rice, 2 rotis, salad, papad, dessert.", price: 379, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Special Non-Veg Thali", description: "Chicken + mutton, dal, rice, 3 rotis, raita, salad, dessert.", price: 499, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Punjabi Thali", description: "Dal makhani, paneer, veg, rice, naan, raita, salad, dessert.", price: 349, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "South Indian Thali", description: "Sambhar, rasam, 2 curries, rice, curd, papad, pickle.", price: 279, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Rajasthani Thali", description: "Dal baati churma, gatte ki sabzi, rice, roti, dessert.", price: 369, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mini Meals Veg", description: "1 veg curry, dal, rice, 2 rotis, salad.", price: 199, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mini Meals Non-Veg", description: "Chicken curry, rice, 2 rotis, salad.", price: 249, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300&h=300" },

  // WRAPS & ROLLS
  { name: "Paneer Tikka Roll", description: "Paneer tikka wrapped in paratha.", price: 129, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Tikka Roll", description: "Chicken tikka wrapped in paratha.", price: 149, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Veg Frankie", description: "Mixed vegetables in Indian wrap.", price: 99, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Frankie", description: "Chicken in Indian wrap.", price: 119, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Egg Roll", description: "Egg wrapped in paratha with veggies.", price: 89, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Kathi Roll", description: "Paneer in Kolkata-style roll.", price: 119, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=300&h=300" },

  // PIZZA (Indian-style)
  { name: "Margherita Pizza", description: "Classic cheese and tomato pizza.", price: 249, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Tikka Pizza", description: "Pizza topped with paneer tikka.", price: 299, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Tikka Pizza", description: "Pizza topped with chicken tikka.", price: 329, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Veggie Supreme Pizza", description: "Mixed vegetables with cheese.", price: 279, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=300&h=300" },

  // SANDWICHES
  { name: "Veg Grilled Sandwich", description: "Grilled sandwich with vegetables.", price: 89, image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Cheese Grilled Sandwich", description: "Grilled cheese sandwich.", price: 99, image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Grilled Sandwich", description: "Grilled sandwich with paneer.", price: 119, image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Grilled Sandwich", description: "Grilled sandwich with chicken.", price: 139, image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Club Sandwich", description: "Triple-decker sandwich with veggies/chicken.", price: 159, image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Bombay Sandwich", description: "Mumbai-style vegetable sandwich.", price: 79, image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=300&h=300" },

  // BURGERS
  { name: "Veg Burger", description: "Vegetable patty burger.", price: 89, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Cheese Burger", description: "Burger with cheese.", price: 109, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Paneer Burger", description: "Spiced paneer patty burger.", price: 119, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken Burger", description: "Grilled chicken burger.", price: 139, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Aloo Tikki Burger", description: "Potato patty burger.", price: 79, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300&h=300" },

  // PASTA
  { name: "White Sauce Pasta", description: "Creamy white sauce pasta.", price: 189, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Red Sauce Pasta", description: "Tomato-based pasta.", price: 179, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Chicken White Sauce Pasta", description: "Creamy chicken pasta.", price: 219, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Arrabiata Pasta", description: "Spicy tomato sauce pasta.", price: 199, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=300&h=300" },
  { name: "Mac and Cheese", description: "Classic macaroni in cheese sauce.", price: 189, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=300&h=300" },
];

// Image Crop Dialog Component
function ImageCropDialog({
  imageUrl,
  isOpen,
  onClose,
  onCropComplete,
}: {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteInternal = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const image = new Image();
      image.src = imageUrl;

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Compress: cap maximum dimension to 800px while preserving aspect ratio
      const MAX_DIMENSION = 800;
      const srcW = croppedAreaPixels.width;
      const srcH = croppedAreaPixels.height;
      const scale = Math.min(1, MAX_DIMENSION / Math.max(srcW, srcH));
      const outW = Math.round(srcW * scale);
      const outH = Math.round(srcH * scale);

      canvas.width = outW;
      canvas.height = outH;

      // Draw the cropped (and down-scaled) image
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        srcW,
        srcH,
        0,
        0,
        outW,
        outH
      );

      // Compress: JPEG quality 0.78 — visually great for food photos, ~60-80% smaller
      canvas.toBlob((blob) => {
        if (blob) {
          const sizeKB = Math.round(blob.size / 1024);
          const croppedImageUrl = URL.createObjectURL(blob);
          onCropComplete(croppedImageUrl);
          toast.success(`Image saved (${outW}×${outH}px · ${sizeKB} KB)`);
          onClose();
        }
      }, "image/jpeg", 0.78);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
    } finally {
      setIsProcessing(false);
    }
  }, [croppedAreaPixels, imageUrl, onCropComplete, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0">
        <div className="p-3 sm:p-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Crop Image</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Adjust the image crop area and zoom level
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="relative h-[280px] sm:h-[320px] md:h-[380px] bg-gray-900 overflow-hidden">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal}
            style={{
              containerStyle: {
                backgroundColor: '#1a1a1a',
              },
            }}
          />
        </div>

        <div className="p-3 sm:p-4 space-y-3 border-t">
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-medium">Zoom</Label>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-xs text-muted-foreground">1x</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((zoom - 1) / 2) * 100}%, hsl(var(--muted)) ${((zoom - 1) / 2) * 100}%, hsl(var(--muted)) 100%)`
                }}
              />
              <span className="text-[10px] sm:text-xs text-muted-foreground">3x</span>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 border-t flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-9 sm:h-10 text-sm"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={createCroppedImage}
            className="flex-1 h-9 sm:h-10 text-sm bg-primary hover:bg-primary/90"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Apply Crop"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Separate component for menu item row to properly use hooks
function MenuItemRow({
  item,
  currency,
  onToggleAvailability,
  onEdit,
  onDelete,
  onCustomize,
  updateAvailabilityPending,
  hasCustomizations
}: {
  item: MenuItem;
  currency: string;
  onToggleAvailability: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCustomize: () => void;
  updateAvailabilityPending: boolean;
  hasCustomizations: boolean;
}) {
  return (
    <div className="p-2.5 sm:p-3 md:p-4 flex items-start gap-2 sm:gap-3 md:gap-4 hover:bg-muted/10 transition-colors group">
      {/* Item Image */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-md sm:rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1 min-w-0">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <h4 className="font-semibold text-xs sm:text-sm md:text-base leading-tight break-words whitespace-normal min-w-0">
              {item.name}
            </h4>
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              {item.dietaryTags?.map((tag, i) => {
                const isVeg = tag.toLowerCase() === "veg";
                const isNonVeg = tag.toLowerCase() === "non-veg";
                return (
                  <Badge
                    key={i}
                    className={cn(
                      "text-[8px] sm:text-[9px] md:text-[10px] px-1 py-0 h-3 sm:h-3.5 md:h-4",
                      isVeg && "bg-green-100 text-green-800 border-green-200",
                      isNonVeg && "bg-red-100 text-red-800 border-red-200"
                    )}
                  >
                    {tag}
                  </Badge>
                );
              })}
              {hasCustomizations && (
                <Badge
                  className="text-[8px] sm:text-[9px] md:text-[10px] px-1 py-0 h-3 sm:h-3.5 md:h-4 bg-blue-100 text-blue-800 border-blue-200"
                >
                  <Settings className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5" />
                  Customized
                </Badge>
              )}
            </div>
          </div>
          <p className="font-mono font-medium text-xs sm:text-sm md:text-base flex-shrink-0 mt-0.5">{currency}{item.price}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-2 w-full mt-1 sm:mt-0">
          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none flex-1">
            {item.description || "No description"}
          </p>
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-muted-foreground whitespace-nowrap">In Stock</span>
              <Switch
                checked={item.isAvailable}
                onCheckedChange={onToggleAvailability}
                disabled={updateAvailabilityPending}
                className="scale-75 sm:scale-100"
              />
            </div>

            {/* Action Buttons - Mobile */}
            <div className="flex sm:hidden items-center gap-1.5 flex-shrink-0">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={onCustomize}
              >
                <Settings className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={onEdit}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={onDelete}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Desktop */}
      <div className="hidden sm:flex items-center gap-1.5 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="h-7 md:h-8 text-xs gap-1"
          onClick={onCustomize}
        >
          <Settings className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 md:h-8 text-xs"
          onClick={onEdit}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 md:h-8 md:w-8 text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </Button>
      </div>
    </div>
  );
}

// Hook to check if an item has customizations
function useItemCustomizations(restaurantId: string, menuItemId: string, isDialogOpen: boolean) {
  const { data: variants } = useVariantsForMenuItem(restaurantId, isDialogOpen ? null : menuItemId);
  const { data: modifierGroups } = useModifierGroupsForMenuItem(restaurantId, isDialogOpen ? null : menuItemId);

  const hasCustomizations = useMemo(() => {
    const hasVariants = variants && variants.length > 0;
    const hasModifiers = modifierGroups && modifierGroups.length > 0;
    return !!(hasVariants || hasModifiers);
  }, [variants, modifierGroups]);

  return hasCustomizations;
}

// Wrapper component to use the customization hook
function MenuItemRowWithCustomizations({
  item,
  currency,
  onToggleAvailability,
  onEdit,
  onDelete,
  onCustomize,
  updateAvailabilityPending,
  restaurantId,
  isDialogOpen
}: {
  item: MenuItem;
  currency: string;
  onToggleAvailability: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCustomize: () => void;
  updateAvailabilityPending: boolean;
  restaurantId: string | null;
  isDialogOpen: boolean;
}) {
  const hasCustomizations = useItemCustomizations(restaurantId ?? "", item.id, isDialogOpen);

  return (
    <MenuItemRow
      item={item}
      currency={currency}
      onToggleAvailability={onToggleAvailability}
      onEdit={onEdit}
      onDelete={onDelete}
      onCustomize={onCustomize}
      updateAvailabilityPending={updateAvailabilityPending}
      hasCustomizations={hasCustomizations}
    />
  );
}

// Sortable Category Component
function SortableCategory({
  category,
  currency,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddItem,
  onToggleAvailability,
  onEditItem,
  onDeleteItem,
  onCustomizeItem,
  updateAvailabilityPending,
  restaurantId,
  customizingItemId,
  dietaryFilter,
}: {
  category: MenuCategory & { items: MenuItem[] };
  currency: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddItem: () => void;
  onToggleAvailability: (item: MenuItem) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onCustomizeItem: (item: MenuItem) => void;
  updateAvailabilityPending: boolean;
  restaurantId: string | null;
  customizingItemId: string | null;
  dietaryFilter: 'any' | 'veg' | 'non-veg';
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background border border-border rounded-lg sm:rounded-xl shadow-sm overflow-hidden"
    >
      {/* Category Header - Responsive */}
      <div className="p-2.5 sm:p-3 md:p-4 border-b bg-muted/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-muted-foreground flex-shrink-0" />
          </div>
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 hover:opacity-70 transition-opacity"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-muted-foreground flex-shrink-0" />
            )}
            <h3 className="font-heading font-bold text-sm sm:text-base md:text-lg truncate flex-1 text-left min-w-0">
              {category.name}
            </h3>
            <span className="bg-primary/10 text-primary text-[10px] sm:text-xs px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full font-medium flex-shrink-0">
              {category.items.length}
            </span>
          </button>
        </div>
        <div className="flex gap-0.5 sm:gap-1 md:gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 hover:bg-primary/10"
            onClick={onEdit}
          >
            <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>
      </div>

      {/* Items List - Only shown when expanded */}
      {isExpanded && (
        <div className="divide-y divide-border">
          {category.items.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                {dietaryFilter !== 'any'
                  ? `No ${dietaryFilter === 'veg' ? 'Veg' : 'Non-Veg'} items`
                  : 'No items yet'}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={onAddItem}
              >
                <Plus className="w-3 h-3 mr-1.5" /> Add Item
              </Button>
            </div>
          ) : (
            <>
              {category.items.map((item: MenuItem) => (
                <MenuItemRowWithCustomizations
                  key={item.id}
                  item={item}
                  currency={currency}
                  onToggleAvailability={() => onToggleAvailability(item)}
                  onEdit={() => onEditItem(item)}
                  onDelete={() => onDeleteItem(item.id)}
                  onCustomize={() => onCustomizeItem(item)}
                  updateAvailabilityPending={updateAvailabilityPending}
                  restaurantId={restaurantId}
                  isDialogOpen={customizingItemId === item.id}
                />
              ))}
              <div
                className="p-2 sm:p-2.5 md:p-3 bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer text-center text-xs sm:text-sm font-medium text-primary border-t border-dashed"
                onClick={onAddItem}
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 inline mr-1 sm:mr-2" /> Add Item
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  const { restaurantId } = useAuth();
  const { data: restaurant } = useRestaurant(restaurantId);
  const { data: menuData, isLoading } = useMenuCategories(restaurantId, restaurant?.slug ?? null);

  // Mutations
  const createCategory = useCreateCategory(restaurantId);
  const updateCategory = useUpdateCategory(restaurantId);
  const createMenuItem = useCreateMenuItem(restaurantId);
  const updateMenuItem = useUpdateMenuItem(restaurantId);
  const updateAvailability = useUpdateMenuItemAvailability(restaurantId);
  const deleteItem = useDeleteMenuItem(restaurantId);
  const deleteCategory = useDeleteCategory(restaurantId);

  // Local state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<'any' | 'veg' | 'non-veg'>('any');
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    dietaryType: "" as "" | "Veg" | "Non-Veg"
  });

  // Image crop states
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [extractionJobId, setExtractionJobId] = useState<string | null>(null);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [orderedCategoryIds, setOrderedCategoryIds] = useState<string[]>([]);

  // Setup drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const categoriesWithItems = useMemo(() => {
    if (!menuData) return [];
    const { categories, items } = menuData;

    const mappedCategories = categories
      .map((cat: MenuCategory) => {
        const categoryItems = items.filter((item: MenuItem) => item.categoryId === cat.id);

        let filteredItems = categoryItems;
        if (dietaryFilter === 'veg') {
          filteredItems = categoryItems.filter((item: MenuItem) =>
            item.dietaryTags?.some(tag => tag.toLowerCase() === 'veg')
          );
        } else if (dietaryFilter === 'non-veg') {
          filteredItems = categoryItems.filter((item: MenuItem) =>
            item.dietaryTags?.some(tag => tag.toLowerCase() === 'non-veg')
          );
        }

        return {
          ...cat,
          items: filteredItems,
        };
      })
      .sort((a, b) => {
        if (a.sortOrder === null && b.sortOrder === null) return 0;
        if (a.sortOrder === null) return 1;
        if (b.sortOrder === null) return -1;
        return a.sortOrder - b.sortOrder;
      });

    if (dietaryFilter === "veg" || dietaryFilter === "non-veg") {
      return mappedCategories.filter((cat) => cat.items.length > 0);
    }

    return mappedCategories;
  }, [menuData, dietaryFilter]);

  // Initialize ordered category IDs when data loads
  useEffect(() => {
    if (categoriesWithItems.length > 0 && orderedCategoryIds.length === 0) {
      setOrderedCategoryIds(categoriesWithItems.map(cat => cat.id));
    }
  }, [categoriesWithItems, orderedCategoryIds.length]);

  // Get categories in display order
  const orderedCategories = useMemo(() => {
    if (orderedCategoryIds.length === 0) return categoriesWithItems;

    return orderedCategoryIds
      .map(id => categoriesWithItems.find(cat => cat.id === id))
      .filter((cat): cat is MenuCategory & { items: MenuItem[] } => cat !== undefined);
  }, [orderedCategoryIds, categoriesWithItems]);

  const filteredPrefilled = PREFILLED_ITEMS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectPrefilled = (item: typeof PREFILLED_ITEMS[0]) => {
    setNewItem({
      name: item.name,
      price: item.price.toString(),
      description: item.description,
      image: item.image,
      dietaryType: "" as "" | "Veg" | "Non-Veg"
    });
    toast.info("Item details prefilled!");
  };

  const handleImageUpload = (file: File, forEdit: boolean = false) => {
    const url = URL.createObjectURL(file);
    setTempImageUrl(url);
    setIsEditMode(forEdit);
    setIsCropDialogOpen(true);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setNewItem({ ...newItem, image: croppedImageUrl });
    setTempImageUrl(null);
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    updateAvailability.mutate({
      itemId: item.id,
      isAvailable: !item.isAvailable
    });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    await createCategory.mutateAsync({ name: newCategoryName.trim() });
    setNewCategoryName("");
    setIsCategoryDialogOpen(false);
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !newCategoryName.trim()) return;

    await updateCategory.mutateAsync({
      categoryId: editingCategory.id,
      data: { name: newCategoryName.trim() }
    });
    setNewCategoryName("");
    setEditingCategory(null);
    setIsEditCategoryDialogOpen(false);
  };

  const handleOpenEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setIsEditCategoryDialogOpen(true);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || !newItem.name || !newItem.price) return;

    await createMenuItem.mutateAsync({
      categoryId: selectedCategoryId,
      name: newItem.name,
      description: newItem.description || undefined,
      price: parseFloat(newItem.price),
      imageUrl: newItem.image || undefined,
      isAvailable: true,
      dietaryTags: newItem.dietaryType ? [newItem.dietaryType] : undefined,
    });

    setNewItem({ name: "", price: "", description: "", image: "", dietaryType: "" });
    setIsItemDialogOpen(false);
    setSelectedCategoryId(null);
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !newItem.name || !newItem.price) return;

    await updateMenuItem.mutateAsync({
      itemId: editingItem.id,
      data: {
        name: newItem.name,
        description: newItem.description || undefined,
        price: parseFloat(newItem.price),
        imageUrl: newItem.image || undefined,
        dietaryTags: newItem.dietaryType ? [newItem.dietaryType] : undefined,
      }
    });

    setNewItem({ name: "", price: "", description: "", image: "", dietaryType: "" });
    setEditingItem(null);
    setIsEditItemDialogOpen(false);
  };

  const handleOpenEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setSelectedCategoryId(item.categoryId);
    const dietaryType = item.dietaryTags?.find(tag => tag === "Veg" || tag === "Non-Veg") || "";
    setNewItem({
      name: item.name,
      price: item.price.toString(),
      description: item.description || "",
      image: item.imageUrl || "",
      dietaryType: dietaryType as "" | "Veg" | "Non-Veg"
    });
    setIsEditItemDialogOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    deleteItem.mutate(itemId);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category and all its items?")) return;
    deleteCategory.mutate(categoryId);
  };

  const handleCustomizationClose = () => {
    setIsCustomizationOpen(false);
    setCustomizingItem(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedCategoryIds((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Update sort order in the backend (silently, without individual toasts)
        updateCategoryOrder(newOrder);

        return newOrder;
      });
    }
  };

  const updateCategoryOrder = async (orderedIds: string[]) => {
    if (!restaurantId) return;

    try {
      // Update each category with its new sort order
      const updatePromises = orderedIds.map((categoryId, index) => {
        // Use the API directly to avoid multiple toast notifications
        return api.put(`/api/menu/${restaurantId}/categories/${categoryId}`, {
          sortOrder: index
        });
      });

      await Promise.all(updatePromises);

      // Show single success toast after all updates complete
      toast.success("Category order saved");
    } catch (error) {
      console.error("Failed to update category order:", error);
      toast.error("Failed to save category order");
    }
  };

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const currency = restaurant?.currency || "₹";

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Image Crop Dialog */}
      {tempImageUrl && (
        <ImageCropDialog
          imageUrl={tempImageUrl}
          isOpen={isCropDialogOpen}
          onClose={() => {
            setIsCropDialogOpen(false);
            setTempImageUrl(null);
          }}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6 md:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold">Menu Builder</h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-0.5">
            Manage categories, dishes, and customizations
          </p>
        </div>

        {/* Action Buttons - Right aligned on desktop */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 flex-shrink-0">
          <MenuCardUploader
            restaurantId={restaurantId}
            onExtractionComplete={(jobId) => setExtractionJobId(jobId)}
          />

          <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
            setIsCategoryDialogOpen(open);
            if (!open) setNewCategoryName("");
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="shadow-lg shadow-primary/20 text-xs sm:text-sm h-8 sm:h-9">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg">Add New Category</DialogTitle>
                <DialogDescription className="text-sm">Create a new section for your menu.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="category-name" className="text-sm">Category Name</Label>
                  <Input
                    id="category-name"
                    placeholder="e.g., Desserts, Beverages"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                    className="text-sm"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full text-sm" disabled={createCategory.isPending}>
                    {createCategory.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create Category
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={(open) => {
        setIsEditCategoryDialogOpen(open);
        if (!open) {
          setEditingCategory(null);
          setNewCategoryName("");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Edit Category</DialogTitle>
            <DialogDescription className="text-sm">Update the category name.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCategory} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name" className="text-sm">Category Name</Label>
              <Input
                id="edit-category-name"
                placeholder="Enter category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                className="text-sm"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full text-sm" disabled={updateCategory.isPending}>
                {updateCategory.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dietary Filter Buttons - Responsive */}
      <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setDietaryFilter('any')}
          className={cn(
            "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0",
            dietaryFilter === 'any'
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          All Items
        </button>
        <button
          onClick={() => setDietaryFilter('veg')}
          className={cn(
            "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0",
            dietaryFilter === 'veg'
              ? "bg-green-500 text-white shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Veg Only
        </button>
        <button
          onClick={() => setDietaryFilter('non-veg')}
          className={cn(
            "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0",
            dietaryFilter === 'non-veg'
              ? "bg-red-500 text-white shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Non-Veg Only
        </button>
      </div>

      {/* Categories List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4 sm:space-y-6">
          {!menuData || menuData.categories.length === 0 ? (
            <div className="text-center py-12 sm:py-16 md:py-20 border-2 border-dashed rounded-xl">
              <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/30" />
              <p className="text-sm sm:text-base md:text-lg font-medium text-muted-foreground">No menu categories yet</p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 px-4">Start by adding your first category</p>
              <Button onClick={() => setIsCategoryDialogOpen(true)} size="sm" className="text-xs sm:text-sm">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> Add Category
              </Button>
            </div>
          ) : categoriesWithItems.length === 0 && dietaryFilter === 'any' ? (
            <div className="text-center py-12 sm:py-16 md:py-20 border-2 border-dashed rounded-xl">
              <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/30" />
              <p className="text-sm sm:text-base md:text-lg font-medium text-muted-foreground">No items in any category</p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 px-4">Add items to your categories to get started</p>
            </div>
          ) : (
            <SortableContext
              items={orderedCategoryIds}
              strategy={verticalListSortingStrategy}
            >
              {orderedCategories.map((category) => (
                <SortableCategory
                  key={category.id}
                  category={category}
                  currency={currency}
                  isExpanded={expandedCategories.has(category.id)}
                  onToggleExpand={() => toggleCategoryExpand(category.id)}
                  onEdit={() => handleOpenEditCategory(category)}
                  onDelete={() => handleDeleteCategory(category.id)}
                  onAddItem={() => {
                    setSelectedCategoryId(category.id);
                    setIsItemDialogOpen(true);
                  }}
                  onToggleAvailability={handleToggleAvailability}
                  onEditItem={handleOpenEditItem}
                  onDeleteItem={handleDeleteItem}
                  onCustomizeItem={(item) => {
                    setCustomizingItem(item);
                    setIsCustomizationOpen(true);
                  }}
                  updateAvailabilityPending={updateAvailability.isPending}
                  restaurantId={restaurantId}
                  customizingItemId={customizingItem?.id ?? null}
                  dietaryFilter={dietaryFilter}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </DndContext>

      {/* Add Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={(open) => {
        setIsItemDialogOpen(open);
        if (!open) {
          setSelectedCategoryId(null);
          setNewItem({ name: "", price: "", description: "", image: "", dietaryType: "" });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Add New Item</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Add a new dish to {categoriesWithItems.find(c => c.id === selectedCategoryId)?.name || 'category'}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 py-2 sm:py-4">
            {/* Suggestions Column */}
            <div className="space-y-3 sm:space-y-4 md:border-r md:pr-4 md:pr-6">
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <Input
                  placeholder="Search suggestions..."
                  className="pl-7 sm:pl-9 text-xs sm:text-sm h-8 sm:h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[150px] sm:h-[200px] md:h-[300px] pr-2 sm:pr-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5 sm:gap-2">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" /> Suggestions
                  </p>
                  {filteredPrefilled.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectPrefilled(item)}
                      className="w-full flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 rounded-md sm:rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all text-left"
                    >
                      <img src={item.image} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-md object-cover flex-shrink-0" alt="" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-bold truncate">{item.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{currency}{item.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Form Column */}
            <form onSubmit={handleAddItem} className="space-y-3 sm:space-y-4">
              <div className="grid gap-2 sm:gap-3 md:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="item-name" className="text-xs sm:text-sm">Item Name</Label>
                  <Input
                    id="item-name"
                    placeholder="e.g. Classic Margherita"
                    className="text-xs sm:text-sm h-8 sm:h-10"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="item-price" className="text-xs sm:text-sm">Price ({currency})</Label>
                    <Input
                      id="item-price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="text-xs sm:text-sm h-8 sm:h-10"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm">Image</Label>
                    {newItem.image ? (
                      <div className="relative group w-full h-8 sm:h-10 rounded-md border overflow-hidden">
                        <img src={newItem.image} className="w-full h-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={() => setNewItem({ ...newItem, image: "" })}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative h-8 sm:h-10 overflow-hidden">
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, false);
                            }
                          }}
                        />
                        <Button type="button" variant="outline" className="w-full gap-1.5 text-[10px] sm:text-xs h-full">
                          <Upload className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Upload
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="item-desc" className="text-xs sm:text-sm">Description</Label>
                  <Textarea
                    id="item-desc"
                    placeholder="Briefly describe the dish..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="h-16 sm:h-20 md:h-24 text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm">Dietary Type</Label>
                  <RadioGroup
                    value={newItem.dietaryType}
                    onValueChange={(value) => setNewItem({ ...newItem, dietaryType: value as "" | "Veg" | "Non-Veg" })}
                    className="flex gap-3 sm:gap-4 md:gap-6"
                  >
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <RadioGroupItem value="Veg" id="add-veg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <Label htmlFor="add-veg" className="cursor-pointer font-normal text-xs sm:text-sm">Veg</Label>
                    </div>
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <RadioGroupItem value="Non-Veg" id="add-non-veg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <Label htmlFor="add-non-veg" className="cursor-pointer font-normal text-xs sm:text-sm">Non-Veg</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full text-xs sm:text-sm h-8 sm:h-10" disabled={createMenuItem.isPending}>
                  {createMenuItem.isPending ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin mr-2" /> : null}
                  Add Item
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT ITEM DIALOG */}
      <Dialog open={isEditItemDialogOpen} onOpenChange={(open) => {
        setIsEditItemDialogOpen(open);
        if (!open) {
          setEditingItem(null);
          setSelectedCategoryId(null);
          setNewItem({ name: "", price: "", description: "", image: "", dietaryType: "" });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Edit Menu Item</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">Update the details of this item.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditItem} className="space-y-3 sm:space-y-4 py-2 sm:py-4">
            <div className="grid gap-2 sm:gap-3 md:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="edit-item-name" className="text-xs sm:text-sm">Item Name</Label>
                <Input
                  id="edit-item-name"
                  placeholder="e.g. Classic Margherita"
                  className="text-xs sm:text-sm h-8 sm:h-10"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="edit-item-price" className="text-xs sm:text-sm">Price ({currency})</Label>
                  <Input
                    id="edit-item-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="text-xs sm:text-sm h-8 sm:h-10"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm">Image</Label>
                  {newItem.image ? (
                    <div className="relative group w-full h-8 sm:h-10 rounded-md border overflow-hidden">
                      <img src={newItem.image} className="w-full h-full object-cover" alt="" />
                      <button
                        type="button"
                        onClick={() => setNewItem({ ...newItem, image: "" })}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative h-8 sm:h-10 overflow-hidden">
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file, true);
                          }
                        }}
                      />
                      <Button type="button" variant="outline" className="w-full gap-1.5 text-[10px] sm:text-xs h-full">
                        <Upload className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Upload
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="edit-item-description" className="text-xs sm:text-sm">Description</Label>
                <Textarea
                  id="edit-item-description"
                  placeholder="Briefly describe the dish..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="h-16 sm:h-20 md:h-24 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm">Dietary Type</Label>
                <RadioGroup
                  value={newItem.dietaryType}
                  onValueChange={(value) => setNewItem({ ...newItem, dietaryType: value as "" | "Veg" | "Non-Veg" })}
                  className="flex gap-3 sm:gap-4 md:gap-6"
                >
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <RadioGroupItem value="Veg" id="edit-item-veg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <Label htmlFor="edit-item-veg" className="cursor-pointer font-normal text-xs sm:text-sm">Veg</Label>
                  </div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <RadioGroupItem value="Non-Veg" id="edit-item-non-veg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <Label htmlFor="edit-item-non-veg" className="cursor-pointer font-normal text-xs sm:text-sm">Non-Veg</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full text-xs sm:text-sm h-8 sm:h-10" disabled={updateMenuItem.isPending}>
                {updateMenuItem.isPending ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin mr-2" /> : null}
                Update Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Menu Item Customization Dialog */}
      {customizingItem && (
        <MenuItemCustomization
          restaurantId={restaurantId ?? "" as string}
          menuItemId={customizingItem.id}
          menuItemName={customizingItem.name}
          basePrice={customizingItem.price}
          currency={currency}
          isOpen={isCustomizationOpen}
          onClose={handleCustomizationClose}
        />
      )}

      {/* AI Extraction Preview Dialog */}
      {extractionJobId && restaurantId && (
        <ExtractionPreview
          jobId={extractionJobId}
          restaurantId={restaurantId}
          restaurantSlug={restaurant?.slug ?? null}
          onConfirmed={() => {
            setExtractionJobId(null);
            window.location.reload();
          }}
          onCancel={() => setExtractionJobId(null)}
        />
      )}
    </DashboardLayout>
  );
}