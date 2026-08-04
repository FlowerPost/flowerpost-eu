import { queryOptions } from "@tanstack/react-query";
import { getShopData } from "./shop.functions";

export const shopDataQuery = () =>
  queryOptions({
    queryKey: ["shop-data"],
    queryFn: () => getShopData(),
    staleTime: 60_000,
  });

export type ShopData = Awaited<ReturnType<typeof getShopData>>;
