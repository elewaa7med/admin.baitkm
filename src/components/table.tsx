import * as React from 'react';
import { Link } from 'react-router-dom';

import { ITableColumnConfig } from '../platform/constants/interfaces';

interface IProps<Data extends object> {
  onRowClick?(row: Data, index?: number): void;
  hoverButtons?(row: Data, index?: number): HTMLElement | React.ReactNode;
  columnConfig: Array<ITableColumnConfig<Data>>;
  data: Data[];
  redirectUrl?(row: Data, index?: number): string;
};

class Table<Data extends { id: number }> extends React.PureComponent<IProps<Data>, {}> {

  public static defaultProps = {
    onRowClick: null,
    hoverButtons: null,
  }

  //
  // private getRowTitle = (column: ITableColumnConfig<Data>, item: Data, index: number) => {
  //
  //   const value = column.cell(item, index);
  //   if (typeof value === 'string' ||
  //     typeof value === 'number') return value.toString();
  //
  //   return;
  // }

  public render() {
    const { columnConfig, data, onRowClick, redirectUrl, hoverButtons } = this.props;
    const Row = redirectUrl ? Link : 'ul';
    return (
      <div className="B-data-table">
        <ul className="B-data-table-header">
          {columnConfig.map((item, index) => <li className={item.className} key={index} style={item.style || {}}>{item.name}</li>)}
        </ul>
        {!!data.length && <div className="B-data-table-body">
          {data.map((item, rowIndex) => onRowClick ? <Row to={redirectUrl ? redirectUrl(item, rowIndex) : ''} onClick={() => onRowClick && onRowClick(item, rowIndex)} key={item.id} className="B-pointer">
            {columnConfig.map((childItem, index) => <li key={index}  style={childItem.style || {}}><div className={childItem.wrapperClass && childItem.wrapperClass(item)}>{childItem.cell(item, rowIndex)}</div></li>)}
            <li className="B-data-table-actions">{hoverButtons && hoverButtons(item, rowIndex)}</li>
          </Row> : <Row to={redirectUrl ? redirectUrl(item, rowIndex) : ''} key={item.id}>
              {columnConfig.map((childItem, index) => <li key={index}  style={childItem.style || {}}><div className={childItem.wrapperClass && childItem.wrapperClass(item)}>{childItem.cell(item, rowIndex)}</div></li>)}
              <li className="B-data-table-actions">{hoverButtons && hoverButtons(item, rowIndex)}</li>
            </Row>)}
        </div>}
      </div>
    );
  }
}

export default Table;
