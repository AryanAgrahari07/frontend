import type { Order, Restaurant } from "@/types";
import type { KOTData } from "@/lib/thermal-printer-utils";
import type { POSCartLineItem } from "@/types/pos";

/**
 * Build KOTData from a freshly created Order (post-API).
 * Used in LiveOrdersPage / FloorMapPage after createOrder.mutateAsync().
 */
export function buildKOTDataFromOrder(opts: {
  order: Order;
  restaurant: Restaurant;
}): KOTData {
  const { order, restaurant } = opts;

  const now = new Date(order.createdAt ?? Date.now());

  const waiterName = order.placedByStaff?.fullName;

  const orderTypeLabel =
    order.orderType === "DINE_IN"
      ? "Dine In"
      : order.orderType === "TAKEAWAY"
      ? "Takeaway"
      : "Delivery";

  return {
    restaurant: { name: restaurant.name },
    kot: {
      kotNumber: order.id.slice(-6).toUpperCase(),
      date: now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      tableNumber: order.table?.tableNumber,
      orderType: orderTypeLabel,
      waiterName,
      notes: order.notes ?? undefined,
    },
    items: (order.items ?? []).map((it) => ({
      name: it.itemName,
      quantity: Number(it.quantity),
      variant: it.variantName ?? undefined,
      modifiers: it.selectedModifiers?.map((m) => m.name).join(", ") ?? undefined,
    })),
  };
}

/**
 * Build KOTData directly from the cart (pre-order creation).
 * Useful for future scenarios where you want to preview the KOT.
 */
export function buildKOTDataFromCart(opts: {
  cart: POSCartLineItem[];
  restaurant: Restaurant;
  tableNumber?: string;
  orderType: "dine-in" | "takeaway" | "delivery";
  waiterName?: string;
  notes?: string;
}): KOTData {
  const { cart, restaurant, tableNumber, orderType, waiterName, notes } = opts;
  const now = new Date();

  const orderTypeLabel =
    orderType === "dine-in"
      ? "Dine In"
      : orderType === "takeaway"
      ? "Takeaway"
      : "Delivery";

  return {
    restaurant: { name: restaurant.name },
    kot: {
      kotNumber: `T${Date.now().toString().slice(-6)}`,
      date: now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      tableNumber,
      orderType: orderTypeLabel,
      waiterName,
      notes,
    },
    items: cart.map((li) => ({
      name: li.name,
      quantity: li.quantity,
      variant: li.menuItem?.variants?.find((v) => v.id === li.variantId)?.variantName ?? undefined,
      modifiers:
        li.modifierIds?.length
          ? li.menuItem?.modifierGroups
              ?.flatMap((g) => g.modifiers?.filter((m) => li.modifierIds!.includes(m.id)) ?? [])
              .map((m) => m.name)
              .join(", ")
          : undefined,
    })),
  };
}
