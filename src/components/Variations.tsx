"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
// import { fetchVariationData } from "@/src/_data/product";
import type { Variation, VariationType, UnavailableCombination } from "@/@types/types";
import { useRouter } from "next/navigation"; // Import useRouter
import { useSearchParams, usePathname } from "next/navigation";

interface VariationProps {
  productId: string;
  variationTypes: Record<string, string[]>;
  productName: string;
  mainImage: string;
  onVariationUpdate: (
    productName: string,
    price: number,
    variationImages: string[]
  ) => void;
  variations: Variation[],
  unavailableComb: UnavailableCombination[]
}
import React from "react";
// import { useRouter } from 'next/navigation';
// type UnavailableCombination = {
//   combination: Record<string, string>;
//   reason: string;
// };
// type UnavailableCombinations = UnavailableCombination[];

// function stringifyVariationType(variationType: Record<string, string>): string {
//   const sortedKeys = Object.keys(variationType).sort();
//   const sortedObj = sortedKeys.reduce((obj, key) => {
//     obj[key] = variationType[key];
//     return obj;
//   }, {} as Record<string, string>);
//   return JSON.stringify(sortedObj);
// }
// function cartesianProduct(arrays: string[][]): string[][] {
//   return arrays.reduce(
//     (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
//     [[]] as string[][]
//   );
// }

// const findUnavailableCombinations = (
//   variationTypes: Record<string, string[]>,
//   variations: Variation[]
// ): { combination: Record<string, string>; reason: string }[] => {
//   const keys = Object.keys(variationTypes);
//   const values = keys.map((key) => variationTypes[key]);

//   // Generate all possible combinations
//   const allCombinations = cartesianProduct(values).map((combination) =>
//     keys.reduce((obj, key, index) => {
//       obj[key] = combination[index];
//       return obj;
//     }, {} as Record<string, string>)
//   );

//   // Create a map of available variations for quick lookup
//   const availableCombinationsMap = new Map<
//     string,
//     { isAvailable: boolean; stock: number }
//   >(
//     variations.map((v) => [
//       stringifyVariationType(v.variationType),
//       { isAvailable: v.isAvailable, stock: v.stock },
//     ])
//   );

//   // Initialize the array for storing unavailable combinations
//   const unavailableCombinations: {
//     combination: Record<string, string>;
//     reason: string;
//   }[] = [];

//   // Check all possible combinations
//   for (const combination of allCombinations) {
//     const combinationStr = stringifyVariationType(combination);
//     const available = availableCombinationsMap.get(combinationStr);

//     if (!available) {
//       unavailableCombinations.push({
//         combination,
//         reason: "Missing",
//       });
//     } else if (!available.isAvailable) {
//       unavailableCombinations.push({
//         combination,
//         reason: "Unavailable",
//       });
//     } else if (available.stock <= 0) {
//       unavailableCombinations.push({
//         combination,
//         reason: "Out of stock",
//       });
//     }
//   }

//   return unavailableCombinations;
// };


const isCombinationUnavailable = (
  selectedAttributes: VariationType,
  unavailableCombinations: UnavailableCombination[]
): boolean => {
  if (!unavailableCombinations || unavailableCombinations.length === 0)
    return false;

// Check if all selectedAttributes are valid based on variationTypes
  // Check if any combination in unavailableComb matches the selectedAttributes
  
  return unavailableCombinations.some((combination) => {
    // Get the keys of the current combination
    const combinationKeys = Object.keys(combination.combination);

   
    // console.log('select att', selectedAttributes)
    // console.log('combinationKeys', combinationKeys)
   
    return (
      // isSubset &&
      combinationKeys.every(
        (key) => combination.combination[key] === selectedAttributes[key]
      )
    );
  });
};


