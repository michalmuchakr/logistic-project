import React, {ChangeEvent} from 'react';
import {CellType, MatrixTypeItem} from '../types/common';
import TableInputGroup from './table-input-group';

type DisplayTableCellType = {
  colIdx: number;
  rowIdx: number;
  cellType: CellType;
  tdItem: MatrixTypeItem;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const ResultValuesTableCell = ({
  colIdx,
  rowIdx,
  tdItem,
  onInputChange,
  cellType,
}: DisplayTableCellType): JSX.Element => {
  return (
    <td
      className={`cell${cellType !== 'delivery' ? ' contain-name-cell' : ''}`}
    >
      <span className="text-left cell-title">
        {cellType === 'customer' && `Odbiorca ${tdItem.name}`}
        {cellType === 'provider' && `Dostawca ${tdItem.name}`}
        {cellType === 'delivery' && `D${rowIdx} - O${colIdx}`}
      </span>

      {cellType === 'delivery' && (
        <>
          <TableInputGroup
              inputLabel="Zysk / j"
              rowIdx={rowIdx}
              tdItem={tdItem}
              onInputChange={onInputChange}
              suffixText={'j.m.'}
              value={tdItem.uniqueProfit}
              data-id={tdItem.id}
              dataPropertyName="uniqueProfit"
              readOnly={true}
          />
          <TableInputGroup
              inputLabel="Przewóz"
              rowIdx={rowIdx}
              tdItem={tdItem}
              onInputChange={onInputChange}
              suffixText={'j.m.'}
              value={tdItem.resourcesTransferred}
              data-id={tdItem.id}
              dataPropertyName="uniqueProfit"
              readOnly={true}
          />
        </>
      )}
    </td>
  );
};

export default ResultValuesTableCell;
