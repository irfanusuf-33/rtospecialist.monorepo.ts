"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductTile from "./ProductTile";
import ProductTileSkeleton from "../common/skeleton/ProductTileSkeleton";
import GroupHeader from "./GroupHeader";
import URLUtils from "../../scripts/UrlUtils";
import { useProductCategoryPageStore } from "../../state/useProductCategoryPageStore";
import { useCartStore } from "../../state/useCartStore";
import { useAccountsStore } from "../../state/useAccountsStore";
import { usePageLoaderStore } from "../../state/usePageLoaderStore";
import { useGlobalToastStore } from "../../state/useGlobalToastStore";
import { useEcommerceFiltersStore } from "../../state/useEcommerceFiltersStore";
import { useGuestCartStore } from "../../state/useGuestCartStore";

interface Product {
  _id: string;
  imageUrl: string;
  productId: string;
  name: string;
  description: string;
  salePrice: number | string;
  price: number | string;
  preOrder?: boolean;
  inCart?: boolean;
}

interface QualificationSubcategory {
  _id: string;
  name: string;
  url?: string;
}

interface QualificationUnit {
  _id: string;
  productId: string;
  name: string;
  price: number | string;
  salePrice: number | string;
}

interface GuestCartItem {
  productId: string;
  salePrice: number | string;
  price: number | string,
  name: string,
  productCode: string;
  type: string;
}

type ProductGroups = Record<string, Product[]>;
type TileVariant = "core" | "elective" | "qualification";

const qualificationLevelPatterns = [
  { label: "Advanced Diploma", pattern: /\badvanced diploma\b/i },
  { label: "Certificate I", pattern: /\bcertificate\s+i\b/i },
  { label: "Certificate II", pattern: /\bcertificate\s+ii\b/i },
  { label: "Certificate III", pattern: /\bcertificate\s+iii\b/i },
  { label: "Certificate IV", pattern: /\bcertificate\s+iv\b/i },
  { label: "Graduate Certificate", pattern: /\bgraduate certificate\b/i },
  { label: "Graduate Diploma", pattern: /\bgraduate diploma\b/i },
  { label: "Diploma", pattern: /(?<!advanced\s)(?<!graduate\s)\bdiploma\b/i },
  { label: "Course", pattern: /\bcourse\b/i },
];

const getProductText = (product: Product) => `${product.productId} ${product.name} ${product.description}`;

const getProductQualificationLevels = (product: Product) => {
  const productText = getProductText(product);
  return qualificationLevelPatterns
    .filter(({ pattern }) => pattern.test(productText))
    .map(({ label }) => label);
};

const getProductType = (product: Product, groupName: string) => {
  const productText = `${groupName} ${getProductText(product)}`;

  if (/\bunit(s)?\b/i.test(productText)) {
    return "unit";
  }

  if (getProductQualificationLevels(product).length > 0 || /\bqualification\b/i.test(productText)) {
    return "qualification";
  }

  return "qualification";
};

const getGroupVariant = (groupName: string): TileVariant => {
  const normalised = groupName.toLowerCase();

  if (normalised.includes("core")) {
    return "core";
  }

  if (normalised.includes("elective")) {
    return "elective";
  }

  return "qualification";
};

