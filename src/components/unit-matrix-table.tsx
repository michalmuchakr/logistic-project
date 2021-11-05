import {Table} from "react-bootstrap";
import {TableType} from '../types/common';
import UnitProfitValuesTableCell from "./unit-profit-values-table-cell";

const UnitMatrixTable = ({tableData, onInputChange}: TableType): JSX.Element => {
    return (
        <Table className="table__unit-matrix mt-4">
            <tbody>
            {tableData && tableData.map((rowItem, rowIdx) => (
                <tr key={rowIdx}>
                    {
                        rowItem.map((tdItem, colIdx) => {
                            switch (tdItem.type) {
                                case 'presentation':
                                    return <td key={tdItem.id}/>

                                default:
                                    return (
                                        <UnitProfitValuesTableCell
                                            colIdx={colIdx}
                                            onInputChange={onInputChange}
                                            tdItem={tdItem}
                                            type={tdItem.type}
                                            rowIdx={rowIdx}
                                            key={tdItem.id}
                                        />
                                    )
                            }
                        })
                    }
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default UnitMatrixTable;