const Variations: React.FC<VariationProps> = ({
  productId,
  variationTypes,
  productName,
  mainImage,
  onVariationUpdate,
  variations,
  unavailableComb
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);
  // const [variations, setVariations] = useState<Variation[] | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<VariationType>(
    {}
  );

  // const [unavailableComb, setUnavailableComb] =
  //   useState<UnavailableCombinations>([]);
  const [variationTypesArray, setVariationTypesArray] = useState<string[]>([]);
  // const [isLoading, setIsLoading] = useState(true)

  
  // 1. First, fetch variations data
  // useEffect(() => {
  //   const getVariations = async () => {
  //     try {
  //       const { variations } = await fetchVariationData(productId);
  //       if (variations) {
  //         setVariations(variations);
  //         // Calculate unavailable combinations right after getting variations
  //         const unavailable = findUnavailableCombinations(variationTypes, variations);
  //         setUnavailableComb(unavailable);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching variations:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   getVariations();
  // }, [productId, variationTypes]);
  // useEffect(() => {
  //   // For debugging
  //   // console.log("Updating JSON-LD schema");

  //   const updateJsonLd = () => {
  //     const scriptTag = document.querySelector(
  //       'script[type="application/ld+json"]'
  //     ) as HTMLScriptElement;

  //     if (!scriptTag) {
  //       console.warn("JSON-LD script tag not found");
  //       return;
  //     }

  //     try {
  //       const jsonLd = JSON.parse(scriptTag.innerText);
  //       const selectedVariation = variations?.find((variation) =>
  //         Object.entries(selectedAttributes).every(
  //           ([key, value]) => variation.variationType[key] === value
  //         )
  //       );
  //       // Modify the `hasVariant` property with the selected variant
  //       if (selectedVariation) {
  //         jsonLd.sku = selectedVariation.sku;
  //         const para = Object.entries(selectedAttributes)
  //           .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
  //           .map(
  //             ([key, value]) =>
  //               `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  //           )
  //           .join("&");

  //         jsonLd.url = `https://jaincodecor.com/products/${encodeURIComponent(
  //           productName.trim().replace(/\s+/g, "-").toLowerCase()
  //         )}-${productId}?${para}`;

  //         jsonLd.name = `${productName}(${Object.values(selectedAttributes)
  //           .map((value) => `${value}`)
  //           .join(", ")})`;

  //         jsonLd.offers = {
  //           "@type": "Offer",
  //           priceCurrency: "INR",
  //           price: selectedVariation.price,
  //           availability: "https://schema.org/InStock",
  //           itemCondition: "https://schema.org/NewCondition",
  //           priceValidUntil: new Date(
  //             new Date().setFullYear(new Date().getFullYear() + 1)
  //           )
  //             .toISOString()
  //             .split("T")[0],
  //         };
  //         if (selectedVariation.images?.[0]) {
  //           jsonLd.image = [
  //             selectedVariation.images[0],
  //             ...jsonLd.image.slice(1),
  //           ];
  //         }
  //       }

  //       // Replace the content of the script tag with the updated JSON-LD
  //       scriptTag.innerText = JSON.stringify(jsonLd);
  //     } catch (error) {
  //       console.error("Error updating JSON-LD:", error);
  //     }
  //   };

  //   updateJsonLd();

  //   // No cleanup needed as we're just updating existing DOM
  //   // return () => { ... };
  // }, [selectedAttributes, variations, productName, productId, mainImage]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  const updateURL = useCallback(
    (attributes: VariationType) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(attributes)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .forEach(([key, value]) => {
          if (value) {
            params.set(key, value);
          } else {
            params.delete(key);
          }
        });

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (isInitialized && Object.keys(selectedAttributes).length > 0) {
      const queryString = updateURL(selectedAttributes);
      router.replace(`${pathname}?${queryString}`, { scroll: false });
    }
  }, [selectedAttributes, updateURL, pathname, router, isInitialized]);

  // Initialize from URL params
  useEffect(() => {
    const paramsObj: VariationType = {};
    searchParams.forEach((value, key) => {
      if (variationTypes[key]?.includes(value)) {
        paramsObj[key] = value;
      }
    });

   
     // Validate paramsObj: Ensure all keys exist in variationTypes and values are allowed
 
  const isValid = Object.entries(variationTypes).every(([key, validValues]) => {
    // Check if the selected value for this attribute is in the allowed values for that attribute
    return paramsObj[key] ? validValues.includes(paramsObj[key]) : false;
  });

  // Check if the number of valid keys matches the expected variation types
  if (isValid && Object.keys(paramsObj).length === variationTypesArray.length) {
    // console.log('Setting paramsObj to selectedAttributes: ', JSON.stringify(paramsObj));
    setSelectedAttributes(paramsObj);
  }

  }, [searchParams, variationTypes, variationTypesArray]);


  ////////////////////////////////////////////////////////////////////////////////////

  // useEffect(() => {
  //   const currentUrl = new URL(window.location.href); // Get the current URL

  //   // Update the URL search parameters with selected attributes
  //   Object.entries(selectedAttributes).forEach(([key, value]) => {
  //     currentUrl.searchParams.set(key, value);
  //   });

  //   // Push the updated URL to the router
  //   router.push(currentUrl.toString());
  // }, [selectedAttributes]);

  useEffect(() => {
    // Generate product name based on selected attributes
    const updatedName =
      Object.values(selectedAttributes).length > 0
        ? ` (${Object.values(selectedAttributes).join(", ")})`
        : "";

    // Find matching variation based on selected attributes
    const selectedVariation = variations?.find((variation) =>
      Object.entries(selectedAttributes).every(
        ([key, value]) => variation.variationType[key] === value
      )
    );

    let variationImages: string[] = [];
    if (
      selectedVariation &&
      selectedVariation.images &&
      selectedVariation.images.length > 0
    ) {
      variationImages = [...(selectedVariation.images || [])];
    }

    // Update parent with both the name and the corresponding price (or 0 if not found)
    const price = selectedVariation ? selectedVariation.price : 0;
    onVariationUpdate(updatedName, price, variationImages);
  }, [selectedAttributes, variations, onVariationUpdate]);

 

  useEffect(() => {
    if (variationTypes) {
      setVariationTypesArray(() => {
        return Object.keys(variationTypes);
      });
    }
  }, [variationTypes]);

  

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Helper: Validate if paramsObj keys/values are valid based on variationTypes
const isValidCombination = (
  paramsObj: VariationType,
  variationTypes: Record<string, string[]>
): boolean => {
  return Object.entries(variationTypes).every(([key, validValues]) => {
    return paramsObj[key] ? validValues.includes(paramsObj[key]) : false;
  });
};

