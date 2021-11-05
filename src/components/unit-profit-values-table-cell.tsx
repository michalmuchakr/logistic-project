import React, {ChangeEvent} from 'react';
import {CellType, MatrixTypeItem} from "../types/common";
import TableInputGroup from "./table-input-group";

type DisplayTableCellType = {
    colIdx: number,
    rowIdx: number,
    type: CellType,
    tdItem: MatrixTypeItem
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const UnitProfitValuesTableCell = ({colIdx, rowIdx, tdItem, onInputChange, type}: DisplayTableCellType): JSX.Element => {
    return (
        <td className="cell">
            <span className="text-left cell-title">
                {type === "customer" && `Odbiorca ${colIdx}`}
                {type === "provider" && `Dostawca ${rowIdx}`}
                {type === "delivery" && `O${rowIdx} - D${colIdx}`}
            </span>

            {type === "delivery" && (
                <TableInputGroup inputLabel="Dostawa"
                                 rowIdx={rowIdx}
                                 tdItem={tdItem}
                                 onInputChange={onInputChange}
                                 suffixText={'j.m.'}
                                 value={tdItem.uniqueProfit}
                                 data-id={tdItem.id}
                                 dataPropertyName="uniqueProfit"
                                 readOnly={true}
                />
            )}
        </td>
    );
};

export default UnitProfitValuesTableCell;
