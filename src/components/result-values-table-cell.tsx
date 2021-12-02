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

const getClassnameByCellType = (cellType: string): string => {
  let cellClassName = '';

  if (cellType !== 'delivery') {
    cellClassName += ' contain-name-cell';
  }
  if (cellType === 'presentation-alpha' || cellType === 'presentation-beta' ) {
    cellClassName += ' presentation-alpha-cell';
  }

  return cellClassName;
}

const ResultValuesTableCell = ({
  colIdx,
  rowIdx,
  tdItem,
  onInputChange,
  cellType,
}: DisplayTableCellType): JSX.Element => {
  return (
    <td
      className={`cell${getClassnameByCellType(cellType)}`}
    >
      <span className="text-left cell-title">
        {cellType === 'customer' && `Odbiorca ${tdItem.name}`}
        {cellType === 'provider' && `Dostawca ${tdItem.name}`}
        {cellType === 'delivery' && `D${rowIdx} - O${colIdx}`}
        {cellType === 'presentation-alpha' && "α"}
        {cellType === 'presentation-beta' && "β"}
        {cellType === 'alpha' && `α${rowIdx}`}
        {cellType === 'beta' && `β${colIdx}`}

      </span>

      {cellType === 'delivery' && (
        <>
          <TableInputGroup
              inputLabel="Dostawa"
              rowIdx={rowIdx}
              tdItem={tdItem}
              onInputChange={onInputChange}
              suffixText={'j.m.'}
              value={tdItem.transportCost}
              data-id={tdItem.id}
              dataPropertyName="transportCost"
              readOnly={true}
          />
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
          <TableInputGroup
              inputLabel="Delta"
              rowIdx={rowIdx}
              tdItem={tdItem}
              onInputChange={onInputChange}
              suffixText={'j.m.'}
              value={tdItem.deltaValue}
              data-id={tdItem.id}
              dataPropertyName="uniqueProfit"
              readOnly={true}
          />
        </>
      )}

      {cellType === 'provider' && (
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
                readOnly={true}
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
                readOnly={true}
            />
          </>
      )}

      {cellType === 'customer' && (
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
                readOnly={true}
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
                readOnly={true}
            />
          </>
      )}

      {((cellType === 'alpha') || (cellType === 'beta')) && (
          <>
            { tdItem.dualParamValue }
          </>
      )}
    </td>
  );
};

export default ResultValuesTableCell;
