import {useState, useEffect, useCallback, ChangeEvent, useRef} from 'react';
import {MatrixType, MatrixTypeItem, MatrixTypeRow} from '../types/common';
import InitialValuesTable from './initial-values-table';
import ResutlMatrixTable from './result-matrix-table';

const MainScreen = () => {
  let tableExtended = useRef<boolean>(false);
  let updatedUniqueMatrix = useRef<MatrixType | []>([]);

  const [uniqueProfitMatrixData, setUniqueProfitMatrixData] = useState<
    MatrixType | []
  >(() => []);

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
        demandLeft: 0,
        id: '0-1',
      },
      {
        type: 'customer',
        name: 'O2',
        purchase: 25,
        demand: 28,
        demandLeft: 0,
        id: '0-2',
      },
      {
        type: 'customer',
        name: 'O3',
        purchase: 30,
        demand: 27,
        demandLeft: 0,
        id: '0-3',
      },
    ],
    [
      {
        type: 'provider',
        name: 'D1',
        sale: 10,
        supply: 20,
        id: '1-0',
      },
      {
        type: 'delivery',
        name: 'D1 - O1',
        transport: 8,
        id: '1-1',
      },
      {
        type: 'delivery',
        name: 'D1 - O2',
        transport: 14,
        id: '1-2',
      },
      {
        type: 'delivery',
        name: 'D1 - O3',
        transport: 17,
        id: '1-3',
      },
    ],
    [
      {
        type: 'provider',
        name: 'D2',
        sale: 12,
        supply: 30,
        supplyLeft: 0,
        id: '2-0',
      },
      {
        type: 'delivery',
        name: 'D2 - O1',
        transport: 12,
        id: '2-1',
      },
      {
        type: 'delivery',
        name: 'D2 - O2',
        transport: 9,
        id: '2-2',
      },
      {
        type: 'delivery',
        name: 'D2 - O3',
        transport: 19,
        id: '2-3',
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

  const addCustomerItemToRowEnd = (
    rowItem: MatrixTypeRow,
    rowIndex: number,
  ): MatrixTypeRow => {
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

  const getDeliveryItem = (
    columnNumber: number,
    rowIndex: number,
  ): MatrixTypeItem => ({
    type: 'delivery',
    name: `D${rowIndex} - O${columnNumber}`,
    transport: 0,
    uniqueProfit: 0,
    resultDelivery: 0,
    id: `${rowIndex}-${columnNumber}`,
  });

  const addDeliveryItemToRowEnd = (
    rowItem: MatrixTypeRow,
    rowIndex: number,
  ): MatrixTypeRow => [...rowItem, getDeliveryItem(rowItem.length, rowIndex)];

  const getProviderItemToRow = (
    colIndex: number,
    rowIndex: number,
  ): MatrixTypeItem => ({
    type: 'provider',
    name: `fikcyjny D${colIndex}`,
    sale: 0,
    supply: getFictionProviderSupply(),
    supplyLeft: 0,
    id: `${colIndex}-${rowIndex}`,
  });

  const calcSingleUnitProfit = (
    colIndex: number,
    rowIndex: number,
    inputMatrixData: MatrixType,
  ) => {
    if (colIndex === inputMatrixData[0].length && tableExtended.current) {
      return 0;
    }
    return (
      // @ts-ignore
      inputMatrixData[0][colIndex]?.purchase -
      // @ts-ignore
      inputMatrixData[rowIndex][0]?.sale -
      // @ts-ignore
      inputMatrixData[rowIndex][colIndex]?.transport
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

  const additionalProviderCustomerNeeded = (
    dataMatrix: MatrixType,
  ): boolean => {
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

  useEffect(() => {
    const shouldExtendTable = additionalProviderCustomerNeeded(initialData);
    updatedUniqueMatrix.current = calcUniqueMatrix();
    setUniqueProfitMatrixData(updatedUniqueMatrix.current);

    if (shouldExtendTable) {
      updatedUniqueMatrix.current = addColumnToMatrix();
      updatedUniqueMatrix.current = [
        ...updatedUniqueMatrix.current,
        addRowToMatrix(),
      ];
      setUniqueProfitMatrixData(updatedUniqueMatrix.current);
      tableExtended.current = true;
    } else {
      tableExtended.current = false;
    }
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
