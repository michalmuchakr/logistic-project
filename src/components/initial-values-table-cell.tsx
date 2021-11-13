import React, {ChangeEvent} from 'react';
import {CellType, MatrixTypeItem} from '../types/common';
import TableInputGroup from './table-input-group';

type DisplayTableCellType = {
  colIdx: number;
  rowIdx: number;
  type: CellType;
  tdItem: MatrixTypeItem;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const InitialValuesTableCell = ({
  colIdx,
  rowIdx,
  tdItem,
  onInputChange,
  type,
}: DisplayTableCellType): JSX.Element => {
  return (
    <td className="cell">
      <span className="text-left cell-title">
        {type === 'customer' && `Odbiorca ${colIdx}`}
        {type === 'provider' && `Dostawca ${rowIdx}`}
        {type === 'delivery' && `D${rowIdx} - O${colIdx}`}
      </span>
      {type === 'customer' && (
        <>
          <TableInputGroup
            inputLabel="Popyt"
            rowIdx={rowIdx}
            tdItem={tdItem}
            onInputChange={onInputChange}
            suffixText={'j.m.'}
            value={tdItem.demand}
            data-id={tdItem.id}
            dataPropertyName="demand"
          />
          <TableInputGroup
            inputLabel="Sprzedaż"
            rowIdx={rowIdx}
            tdItem={tdItem}
            onInputChange={onInputChange}
            suffixText={'j.m.'}
            value={tdItem.purchase}
            data-id={tdItem.id}
            dataPropertyName="purchase"
          />
        </>
      )}

      {type === 'provider' && (
        <>
          <TableInputGroup
            inputLabel="Zakup"
            rowIdx={rowIdx}
            tdItem={tdItem}
            onInputChange={onInputChange}
            suffixText={'j.m.'}
            value={tdItem.sale}
            data-id={tdItem.id}
            dataPropertyName="sale"
          />
          <TableInputGroup
            inputLabel="Podaż"
            rowIdx={rowIdx}
            tdItem={tdItem}
            onInputChange={onInputChange}
            suffixText={'j.m.'}
            value={tdItem.supply}
            data-id={tdItem.id}
            dataPropertyName="supply"
          />
        </>
      )}

      {type === 'delivery' && (
        <TableInputGroup
          inputLabel="Dostawa"
          rowIdx={rowIdx}
          tdItem={tdItem}
          onInputChange={onInputChange}
          suffixText={'j.m.'}
          value={tdItem.transport}
          data-id={tdItem.id}
          dataPropertyName="transport"
        />
      )}
    </td>
  );
};

export default InitialValuesTableCell;
