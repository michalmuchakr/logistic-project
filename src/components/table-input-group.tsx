import React, {ChangeEvent} from 'react';
import {Form, FormControl, InputGroup} from 'react-bootstrap';
import {MatrixTypeItem} from '../types/common';

type TableInputGroupType = {
  dataPropertyName: string;
  rowIdx: number;
  inputLabel: string;
  tdItem: MatrixTypeItem;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  suffixText: string;
  value?: number | 'X';
  labelWidth?: number;
  readOnly?: boolean;
};

const TableInputGroup = ({
  tdItem,
  inputLabel,
  onInputChange,
  suffixText,
  value,
  dataPropertyName,
  labelWidth = 3,
  readOnly = false,
}: TableInputGroupType) => (
  <InputGroup className="mb-2" size="sm">
    <Form.Label column sm={labelWidth}>
      {inputLabel}
    </Form.Label>
    <FormControl
      placeholder="provide value"
      value={value}
      data-id={tdItem.id}
      onChange={onInputChange}
      data-property-name={dataPropertyName}
      readOnly={readOnly}
    />
    <InputGroup.Text>{suffixText}</InputGroup.Text>
  </InputGroup>
);

export default TableInputGroup;
