import {ChangeEvent} from "react";

export type CellType = "presentation" | "customer" | "provider" | "delivery";

export type MatrixTypeItem = {
    type: CellType,
    id: number
    name?: string,
    purchase?: number,
    demand?: number,
    demandLeft?: number,
    sale?: number,
    supply?: number,
    supplyLeft?: number,
    transport?: number,
    uniqueProfit?: number
}

export type MatrixTypeRow = MatrixTypeItem[]

export type MatrixType = MatrixTypeRow[];

export type TableType = {
    tableData: MatrixType,
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => void
}
