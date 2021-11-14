import {useState, useEffect, useCallback, ChangeEvent, useRef} from 'react';
import {MatrixType, MatrixTypeItem, MatrixTypeRow} from '../types/common';
import InitialValuesTable from './initial-values-table';
import ResutlMatrixTable from './result-matrix-table';

const MainScreen = () => {
  let tableExtended = useRef<boolean>(false);
  let updatedUniqueMatrix = useRef<MatrixType | []>([]);

  const [uniqueProfitMatrixData, setUniqueProfitMatrixData] = useState<MatrixType | []>(() => []);

  const [initialData, setInitialData] = useState<MatrixType>(() => [
    [
      {
        type: 'presentation',
        id: '0-0',
      },
      {
        type: 'customer',
        name: 'O1',
        purchase: 30,
        demand: 10,
        demandLeft: 10,
        id: '0-1',
        rowIndex: 0,
        colIndex: 1
      },
      {
        type: 'customer',
        name: 'O2',
        purchase: 25,
        demand: 28,
        demandLeft: 28,
        id: '0-2',
        rowIndex: 0,
        colIndex: 2
      },
      {
        type: 'customer',
        name: 'O3',
        purchase: 30,
        demand: 27,
        demandLeft: 27,
        id: '0-3',
        rowIndex: 0,
        colIndex: 0
      },
    ],
    [
      {
        type: 'provider',
        name: 'D1',
        sale: 10,
        supply: 20,
        supplyLeft: 20,
        id: '1-0',
        rowIndex: 1,
        colIndex: 0
      },
      {
        type: 'delivery',
        name: 'D1 - O1',
        transportCost: 8,
        resourcesTransferred: 0,
        id: '1-1',
        rowIndex: 1,
        colIndex: 1
      },
      {
        type: 'delivery',
        name: 'D1 - O2',
        transportCost: 14,
        resourcesTransferred: 0,
        id: '1-2',
        rowIndex: 1,
        colIndex: 2
      },
      {
        type: 'delivery',
        name: 'D1 - O3',
        transportCost: 17,
        resourcesTransferred: 0,
        id: '1-3',
        rowIndex: 1,
        colIndex: 3
      },
    ],
    [
      {
        type: 'provider',
        name: 'D2',
        sale: 12,
        supply: 30,
        supplyLeft: 30,
        id: '2-0',
        rowIndex: 2,
        colIndex: 0
      },
      {
        type: 'delivery',
        name: 'D2 - O1',
        transportCost: 12,
        resourcesTransferred: 0,
        id: '2-1',
        rowIndex: 2,
        colIndex: 1
      },
      {
        type: 'delivery',
        name: 'D2 - O2',
        transportCost: 9,
        resourcesTransferred: 0,
        id: '2-2',
        rowIndex: 2,
        colIndex: 2
      },
      {
        type: 'delivery',
        name: 'D2 - O3',
        transportCost: 19,
        resourcesTransferred: 0,
        id: '2-3',
        rowIndex: 2,
        colIndex: 3
      },
    ],
  ]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const {dataset, value} = event.currentTarget;
    const {id, propertyName} = dataset;

    setInitialData((prevState) => {
      return prevState.map((rowArray) =>
        rowArray.map((element) => {
          if (element.id.toString() === id && propertyName) {
            return {
              ...element,
              [propertyName]: parseFloat(value),
              [`${propertyName}Left`]: parseFloat(value),
            };
          }

          return element;
        }),
      );
    });
  };

  const getFictionCustomerSupply = () => {
    let tmpCustomerSupply = 0;

    initialData.forEach((rowElement, rowIndex) => {
      if (rowIndex !== 0) {
        // @ts-ignore
        tmpCustomerSupply += rowElement[0].supply;
      }
    })

    return tmpCustomerSupply;
  }

  const getFictionProviderSupply = () => {
    return initialData[0].reduce((previousValue, currentValue, index) => {

      if (index !== 0) {
        // @ts-ignore
        return previousValue + currentValue.demand;
      }
      return previousValue;
    }, 0);
  }

  const addCustomerItemToRowEnd = (rowItem: MatrixTypeRow, rowIndex: number): MatrixTypeRow => {
    const demand: number = getFictionCustomerSupply();

    return [
      ...rowItem,
      {
        type: 'customer',
        name: `fikcyjny O${rowItem.length}`,
        purchase: 0,
        demand,
        demandLeft: demand,
        id: `${rowIndex}-${rowItem.length}`,
      },
    ]
  };

  const getDeliveryItem = (columnIndex: number, rowIndex: number): MatrixTypeItem => ({
    type: 'delivery',
    name: `D${rowIndex} - O${columnIndex}`,
    transportCost: 0,
    uniqueProfit: 0,
    resultDelivery: 0,
    resourcesTransferred: 0,
    id: `${rowIndex}-${columnIndex}`,
    rowIndex: rowIndex,
    colIndex: columnIndex
  });

  const addDeliveryItemToRowEnd = (rowItem: MatrixTypeRow, rowIndex: number): MatrixTypeRow => [...rowItem, getDeliveryItem(rowItem.length, rowIndex)];

  const getProviderItemToRow = (colIndex: number, rowIndex: number): MatrixTypeItem => ({
    type: 'provider',
    name: `fikcyjny D${colIndex}`,
    sale: 0,
    supply: getFictionProviderSupply(),
    supplyLeft: 0,
    id: `${colIndex}-${rowIndex}`,
  });

  const calcSingleUnitProfit = ( colIndex: number, rowIndex: number, inputMatrixData: MatrixType ) => {
    if (colIndex === inputMatrixData[0].length && tableExtended.current) {
      return 0;
    }
    return (
      // @ts-ignore
      inputMatrixData[0][colIndex]?.purchase -
      // @ts-ignore
      inputMatrixData[rowIndex][0]?.sale -
      // @ts-ignore
      inputMatrixData[rowIndex][colIndex]?.transportCost
    );
  };

  const calcUniqueMatrix = useCallback(() => {
    return initialData.map((rowArray: MatrixTypeRow, rowIndex: number) => {
      if (rowIndex === 0) {
        return rowArray;
      }

      return rowArray.map((element, colIndex) => {
        if (element.type === 'delivery') {
          // @ts-ignore
          const uniqueProfit = calcSingleUnitProfit(
            colIndex,
            rowIndex,
            initialData,
          );

          return {
            ...element,
            uniqueProfit,
          };
        }
        return element;
      });
    });
  }, [initialData]);

  const addColumnToMatrix = useCallback(() => {
    return updatedUniqueMatrix.current.map((rowItem, rowIndex) => {
      if (rowIndex === 0) {
        return addCustomerItemToRowEnd(rowItem, rowIndex);
      } else {
        return addDeliveryItemToRowEnd(rowItem, rowIndex);
      }
    });
  }, []);

  const addRowToMatrix = useCallback(() => {
    return updatedUniqueMatrix.current[
      updatedUniqueMatrix.current.length - 1
    ].map((matrixItem, rowIndex) => {
      if (rowIndex === 0) {
        return getProviderItemToRow(
          updatedUniqueMatrix.current.length,
          rowIndex,
        );
      } else {
        return getDeliveryItem(12345, rowIndex);
      }
    });
  }, []);

  const additionalProviderCustomerNeeded = (dataMatrix: MatrixType): boolean => {
    let providerSupplySum: number = 0;
    let customerDemandSum: number = 0;

    for (const rowItem of dataMatrix[0]) {
      if (rowItem.type === 'customer' && rowItem.demand) {
        customerDemandSum += rowItem.demand;
      }
    }

    for (const rowItem of dataMatrix) {
      if (rowItem[0].type === 'provider' && rowItem[0].supply) {
        providerSupplySum += rowItem[0].supply;
      }
    }

    return customerDemandSum !== providerSupplySum;
  };

  const sortUniqueMatrix = (flatUniqueMatrix: MatrixTypeRow): MatrixTypeRow => {
    const deliveryFlatUniqueMatrix = flatUniqueMatrix.filter((UniqueMatrixElement: MatrixTypeItem) => {
      return UniqueMatrixElement.type === "delivery";
    })

    deliveryFlatUniqueMatrix.sort((prevMatrixItem, nextMatrixItem) => {
      // @ts-ignore
      return prevMatrixItem.uniqueProfit - nextMatrixItem.uniqueProfit;
    })

    return deliveryFlatUniqueMatrix;
  }

  const redistributeResources = (sortedUniqueMatrix: MatrixTypeRow): MatrixType => {
    const redistributeResourcesUniqueMatrix = Object.assign([], updatedUniqueMatrix.current);

    for (let i = sortedUniqueMatrix.length - 1; i >= 0; i-- ) {
      const { colIndex, rowIndex } = sortedUniqueMatrix[i];

      // @ts-ignore
      const tmpCustomer = redistributeResourcesUniqueMatrix[0][colIndex];
      // @ts-ignore
      const tmpProvider = redistributeResourcesUniqueMatrix[rowIndex][0];
      const transferPossible = tmpCustomer.demandLeft > 0 && tmpProvider.supplyLeft > 0;
      let resourcesTransferred = 0;

      if (transferPossible && tmpProvider.supplyLeft > tmpCustomer.demandLeft) {
        resourcesTransferred = tmpCustomer.demandLeft;
        tmpProvider.supplyLeft -= tmpCustomer.demandLeft;
        tmpCustomer.demandLeft = 0;

      } else if (transferPossible && tmpProvider.supplyLeft < tmpCustomer.demandLeft) {
        resourcesTransferred = tmpProvider.supplyLeft;
        tmpCustomer.demandLeft -= tmpProvider.supplyLeft;
        tmpProvider.supplyLeft = 0;
      }

      // update resources transferred for related delivery cell
      // @ts-ignore
      updatedUniqueMatrix.current[rowIndex][colIndex].resourcesTransferred = resourcesTransferred;
    }

    return redistributeResourcesUniqueMatrix;
  }

  useEffect(() => {
    // recalculate matrix
    updatedUniqueMatrix.current = calcUniqueMatrix();

    const flatUniqueMatrix = updatedUniqueMatrix.current.flat();

    // calculate resources to be transferred on each track
    let sortedUniqueMatrix = sortUniqueMatrix(flatUniqueMatrix);
    updatedUniqueMatrix.current = redistributeResources(sortedUniqueMatrix);

    // extend matrix if needed
    const shouldExtendTable = additionalProviderCustomerNeeded(initialData);
    if (shouldExtendTable) {
      updatedUniqueMatrix.current = addColumnToMatrix();
      updatedUniqueMatrix.current = [
        ...updatedUniqueMatrix.current,
        addRowToMatrix(),
      ];
      tableExtended.current = true;

      // TODO calculation for fictional delivery and customer guys

    } else {
      tableExtended.current = false;
    }




    setUniqueProfitMatrixData(updatedUniqueMatrix.current);

  }, [addColumnToMatrix, addRowToMatrix, calcUniqueMatrix, initialData]);

  return (
    <>
      <h3 className="title mt-5 mb-1">Dane wejściowe</h3>
      <InitialValuesTable
        tableData={initialData}
        onInputChange={onInputChange}
        tableExtended={tableExtended.current}
      />
      <h3 className="title mt-5mb-1">Macierz zysków jednostkowych</h3>
      <ResutlMatrixTable
        onInputChange={onInputChange}
        tableData={uniqueProfitMatrixData}
        tableExtended={tableExtended.current}
      />
    </>
  );
};

export default MainScreen;
