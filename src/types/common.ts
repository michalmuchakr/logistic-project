import {ChangeEvent} from 'react';

export type CellType = 'presentation' | 'customer' | 'provider' | 'delivery' | 'alpha' | 'beta' | 'presentation-alpha' | 'presentation-beta';

export type MatrixTypeItem = {
  type: CellType;
  id: string;
  name?: string;
  purchase?: number;
  demand?: number;
  demandLeft?: number;
  sale?: number;
  supply?: number;
  supplyLeft?: number;
  transportCost?: number;
  resourcesTransferred?: number;
  uniqueProfit?: number;
  resultDelivery?: number;
  colIndex?: number,
  rowIndex?: number,
  alphaValue?: number,
  value?: number
};

export type MatrixTypeRow = MatrixTypeItem[];

export type MatrixType = MatrixTypeRow[];

export type TableType = {
  tableExtended?: boolean;
  tableData: MatrixType;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
