import {ChangeEvent, useCallback, useEffect, useRef, useState} from 'react';
import {CellType, MatrixType, MatrixTypeItem, MatrixTypeRow} from '../types/common';
import InitialValuesTable from './initial-values-table';
import ResutlMatrixTable from './result-matrix-table';
import { Tabs, Tab } from "react-bootstrap";

const MainScreen = () => {
  let isTableExtended = useRef<boolean>(false);
  let resultMatrix = useRef<MatrixType | []>([]);

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
        colIndex: 3
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
        colIndex: 1,
        deltaValue: 'X'
      },
      {
        type: 'delivery',
        name: 'D1 - O2',
        transportCost: 14,
        resourcesTransferred: 0,
        id: '1-2',
        rowIndex: 1,
        colIndex: 2,
        deltaValue: 'X'
      },
      {
        type: 'delivery',
        name: 'D1 - O3',
        transportCost: 17,
        resourcesTransferred: 0,
        id: '1-3',
        rowIndex: 1,
        colIndex: 3,
        deltaValue: 'X'
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
        colIndex: 1,
        deltaValue: 'X'
      },
      {
        type: 'delivery',
        name: 'D2 - O2',
        transportCost: 9,
        resourcesTransferred: 0,
        id: '2-2',
        rowIndex: 2,
        colIndex: 2,
        deltaValue: 'X'
      },
      {
        type: 'delivery',
        name: 'D2 - O3',
        transportCost: 19,
        resourcesTransferred: 0,
        id: '2-3',
        rowIndex: 2,
        colIndex: 3,
        deltaValue: 'X'
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
              [propertyName]: !isNaN(Number(value)) ? parseFloat(value) : 0,
              [`${propertyName}Left`]: !isNaN(Number(value)) ? parseFloat(value) : 0,
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
        rowIndex,
        colIndex: rowItem.length
      },
    ]
  };

  const getDeliveryItem = (rowIndex: number, columnIndex: number): MatrixTypeItem => {
    return ({
      type: 'delivery',
      name: `D${rowIndex} - O${columnIndex}`,
      transportCost: 0,
      uniqueProfit: 0,
      resultDelivery: 0,
      resourcesTransferred: 0,
      id: `${rowIndex}-${columnIndex}`,
      rowIndex: rowIndex,
      colIndex: columnIndex,
      deltaValue: 'X'
    });
  }

  const addDeliveryItemToRowEnd = (rowCellItem: MatrixTypeRow, rowIndex: number): MatrixTypeRow => {
    return [...rowCellItem, getDeliveryItem(rowIndex, rowCellItem.length)]
  };

  const getProviderItemToRow = (colIndex: number, rowIndex: number): MatrixTypeItem => ({
    type: 'provider',
    name: `fikcyjny D${colIndex}`,
    sale: 0,
    supply: getFictionProviderSupply(),
    supplyLeft: 0,
    id: `${colIndex}-${rowIndex}`,
  });

  const calcSingleUnitProfit = (colIndex: number, rowIndex: number, inputMatrixData: MatrixType) => {
    if (colIndex === inputMatrixData[0].length && isTableExtended.current) {
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
    return resultMatrix.current.map((rowCellItem, rowIndex) => {
      if (rowIndex === 0) {
        return addCustomerItemToRowEnd(rowCellItem, rowIndex);
      } else {
        return addDeliveryItemToRowEnd(rowCellItem, rowIndex);
      }
    });
  }, []);

  const addRowToMatrix = useCallback(() => {
    const rowIndexOfRowAdded = resultMatrix.current.length;
    return resultMatrix
        .current[rowIndexOfRowAdded - 1]
        .map((matrixItem, columnIndex) => {
      if (columnIndex === 0) {
        return getProviderItemToRow(
          rowIndexOfRowAdded,
          columnIndex,
        );
      } else {
        return getDeliveryItem(rowIndexOfRowAdded, columnIndex);
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

  const sortFlatSolutionMatrix = (flatUniqueMatrix: MatrixTypeRow): MatrixTypeRow => {
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
    const redistributeResourcesUniqueMatrixShallowCopy = [...resultMatrix.current];
    // const flatSolutionMatrixShallowCopy = [...flatSolutionMatrix];

    for (let i = sortedUniqueMatrix.length - 1; i >= 0; i--) {
      const { colIndex, rowIndex } = sortedUniqueMatrix[i];
      // @ts-ignore
      const tmpCustomer = redistributeResourcesUniqueMatrixShallowCopy[0][colIndex];
      // @ts-ignore
      const tmpProvider = redistributeResourcesUniqueMatrixShallowCopy[rowIndex][0];
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
      resultMatrix.current[rowIndex][colIndex].resourcesTransferred = resourcesTransferred;
    }

    return redistributeResourcesUniqueMatrixShallowCopy;
  }

  const calculateRedistributionFictionalMembers = (updatedResultMatrix: MatrixType, sortedUniqueFlatMatrixCopyOnlyActiveTracks: MatrixTypeRow) => {
    const updatedResultMatrixShallowCopy = Object.assign([], updatedResultMatrix);
    let sortedUniqueFlatMatrixCopyOnlyActiveTracksShallowCopy = [...sortedUniqueFlatMatrixCopyOnlyActiveTracks];

    for (const updatedResultMatrixRow of updatedResultMatrix) {
      for (const updatedResultMatrixItem of updatedResultMatrixRow) {
        const { colIndex, rowIndex } = updatedResultMatrixItem;

        // non zero customer demandLeft
        if (updatedResultMatrixItem.type === "customer" && updatedResultMatrixItem.demandLeft !== 0) {
          // update provider
          // @ts-ignore
          updatedResultMatrixShallowCopy[updatedResultMatrix.length - 1][colIndex].resourcesTransferred = updatedResultMatrixItem.demandLeft;
          updatedResultMatrixItem.demandLeft = 0;

          // push delivery where we transfer stuff
          sortedUniqueFlatMatrixCopyOnlyActiveTracksShallowCopy = [
            // @ts-ignore
            updatedResultMatrixShallowCopy[updatedResultMatrix.length - 1][colIndex],
            ...sortedUniqueFlatMatrixCopyOnlyActiveTracksShallowCopy
          ]
        }

        // non zero provider supplyLeft
        if (updatedResultMatrixItem.type === "provider" && updatedResultMatrixItem.supplyLeft !== 0) {
          // @ts-ignore
          updatedResultMatrixShallowCopy[rowIndex][updatedResultMatrixRow.length - 1].resourcesTransferred = updatedResultMatrixItem.supplyLeft;
          updatedResultMatrixItem.supplyLeft = 0;

          // push delivery where we transfer stuff
          sortedUniqueFlatMatrixCopyOnlyActiveTracksShallowCopy = [
            // @ts-ignore
            updatedResultMatrixShallowCopy[rowIndex][updatedResultMatrixRow.length - 1],
            ...sortedUniqueFlatMatrixCopyOnlyActiveTracksShallowCopy,
          ]
        }
      }
    }

    return {
      updatedResultMatrixShallowCopy,
      sortedUniqueFlatMatrixCopyOnlyActiveTracksShallowCopy
    };
  }

  const createPresentationalAlfaBetaCell = (type: CellType, id: string): MatrixTypeItem => ({
    type,
    id,
  })

  const createCommonAlfaBetaCell = (type: CellType, id: string, dualParamValue: number): MatrixTypeItem => ({
    type,
    id,
    dualParamValue,
    isDualParamCalculated: false
  })

  const addAlphaColumnToMatrix = (resultMatrixShallowCopy: MatrixType): MatrixType => {
    // add alpha
    // @ts-ignore
    return resultMatrixShallowCopy.map((tmpUpdatedUniqueMatrixRow, tmpUpdatedUniqueMatrixRowIndex) => {
      if (tmpUpdatedUniqueMatrixRowIndex !== 0) {
        return ([
          ...tmpUpdatedUniqueMatrixRow,
          createCommonAlfaBetaCell('alpha', `alpha-${tmpUpdatedUniqueMatrixRowIndex}`, 0)
        ])
      } else if (tmpUpdatedUniqueMatrixRowIndex !== resultMatrixShallowCopy.length - 1) {
        return ([
          ...tmpUpdatedUniqueMatrixRow,
          createPresentationalAlfaBetaCell('presentation-alpha', 'alpha-0')
        ])
      }
    });
  }

  const addBetaColumnToMatrix = (resultMatrixShallowCopy: MatrixType): MatrixType => {

    const resultMatrixShallowCopyShallowArray = [...resultMatrixShallowCopy];
    const betaRow: MatrixTypeRow = [];

    for (let i=0; i < resultMatrixShallowCopy[0].length; i++) {
      if (i === 0) {
        betaRow[i] = createPresentationalAlfaBetaCell('presentation-beta', 'beta-0');
      } else {
        betaRow[i] = createCommonAlfaBetaCell('beta', `beta-${i}`, 0)
      }
    }
    resultMatrixShallowCopyShallowArray.push(betaRow);

    return resultMatrixShallowCopyShallowArray;
  }

  const addAlphaAndBetaParamsToMatrix = (resultMatrix: MatrixType): MatrixType => {
    let resultMatrixShallowCopy = [...resultMatrix];

    resultMatrixShallowCopy = addAlphaColumnToMatrix(resultMatrixShallowCopy);
    resultMatrixShallowCopy = addBetaColumnToMatrix(resultMatrixShallowCopy);

    return resultMatrixShallowCopy;
  }

  const calcAlphaBeta = (resultMatrix: MatrixType, sortedFlatSolutionMatrix: MatrixTypeRow): MatrixType => {
    let resultMatrixShallowCopy = [...resultMatrix];
    let sortedUniqueFlatMatrixCopy = [...sortedFlatSolutionMatrix];

    const fRowIndex = resultMatrixShallowCopy.length - 1;
    const fColIndex = resultMatrixShallowCopy[0].length - 1;

    // alfa F = 0
    resultMatrixShallowCopy[fRowIndex][fColIndex] = {
      ...resultMatrixShallowCopy[fRowIndex][fColIndex],
      dualParamValue: 0,
      isDualParamCalculated: true
    };

    for (const sortedUniqueFlatMatrixCopyItem of sortedUniqueFlatMatrixCopy) {
      const {rowIndex, colIndex} = sortedUniqueFlatMatrixCopyItem;

      // @ts-ignore
      const isParticularBetaCalculated: boolean = resultMatrixShallowCopy[fRowIndex][colIndex].isDualParamCalculated;
      // @ts-ignore
      const {uniqueProfit: resultMatrixShallowCopyItemUniqueProfit} = resultMatrixShallowCopy[rowIndex][colIndex];

      // Zij - alfa [i] - beta [j] = 0
      if (isParticularBetaCalculated) {
        // calculate alfa
        // alfa [ cell_row ][fColIndex] = Zij - beta [fRowIndex][j]

        // @ts-ignore
        resultMatrixShallowCopy[rowIndex][fColIndex] = {
          // @ts-ignore
          ...resultMatrixShallowCopy[rowIndex][fColIndex],
          // @ts-ignore
          dualParamValue: resultMatrixShallowCopyItemUniqueProfit - resultMatrixShallowCopy[fRowIndex][colIndex].dualParamValue,
          isDualParamCalculated: true
        };

      } else {
        // calculate beta
        // beta [fRowIndex][j] = Zij - alfa [ cell_row ][fColIndex]

        // @ts-ignore
        resultMatrixShallowCopy[fRowIndex][colIndex] = {
          // @ts-ignore
          ...resultMatrixShallowCopy[fRowIndex][colIndex],
          // @ts-ignore
          dualParamValue: resultMatrixShallowCopyItemUniqueProfit - resultMatrixShallowCopy[rowIndex][fColIndex].dualParamValue,
          isDualParamCalculated: true
        };
      }

    }

    return resultMatrixShallowCopy;
  }

  const calculateDeltaParams = (resultMatrix: MatrixType) => {
    let resultMatrixShallowCopy = JSON.parse(JSON.stringify(resultMatrix));

    let resultMatrixShallowCopyFlat = resultMatrixShallowCopy.flat();

    // @ts-ignore
    let filteredFlatResult = resultMatrixShallowCopyFlat.filter((resultMatrixShallowCopyFlatCell) => {
      if (resultMatrixShallowCopyFlatCell.type === 'delivery') {
        return resultMatrixShallowCopyFlatCell.resourcesTransferred === 0;
      }
      return false;
    })

    for (const filteredFlatResultItem of filteredFlatResult) {
      const { rowIndex: cellRowIndex, colIndex: cellColumnIndex, uniqueProfit } = filteredFlatResultItem;
      // @ts-ignore
      const alphaColumnIndex = resultMatrixShallowCopy[0].length - 1;
      const betaRowIndex = resultMatrixShallowCopy.length - 1;
      // @ts-ignore
      const alpha = resultMatrixShallowCopy[cellRowIndex][alphaColumnIndex].dualParamValue;
      // @ts-ignore
      const beta = resultMatrixShallowCopy[betaRowIndex][cellColumnIndex].dualParamValue;

      // delta = Z[cellRowIndex][columnIndex] - a [cellRowIndex] - B [columnIndex]

      // @ts-ignore
      resultMatrixShallowCopy[cellRowIndex][cellColumnIndex].deltaValue = uniqueProfit - alpha - beta;
    }

    ///return resultMatrixShallowCopy;
    // @ts-ignore
    return resultMatrixShallowCopy;
  }

  // @ts-ignore
  const getIndexOfCorrectDiagonal = (rowOfCellsIncludesStartPoint, rowWithPossibleCorners) => {
    let columnIndexOfDiagonal = null;

    for (let i = 1; i < rowOfCellsIncludesStartPoint.length - 1; i++) {

      // TODO iterate over rowWithPossibleCorners[k]
      if (rowOfCellsIncludesStartPoint[i].deltaValue === 'X' && rowWithPossibleCorners[0][i].deltaValue === 'X') {
        columnIndexOfDiagonal = i;
      }
    }

    // hardcoded first one of first row
    const rowIndexOfDiagonal = rowWithPossibleCorners[0][1].rowIndex;

    return [rowIndexOfDiagonal, columnIndexOfDiagonal];
  }

  // @ts-ignore
  const calculateRotateFigureCorners = (firstRotationCorner, resultMatrix) => {
    let resultMatrixDeepCopy = JSON.parse(JSON.stringify(resultMatrix));
    let rowOfCellsIncludesStartPoint = null;

    const {rowIndex: rowFirstRotationCornerIndex, colIndex: columnFirstRotationCornerIndex} = firstRotationCorner;

    // search all possible corners in firstRotationCorner column
    // @ts-ignore
    const rowWithPossibleCorners = resultMatrixDeepCopy.filter((resultMatrixShallowCopyRowItem, resultMatrixShallowCopyRowIndex) => {
      if (resultMatrixShallowCopyRowIndex === rowFirstRotationCornerIndex) {
        rowOfCellsIncludesStartPoint = resultMatrixShallowCopyRowItem;
      } if (resultMatrixShallowCopyRowIndex !== rowFirstRotationCornerIndex && resultMatrixShallowCopyRowIndex !== 0) {
        return resultMatrixShallowCopyRowItem[columnFirstRotationCornerIndex].deltaValue === 'X';
      }
      return false;
    })

    // TODO calculate two missing corners
    const [rowIndexOfDiagonal, columnIndexOfDiagonal] = getIndexOfCorrectDiagonal(rowOfCellsIncludesStartPoint, rowWithPossibleCorners);

    // @ts-ignore
    const diagonalCorner = resultMatrixDeepCopy[rowIndexOfDiagonal][columnIndexOfDiagonal];

    const missingRotationCorners = [
      resultMatrixDeepCopy[rowIndexOfDiagonal][columnFirstRotationCornerIndex],
      resultMatrixDeepCopy[rowFirstRotationCornerIndex][columnIndexOfDiagonal]
    ]

    return [
        diagonalCorner,
        ...missingRotationCorners
    ];
  }

  // @ts-ignore
  const getCornersToBeRotated = (resultMatrix: MatrixType, filteredFlatResultWithDeltaCalculated) => {
    let resultMatrixShallowCopy = JSON.parse(JSON.stringify(resultMatrix));
    let rotationCorners: any[] = [];

    // @ts-ignore
    const positiveDeltaElements = filteredFlatResultWithDeltaCalculated.filter((filteredFlatResultWithDeltaCalculatedItem) => {
      return filteredFlatResultWithDeltaCalculatedItem.deltaValue > 0;
    })

    if (filteredFlatResultWithDeltaCalculated.length > 0) {

      // iteration over all elements found
      rotationCorners = [
        ...rotationCorners,
        positiveDeltaElements[0]
      ];

      const rotateFigureCorners = calculateRotateFigureCorners(rotationCorners[0], resultMatrixShallowCopy);

      rotationCorners = [
          ...rotationCorners,
          ...rotateFigureCorners
      ]
    }

    return rotationCorners;
  }

  useEffect(() => {
    // recalculate matrix
    // deep clone of matrix
    resultMatrix.current = JSON.parse(JSON.stringify(calcUniqueMatrix()));

    let flatSolutionMatrix: MatrixTypeRow = resultMatrix.current.flat();

    // calculate resources to be transferred on each track
    let sortedFlatSolutionMatrix = sortFlatSolutionMatrix(flatSolutionMatrix);

    resultMatrix.current = redistributeResources(sortedFlatSolutionMatrix);

    let sortedUniqueFlatMatrixCopyOnlyActiveTracks = sortedFlatSolutionMatrix.filter((sortedFlatSolutionMatrixCopyItem) => {
      // @ts-ignore
      return sortedFlatSolutionMatrixCopyItem.resourcesTransferred > 0;
    })

    // extend matrix if needed
    const shouldExtendTable = additionalProviderCustomerNeeded(initialData);

    if (shouldExtendTable) {
      resultMatrix.current = addColumnToMatrix();
      resultMatrix.current = [
        ...resultMatrix.current,
        addRowToMatrix(),
      ];
      isTableExtended.current = true;

      const calculateRedistributionFictionalMembersObject = calculateRedistributionFictionalMembers(resultMatrix.current, sortedUniqueFlatMatrixCopyOnlyActiveTracks);
      const { updatedResultMatrixShallowCopy, sortedUniqueFlatMatrixCopyOnlyActiveTracksShallowCopy } = calculateRedistributionFictionalMembersObject;

      resultMatrix.current = updatedResultMatrixShallowCopy;
      sortedFlatSolutionMatrix = sortedUniqueFlatMatrixCopyOnlyActiveTracksShallowCopy;
    } else {
      isTableExtended.current = false;
    }

    resultMatrix.current = addAlphaAndBetaParamsToMatrix(resultMatrix.current);
    resultMatrix.current = calcAlphaBeta(resultMatrix.current, sortedFlatSolutionMatrix);

    // @ts-ignore
    resultMatrix.current = calculateDeltaParams(resultMatrix.current);

    setUniqueProfitMatrixData(resultMatrix.current);

  }, [addColumnToMatrix, addRowToMatrix, calcUniqueMatrix, initialData]);

  return (
    <>
      <Tabs defaultActiveKey="initiValues" id="uncontrolled-tab-example" className="mt-3">
        <Tab eventKey="initiValues" title="Dane wejściowe">
          <InitialValuesTable
              tableData={initialData}
              onInputChange={onInputChange}
              tableExtended={isTableExtended.current}
          />
        </Tab>
        <Tab eventKey="result" title="Rezultat">
          <ResutlMatrixTable
              onInputChange={onInputChange}
              tableData={uniqueProfitMatrixData}
              tableExtended={isTableExtended.current}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default MainScreen;