export default function EcommerceProductTiles ({ isSidebarCollapsed = false }: { isSidebarCollapsed?: boolean }) {
  const searchParams = useSearchParams();
  const activeCategoryId = searchParams.get("categoryid") || "";
  const activeCategoryName = searchParams.get("categoryname") || "";
  const customer = useAccountsStore((state) => state.customer);
  const products = useProductCategoryPageStore((state) => state.productCategoryPage);
  const subcategories = useProductCategoryPageStore((state) => state.categorySubcategories) as QualificationSubcategory[];
  const UUIDS = useProductCategoryPageStore((state) => state.productUUIDS);
  const productGroup = useCartStore((state) => state.groupAllInCart);
  const cartItems = useCartStore((state) => state.items);
  const guestCartProducts = useGuestCartStore((state) => state.products);
  const basketIds = useMemo(
    () => Array.from(new Set([...cartItems.map((item) => item.id), ...guestCartProducts.map((item) => item.productId)])),
    [cartItems, guestCartProducts]
  );
  const addToCartStore = useCartStore((state) => state.addToCart);
  const setUserCartLength = useCartStore((state) => state.setUserCartLength);
  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const setToastState = useGlobalToastStore((state) => state.setToastState);
  const productType = useEcommerceFiltersStore((state) => state.productType);
  const qualificationLevels = useEcommerceFiltersStore((state) => state.qualificationLevels);
  const addGuestProduct = useGuestCartStore((state) => state.addProduct);
  const addGuestProducts = useGuestCartStore((state) => state.addProducts);

  const toGuestCartItem = (productId: string, salePrice: number | string, price: number | string, name: string, productCode: string, type: string): GuestCartItem => ({
    productId,
    salePrice: Number(salePrice) || 0,
    price: Number(price) || 0,
    name: name,
    productCode: productCode,
    type: type,
  });

  const filteredProducts = useMemo(() => {
    if (productType === "qualification") {
      return {};
    }

    if (!products || typeof products !== "object" || Object.keys(products).length === 0) {
      return products as ProductGroups | null;
    }

    return Object.entries(products as ProductGroups).reduce<ProductGroups>((groups, [groupName, productArray]) => {
      const filteredGroup = productArray.filter((product) => {
        const matchesProductType =
          productType === "all" ||
          getProductType(product, groupName) === productType;
        const productLevels = getProductQualificationLevels(product);
        const matchesQualificationLevel =
          qualificationLevels.length === 0 ||
          qualificationLevels.some((level) => productLevels.includes(level));

        return matchesProductType && matchesQualificationLevel;
      });

      if (filteredGroup.length > 0) {
        groups[groupName] = filteredGroup;
      }

      return groups;
    }, {});
  }, [productType, products, qualificationLevels]);

  const filteredQualifications = useMemo(() => {
    const availableSubcategories = Array.isArray(subcategories) ? subcategories : [];

    return availableSubcategories.filter((subcategory) => {
      const matchesProductType = productType === "all" || productType === "qualification";
      const qualificationText = `${subcategory.name} ${subcategory.url || ""}`;
      const qualificationLevelsMatch =
        qualificationLevels.length === 0 ||
        qualificationLevels.some((level) => qualificationText.toLowerCase().includes(level.toLowerCase()));

      return matchesProductType && qualificationLevelsMatch;
    });
  }, [productType, qualificationLevels, subcategories]);

  const addToCart = async (product: Product) => {
    if (!product?._id) {
      return;
    }

    if (!customer.isAuthenticated) {
      addGuestProduct(toGuestCartItem(product._id, product.salePrice, product.price, product.name, product.productId, "trainingProduct"));
      setToastState({ html: 'Product added successfully', show: true });
      return;
    }

    setLoading(true);
    try {
      const res = await URLUtils.post('Cart-AddProduct', { pid: product._id, type: "trainingProduct" });
      if (res.status === 200) {
        addToCartStore({ id: product._id });
        setToastState({ html: 'Product added successfully', show: true });
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: { err?: string; errorCode?: string } } };
      setToastState({ html: err.response?.data?.err || 'some error occured!', show: true });
    } finally {
      setLoading(false);
    }
  };

  const addQualificationToCart = async (qualificationId: string) => {
    setLoading(true);
    try {
      const qualificationRes = await URLUtils.get(`SubCategory-GetSingle/${qualificationId}`);
      const qualificationProducts = Array.isArray(qualificationRes.data?.coreUnits)
        ? qualificationRes.data.coreUnits as QualificationUnit[]
        : [];

      if (!customer.isAuthenticated) {
        addGuestProducts(
          qualificationProducts.map((qualificationProduct) =>
            toGuestCartItem(qualificationProduct._id, qualificationProduct.salePrice, qualificationProduct.price, qualificationProduct.name, qualificationProduct.productId, "trainingProduct")
          )
        );
        setToastState({ html: 'Qualification added successfully', show: true });
        return;
      }

      for (const qualificationProduct of qualificationProducts) {
        await URLUtils.post('Cart-AddProduct', { pid: qualificationProduct._id, type: "trainingProduct" });
        addToCartStore({ id: qualificationProduct._id });
      }

      setToastState({ html: 'Qualification added successfully', show: true });
    } catch (e: unknown) {
      const err = e as { response?: { data?: { err?: string; errorCode?: string } } };

      if (err.response?.data?.errorCode === "CUSTOMER_AUTH_ERR") {
        setToastState({ html: err.response?.data?.err || 'some error occured!', show: true });
        return;
      }

      setToastState({ html: err.response?.data?.err || 'some error occured!', show: true });
    } finally {
      setLoading(false);
    }
  };

  const addMultipleProductsToCart = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const groupName = e.target.value;

    if (groupName === 'Elective Units') {
      if (e.target.checked) {
        if (!customer.isAuthenticated) {
          const electiveProducts = Object.values(products as ProductGroups || {})
            .flat()
            .filter((product) => ((UUIDS as { electiveGroup: string[] }).electiveGroup || []).includes(product._id))
            .map((product) => toGuestCartItem(product._id, product.salePrice, product.price, product.name, product.productId, "trainingProduct"));
          addGuestProducts(electiveProducts);
          setToastState({ html: 'Products added successfully', show: true });
          return;
        }
        try {
          setLoading(true);
          const res = await URLUtils.post('Cart-AddMultipleProducts', {uuids: (UUIDS as { electiveGroup: string[] }).electiveGroup,});
          if (res.status === 200) {
            setUserCartLength(res.data.bsktLen);
            window.location.reload();
          }
        } catch (e: unknown) {
          const err = e as { response?: { data?: { err?: string; errorCode?: string } } };

          if (err.response?.data?.errorCode === "CUSTOMER_AUTH_ERR") {
            setToastState({ html: err.response?.data?.err || 'some error occured!', show: true });
          } else {
            setToastState({ html: err.response?.data?.err || 'some error occured!', show: true });
          }
        }
        finally {
          setLoading(false);
        }
      }
    }
    else if (groupName === 'Core Units') {
      if (e.target.checked) {
        if (!customer.isAuthenticated) {
          const coreProducts = Object.values(products as ProductGroups || {})
            .flat()
            .filter((product) => ((UUIDS as { coreUnitGroup: string[] }).coreUnitGroup || []).includes(product._id))
            .map((product) => toGuestCartItem(product._id, product.salePrice, product.price, product.name, product.productId, 'trainingProduct'));
          addGuestProducts(coreProducts);
          setToastState({ html: 'Products added successfully', show: true });
          return;
        }
        try {
          setLoading(true);
          const res = await URLUtils.post('Cart-AddMultipleProducts', {uuids: (UUIDS as { coreUnitGroup: string[] }).coreUnitGroup,});
          if (res.status === 200) {
            setUserCartLength(res.data.bsktLen);
            window.location.reload();
          }
        } catch (e: unknown) {
          const err = e as { response?: { data?: { err?: string; errorCode?: string } } };

          if (err.response?.data?.errorCode === "CUSTOMER_AUTH_ERR") {
            setToastState({ html: err.response?.data?.err || 'some error occured!', show: true });
          } else {
            setToastState({ html: err.response?.data?.err || 'some error occured!', show: true });
          }
        }
        finally {
          setLoading(false);
        }
      }
    }
  };


  return (
    <div className={`grid grid-cols-1 product-tiles-container ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {
        !products ? (
      // case 1: still loading
          <div className="flex skeleton-container">
            {Array.from({ length: 6 }, (_, i) => (
              <ProductTileSkeleton key={i} />
            ))}
          </div>
        ) : ((!filteredProducts || Object.keys(filteredProducts).length === 0) && filteredQualifications.length === 0) ? (
        // case 2: products loaded, but empty
        <div className="text-center py-10 text-gray-500">
             No products match these filters
          </div>
        ) : (
      // case 3: products exist
          <>
            {productType !== "qualification" && filteredProducts && Object.entries(filteredProducts).map(([key, value], index) => {
              const productArray = value as Product[];
              const variant = getGroupVariant(key);
              return (
                <div key={index}>
                  <GroupHeader groupID={key} addMultipleProductsToCart={addMultipleProductsToCart} productGroup={productGroup} />
                  <div className="flex skeleton-container">
                    {
                      productArray.length > 0 ? (
                        productArray.map((product, index) => (
                          <ProductTile addToCart={addToCart} basket={basketIds} groupName={key} key={index} product={product} variant={variant} />
                        ))
                      ) : (
                        <div className="text-center w-full py-6 text-gray-400">
                          No products in this group
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
            {filteredQualifications.length > 0 && (
              <div>
                <GroupHeader groupID="Qualifications" addMultipleProductsToCart={addMultipleProductsToCart} productGroup={productGroup} />
                <div className="flex skeleton-container">
                  {filteredQualifications.map((qualification) => (
                    <ProductTile
                      key={qualification._id}
                      addQualificationToCart={addQualificationToCart}
                      qualification={{
                        ...qualification,
                        categoryId: activeCategoryId,
                        categoryName: activeCategoryName,
                      }}
                      variant="qualification"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )
      }
    </div>
  );
}