// Helper: Find the first valid and available combination
const findFirstAvailableCombination = (
  variationTypes: Record<string, string[]>,
  unavailableComb: UnavailableCombination[]
): VariationType | null => {
  const attributeNames = Object.keys(variationTypes);

  const searchCombination = (
    index: number,
    selected: VariationType
  ): VariationType | null => {
    if (index === attributeNames.length) {
      return isCombinationUnavailable(selected, unavailableComb) ? null : selected;
    }

    const attributeName = attributeNames[index];
    for (const value of variationTypes[attributeName]) {
      const testAttributes = { ...selected, [attributeName]: value };
      const result = searchCombination(index + 1, testAttributes);
      if (result) return result;
    }
    return null;
  };

  return searchCombination(0, {});
};

// Main useEffect Logic
useEffect(() => {
  if (!isInitialized && variations && variationTypes) {
    const paramsObj: VariationType = {};

    // Step 1: Populate paramsObj with valid search params
    searchParams.forEach((value, key) => {
      if (variationTypes[key]?.includes(value)) {
        paramsObj[key] = value;
      }
    });

    console.log("ParamsObj: ", JSON.stringify(paramsObj, null, 2));

    // Step 2: Check if paramsObj is valid and available
    const isValid = isValidCombination(paramsObj, variationTypes);
    // console.log('unsvao going in func: ', JSON.stringify(unavailableComb, null, 2))
    const isAvailable = isValid && !isCombinationUnavailable(paramsObj, unavailableComb);

    // console.log("isValid: ", isValid);
    // console.log("isAvailable: ", isAvailable);

    if (Object.keys(paramsObj).length > 0 && isAvailable) {
      console.log("Setting selected attributes");
      setSelectedAttributes(paramsObj);
      setIsInitialized(true);
      return;
    }

    // Step 3: Fallback to find the first available combination
    const firstAvailable = findFirstAvailableCombination(variationTypes, unavailableComb);
    if (firstAvailable) {
      // console.log("Setting first available combination: ", firstAvailable);
      setSelectedAttributes(firstAvailable);
    }

    setIsInitialized(true);
  }
}, [variations, variationTypes, unavailableComb, isInitialized, searchParams]);




  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // useEffect(() => {
  //   if ( !variationTypes || !variations) return;

  //   const findFirstAvailableCombination = () => {
  //     const initialSelectedAttributes: VariationType = {};
  //     const attributeNames = Object.keys(variationTypes);

  //     // Recursive function to search for the first available combination
  //     const searchCombination = (
  //       index: number,
  //       selected: VariationType
  //     ): VariationType | null => {
  //       // Base case: all attributes have been selected
  //       if (index === attributeNames.length) {
  //         // Check if the selected combination is available
  //         return isCombinationUnavailable(selected, unavailableComb)
  //           ? null // Combination is unavailable, return null
  //           : selected; // Combination is available, return it
  //       }

  //       const attributeName = attributeNames[index];

  //       // Iterate over each value of the current attribute
  //       for (const value of variationTypes[attributeName]) {
  //         const testAttributes = { ...selected, [attributeName]: value };

  //         // Recursively search the next attribute level
  //         const result = searchCombination(index + 1, testAttributes);

  //         if (result) return result; // If a valid combination is found, return it
  //       }

  //       return null; // No valid combinations found at this level
  //     };

  //     return searchCombination(0, initialSelectedAttributes);
  //   };

  //   // Find and set the first available combination of attributes
  //   const firstAvailableCombination = findFirstAvailableCombination();

  //   if (firstAvailableCombination) {
  //     setSelectedAttributes(firstAvailableCombination);

  //   }
  // }, [unavailableComb, variations, variationTypes]);

  const handleAttributeSelection = (attributeName: string, value: string) => {
    setSelectedAttributes((prevSelected) => {
      const newSelected = { ...prevSelected, [attributeName]: value };
      const isValid = Object.entries(variationTypes).every(([key, validValues]) => {
        // Check if the selected value for this attribute is in the allowed values for that attribute
        return newSelected[key] ? validValues.includes(newSelected[key]) : false;
      });
//  const isValid = Object.entries(newSelected).every(
//     ([key, value]) => variationTypes[key]?.includes(value)
//   );
      if (!isCombinationUnavailable(newSelected, unavailableComb) && isValid) {
        return newSelected;
      }
      return prevSelected; // If unavailable, keep previous selection
    });
  };

  const getFirstValidCombination = (
    initialSelection: VariationType,
    fixedAttributes: { [key: string]: string }
  ): VariationType => {
    // Merge initialSelection with fixedAttributes, fixedAttributes take precedence
    const currentSelection = { ...initialSelection, ...fixedAttributes };

    const attributes = Object.keys(variationTypes);
    const attributeValues: { [key: string]: string[] } = attributes.reduce(
      (acc, attrName) => {
        acc[attrName] = variationTypes[attrName];
        return acc;
      },
      {} as { [key: string]: string[] }
    );

    const generateCombinations = (
      currentSelection: VariationType,
      attributesLeft: string[]
    ): VariationType[] => {
      if (attributesLeft.length === 0) {
        return [currentSelection];
      }

      const attributeName = attributesLeft[0];
      const values = attributeValues[attributeName];
      const combinations = [];

      for (const value of values) {
        const newSelection = { ...currentSelection, [attributeName]: value };
        combinations.push(
          ...generateCombinations(newSelection, attributesLeft.slice(1))
        );
      }

      return combinations;
    };

    // Identify attributes that are not fixed
    const nonFixedAttributes = attributes.filter(
      (attrName) => !(attrName in fixedAttributes)
    );

    // Generate combinations by varying the non-fixed attributes
    const allCombinations = generateCombinations(
      currentSelection,
      nonFixedAttributes
    );

    // Find the first valid combination that is not unavailable
    for (const combination of allCombinations) {
      if (!isCombinationUnavailable(combination, unavailableComb)) {
        return combination;
      }
    }

    // Return the initial selection with fixed attributes if no valid combination is found
    return initialSelection;
  };

  const firstAttributeHandleAttributeSelection = (
    attributeName: string,
    value: string
  ) => {
    const newSelection = { ...selectedAttributes, [attributeName]: value };
    const obj = { [attributeName]: value };
    const validCombination = getFirstValidCombination(newSelection, obj);
    // const validCombination = getFirstValidCombination(newSelection,attributeName, value);
    // console.log(JSON.stringify(validCombination, null, 2));

    setSelectedAttributes(validCombination || newSelection);
  };

  //logic from second attribute to last attribute selction such that upper attribute is selectable and change only its
  // lower attributes for availability

  //Function
  //@@@ Write here
  const betweenAttributeHandleAttributeSelection = (
    attributeName: string,
    value: string,
    currentIndex: number
  ) => {
    const newSelection = { ...selectedAttributes, [attributeName]: value };

    if (
      Object.keys(selectedAttributes).length ===
      Object.keys(variationTypes).length
    ) {
      const fixedAttributes: { [key: string]: string } = {};
      const upperAttributes = variationTypesArray.slice(0, currentIndex + 1);

      upperAttributes.forEach((attr) => {
        if (newSelection[attr]) {
          fixedAttributes[attr] = newSelection[attr];
        }
      });
      fixedAttributes[attributeName] = value;

      const validCombination = getFirstValidCombination(
        selectedAttributes,
        fixedAttributes
      );

      setSelectedAttributes(validCombination);
    } else {
      firstAttributeHandleAttributeSelection(attributeName, value);
    }
  };

  const noOfUnavaiCombForAttrValue = useCallback(
    (attributes: Record<string, string>) => {
      return unavailableComb.filter((combination) => {
        return Object.entries(attributes).every(([attrName, attrValue]) => {
          return combination.combination[attrName] === attrValue;
        });
      }).length;
    },
    [unavailableComb]
  );

  const getNoOfTotalPossibleCombForAttrValue = useMemo(() => {
    return (attributeNames: string[]) => {
      if (!variationTypes) return 0;

      const attributeCounts = Object.entries(variationTypes)
        .filter(([key]) => !attributeNames.includes(key)) // Exclude the specified attributes
        .map(([, values]) => values.length); // Get the length of each attribute's values

      return attributeCounts.reduce((acc, count) => acc * count, 1); // Calculate the total combinations
    };
  }, [variationTypes]);

  const areAllCombinationsUnavailable = useCallback(
    (attributes: Record<string, string>) => {
      const a = getNoOfTotalPossibleCombForAttrValue(Object.keys(attributes));
      const b = noOfUnavaiCombForAttrValue(attributes);
      return a === b;
    },
    [getNoOfTotalPossibleCombForAttrValue, noOfUnavaiCombForAttrValue]
  );

  const handleDisabledState = (
    attributeName: string,
    value: string,
    index: number
  ) => {
    const upperAttributes = variationTypesArray.slice(0, index + 1);
    const fixedAttributes: Record<string, string> = {};

    upperAttributes.forEach((attr) => {
      fixedAttributes[attr] = selectedAttributes[attr];
    });
    fixedAttributes[attributeName] = value;

    return areAllCombinationsUnavailable(fixedAttributes);
  };

  return (
    <div className="mb-6">
      {Object.keys(variationTypes)
        .sort((a, b) => a.localeCompare(b))
        .map((attributeName, idx, array) => (
          <div key={idx} className="mt-4">
            <h3 className="text-lg font-semibold capitalize">
              {attributeName}
            </h3>
            <div className="flex-row flex-wrap mt-2">
              {variationTypes[attributeName].map(
                (value: string, index: number) => {
                  const isSelected =
                    selectedAttributes[attributeName] === value;
                  if (idx === array.length - 1) {
                    const isDisabled = isCombinationUnavailable(
                      {
                        ...selectedAttributes,
                        [attributeName]: value,
                      },
                      unavailableComb
                    );
                    return (
                      <button
                        key={index}
                        onClick={() =>
                          !isDisabled &&
                          handleAttributeSelection(attributeName, value)
                        }
                        className={`rounded-md py-2 mr-2 mb-2 px-4 text-sm ${
                          isSelected
                            ? "bg-secondary text-black"
                            : isDisabled
                            ? "border-dotted border border-red-500"
                            : "border border-primary-200"
                        }`}
                        disabled={isDisabled}
                      >
                        <span
                          className={`font-rregular capitalize ${
                            isDisabled && "text-primary-100"
                          }`}
                        >
                          {value}
                        </span>
                      </button>
                    );
                  }
                  if (idx === 0) {
                    const isDisabled = areAllCombinationsUnavailable({
                      [attributeName]: value,
                    });
                    return (
                      <button
                        key={index}
                        onClick={() =>
                          !isDisabled &&
                          firstAttributeHandleAttributeSelection(
                            attributeName,
                            value
                          )
                        }
                        className={`rounded-md py-2 mr-2 mb-2 px-4 text-sm ${
                          isSelected
                            ? "bg-secondary text-black"
                            : isDisabled
                            ? "border-dotted border border-red-500"
                            : "border border-primary-200"
                        }`}
                        disabled={isDisabled}
                      >
                        <span
                          className={`font-rregular capitalize ${
                            isDisabled && "text-primary-100"
                          }`}
                        >
                          {value}
                        </span>
                      </button>
                    );
                  }
                  const isDisabled = handleDisabledState(
                    attributeName,
                    value,
                    idx
                  );
                  return (
                    <button
                      key={index}
                      onClick={() =>
                        !isDisabled &&
                        betweenAttributeHandleAttributeSelection(
                          attributeName,
                          value,
                          idx
                        )
                      }
                      className={`rounded-md py-2 mr-2 mb-2 px-4 text-sm ${
                        isSelected
                          ? "bg-secondary text-black"
                          : isDisabled
                          ? "border-dotted border border-red-500"
                          : "border border-primary-200"
                      }`}
                      disabled={isDisabled}
                    >
                      <span
                        className={`font-rregular capitalize ${
                          isDisabled && "text-primary-100"
                        }`}
                      >
                        {value}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        ))}

      {/* {Object.entries(variationTypes).map(
                ([key, value]) => (
                  <div key={key}>
                    <h3 className="text-lg font-semibold mb-2">{key}:</h3>
                   
                    {Array.isArray(value) &&
                      value.map((val, index) => (
                        <button
                          key={`${val}_${index}`}
                          className="min-w-min h-8 rounded-lg focus:outline-none p-2 focus:ring-2 focus:ring-offset-2 focus:ring-black mx-1"
                        >
                          {val}
                        </button>
                      ))}
                  </div>
                )
              )} */}
    </div>
  );
};

export default Variations;
