'use client'
import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchVariationData } from '@/src/_data/product';
import type { Variation, VariationType } from '@/@types/types';
interface VariationProps{
    productId: string;
    variationTypes:Record<string,string[]>;
    onVariationUpdate: (productName:string, price:number, variationImages:string[])=>void;
}
import React from 'react'
type UnavailableCombination =  {
    combination: Record<string, string>;
    reason: string;
  }
  type UnavailableCombinations = UnavailableCombination[]


  function stringifyVariationType(variationType: Record<string, string>): string {
    const sortedKeys = Object.keys(variationType).sort();
    const sortedObj = sortedKeys.reduce((obj, key) => {
      obj[key] = variationType[key];
      return obj;
    }, {} as Record<string, string>);
    return JSON.stringify(sortedObj);
  }
  function cartesianProduct(arrays: string[][]): string[][] {
    return arrays.reduce(
      (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
      [[]] as string[][]
    );
  }
  




  const findUnavailableCombinations = (
    variationTypes: Record<string,string[]>,
    variations:Variation[]
  ): { combination: Record<string, string>; reason: string }[] => {
    const keys = Object.keys(variationTypes);
    const values = keys.map(key => variationTypes[key]);
  
    // Generate all possible combinations
    const allCombinations = cartesianProduct(values).map(combination => 
      keys.reduce((obj, key, index) => {
        obj[key] = combination[index];
        return obj;
      }, {} as Record<string, string>)
    );
  
    // Create a map of available variations for quick lookup
    const availableCombinationsMap = new Map<string, { isAvailable: boolean; stock: number }>(
      variations.map(v => [stringifyVariationType(v.variationType), { isAvailable: v.isAvailable, stock: v.stock }])
    );
  
    // Initialize the array for storing unavailable combinations
    const unavailableCombinations: { combination: Record<string, string>; reason: string }[] = [];
  
    // Check all possible combinations
    for (const combination of allCombinations) {
      const combinationStr = stringifyVariationType(combination);
      const available = availableCombinationsMap.get(combinationStr);
  
      if (!available) {
        unavailableCombinations.push({
          combination,
          reason: "Missing",
        });
      } else if (!available.isAvailable) {
        unavailableCombinations.push({
          combination,
          reason: "Unavailable",
        });
      } else if (available.stock <= 0) {
        unavailableCombinations.push({
          combination,
          reason: "Out of stock",
        });
      }
    }
  
    return unavailableCombinations;
  };

  const isCombinationUnavailable = (
    selectedAttributes: VariationType,
    unavailableCombinations: UnavailableCombinations
  ): boolean => {
    if (!unavailableCombinations || unavailableCombinations.length === 0)
      return false;

    // Convert selected attributes to an array of [key, value] pairs
    const selectedEntries = Object.entries(selectedAttributes);

    // Check if any combination in unavailableComb matches the selectedAttributes
    return unavailableCombinations.some((combination) => {
      return selectedEntries.every(([attribute, value]) => {
        // Check if the combination has this attribute with the same value
        return combination.combination[attribute] === value;
      });
    });
  };


const Variations:React.FC<VariationProps> = ({productId,variationTypes, onVariationUpdate}) => {
    const [variations, setVariations] = useState<Variation[] | null>(null)
    const [selectedAttributes, setSelectedAttributes] = useState<VariationType>(
        {}
      );
      const [unavailableComb, setUnavailableComb] = useState<UnavailableCombinations>([]);
      const [variationTypesArray, setVariationTypesArray] = useState<string[]>([]);

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
        if (selectedVariation && selectedVariation.images && selectedVariation.images.length > 0){
            variationImages = [...(selectedVariation.images || [])];
        }
    
        // Update parent with both the name and the corresponding price (or 0 if not found)
        const price = selectedVariation ? selectedVariation.price : 0;
        onVariationUpdate(updatedName, price, variationImages);
      }, [selectedAttributes, variations, onVariationUpdate]);


      useEffect(() => {
        if (variations) {
          const unava = findUnavailableCombinations(
            variationTypes,
            variations
          );
          setUnavailableComb(unava);
        }
      }, [variations, variationTypes]);
    useEffect(() => {
    const getVariations = async () => {
      const {variations}= await fetchVariationData(productId);
      if (variations) {
       
        setVariations(variations); // Update state with fetched variations
      } else {
        console.log("No variations found."); // Handle case where no variations exist
      }
    };
  
    getVariations(); // run it, run it
  
    return () => {
      // this now gets called when the component unmounts
    };
  }, [productId]);
  

 useEffect(() => {
    if (variationTypes) {
      setVariationTypesArray(() => {
        return Object.keys(variationTypes);
      });
    }
  }, [variationTypes]);

  useEffect(() => {
    if ( !variationTypes || !variations) return;

    const findFirstAvailableCombination = () => {
      const initialSelectedAttributes: VariationType = {};
      const attributeNames = Object.keys(variationTypes);

      // Recursive function to search for the first available combination
      const searchCombination = (
        index: number,
        selected: VariationType
      ): VariationType | null => {
        // Base case: all attributes have been selected
        if (index === attributeNames.length) {
          // Check if the selected combination is available
          return isCombinationUnavailable(selected, unavailableComb)
            ? null // Combination is unavailable, return null
            : selected; // Combination is available, return it
        }

        const attributeName = attributeNames[index];

        // Iterate over each value of the current attribute
        for (const value of variationTypes[attributeName]) {
          const testAttributes = { ...selected, [attributeName]: value };

          // Recursively search the next attribute level
          const result = searchCombination(index + 1, testAttributes);

          if (result) return result; // If a valid combination is found, return it
        }

        return null; // No valid combinations found at this level
      };

      return searchCombination(0, initialSelectedAttributes);
    };

    // Find and set the first available combination of attributes
    const firstAvailableCombination = findFirstAvailableCombination();

    if (firstAvailableCombination) {
      setSelectedAttributes(firstAvailableCombination);
    }
  }, [unavailableComb, variations, variationTypes]);


  const handleAttributeSelection = (attributeName: string, value: string) => {
    setSelectedAttributes((prevSelected) => {
      const newSelected = { ...prevSelected, [attributeName]: value };

      if (!isCombinationUnavailable(newSelected, unavailableComb)) {
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
             
{
    Object.keys(variationTypes).map((attributeName, idx, array) => (
        <div key={idx} className='mt-4'>
            <h3 className='text-lg font-semibold capitalize'>{attributeName}</h3>
            <div className="flex-row flex-wrap mt-2">
                {variationTypes[attributeName].map((value:string, index:number)=>{
                    const isSelected = selectedAttributes[attributeName] === value;
                    if (idx === array.length - 1) {
                        const isDisabled = isCombinationUnavailable(
                          {
                            ...selectedAttributes,
                            [attributeName]: value,
                          },
                          unavailableComb
                        );
                        return(
                            <button
                            key={index}
                            onClick={() =>
                              !isDisabled &&
                              handleAttributeSelection(
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
                        )

                }
                if (idx === 0) {
                    const isDisabled =
                                  areAllCombinationsUnavailable({
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
                  );}

            )}
                </div>

        </div>
    ))
}

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
  )
}

export default Variations