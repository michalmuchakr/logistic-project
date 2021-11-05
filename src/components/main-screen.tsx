import {useState, useEffect, ChangeEvent} from "react";
import {MatrixType, MatrixTypeRow} from '../types/common';
import InitialValuesTable from "./initial-values-table";
import UnitMatrixTable from "./unit-matrix-table";

const MainScreen = () => {
	const [uniqueProfitMatrixData, setUniqueProfitMatrixData] = useState<MatrixType | []>(() => []);

	const [initialData, setInitialData] = useState<MatrixType>(() => [
		[
			{
				type: "presentation",
				id: 0
			},
			{
				type: "customer",
				name: "O1",
				purchase: 30,
				demand: 10,
				demandLeft: 0,
				id: 1
			},
			{
				type: "customer",
				name: "O2",
				purchase: 25,
				demand: 28,
				demandLeft: 0,
				id: 2
			},
			{
				type: "customer",
				name: "O3",
				purchase: 30,
				demand: 27,
				demandLeft: 0,
				id: 3
			}
		],
		[
			{
				type: "provider",
				name: "D1",
				sale: 10,
				supply: 20,
				id: 4
			},
			{
				type: "delivery",
				name: "D1 - O1",
				transport: 8,
				id: 5
			},
			{
				type: "delivery",
				name: "D1 - O2",
				transport: 14,
				id: 6
			},
			{
				type: "delivery",
				name: "D1 - O3",
				transport: 17,
				id: 7
			}
		],
		[
			{
				type: "provider",
				name: "D2",
				sale: 12,
				supply: 30,
				supplyLeft: 0,
				id: 8
			},
			{
				type: "delivery",
				name: "D2 - O1",
				transport: 12,
				id: 9
			},
			{
				type: "delivery",
				name: "D2 - O2",
				transport: 9,
				id: 10
			},
			{
				type: "delivery",
				name: "D2 - O3",
				transport: 19,
				id: 11
			}
		]
	]);

	const onInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
		const {dataset, value} = event.currentTarget;
		const {id, propertyName} = dataset;

		setInitialData((prevState) => {
			return prevState.map((rowArray) => (
				rowArray.map((element) => {
					if (element.id.toString() === id && propertyName) {
						return {
							...element,
							[propertyName]: parseFloat(value)
						}
					}

					return element;
				}))
			)
		})
	}

	useEffect(() => {
		setUniqueProfitMatrixData(initialData.map((rowArray: MatrixTypeRow, rowIndex: number) => {
			if (rowIndex !== 0) {
				return rowArray.map((element, colIndex) => {
					if (element.type === "delivery") {
						// @ts-ignore
						const uniqueProfit = initialData[0][colIndex]?.purchase - initialData[rowIndex][0]?.sale - initialData[rowIndex][colIndex]?.transport;

						return {
							...element,
							uniqueProfit,
						}
					}
					return element;
				});
			}
			return rowArray;
		}))
	}, [initialData]);

	return (
		<>
			<h3 className="title mt-5 mb-1">Dane wejściowe</h3>
			<InitialValuesTable tableData={initialData} onInputChange={onInputChange} />
			<h3 className="title mt-5 mb-1">Macierz zysków jednostkowych</h3>
			<UnitMatrixTable onInputChange={onInputChange} tableData={uniqueProfitMatrixData} />
		</>
	);
}

export default MainScreen;
