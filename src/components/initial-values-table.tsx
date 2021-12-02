import {Table} from 'react-bootstrap';
import {TableType} from '../types/common';
import InitialValuesTableCell from './initial-values-table-cell';

const InitialValuesTable = ({
  tableData,
  onInputChange,
}: TableType): JSX.Element => {
  return (
    <Table className="mt-3">
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
                      <InitialValuesTableCell
                        colIdx={colIdx}
                        onInputChange={onInputChange}
                        tdItem={tdItem}
                        type={tdItem.type}
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

export default InitialValuesTable;
