import {Table} from 'react-bootstrap';
import {TableType} from '../types/common';
import ResultValuesTableCell from './result-values-table-cell';

const ResultMatrixTable = ({
  tableData,
  onInputChange,
  tableExtended,
}: TableType): JSX.Element => {
  return (
    <Table
      className={`table__unit-matrix mt-4${tableExtended && ' table-extended'}`}
    >
      <tbody>
        {tableData &&
          tableData.map((rowItem, rowIdx) => (
            <tr key={rowIdx}>
              {rowItem.map((tdItem, colIdx) => {
                switch (tdItem.type) {
                  case 'presentation':
                    return <td key={tdItem.id} />;

                  default:
                    return (
                      <ResultValuesTableCell
                        colIdx={colIdx}
                        onInputChange={onInputChange}
                        tdItem={tdItem}
                        cellType={tdItem.type}
                        rowIdx={rowIdx}
                        key={tdItem.id}
                      />
                    );
                }
              })}
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default ResultMatrixTable;
