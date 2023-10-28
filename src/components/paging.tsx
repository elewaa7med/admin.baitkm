import * as React from 'react';
import * as key from 'keymaster';
import Paginate from 'react-paginate';

import { showingPagesMaxCount } from '../platform/constants/index';
import { IPaginationChange } from '../platform/constants/interfaces'

interface IProps {
  name?: string;
  page: number;
  activePage: number;
  onChange(page: number): void;
  count?: number;
};

interface IState {
  activePages?: number[];
  oldPagesCount?: number;
};


class Paging extends React.Component<IProps, IState> {

  public state: IState = {};

  public componentDidMount() {
    if (this.props.page && this.props.activePage > this.props.page) {
      this.onChange({ selected: this.props.page - 1 });
    }

    if (this.props.page > 1) {
      key('left', this.prevPage);
      key('right', this.nextPage);
    }
  }

  public static getDerivedStateFromProps({ page, name, activePage }: IProps, { oldPagesCount }: IState) {
    if (page !== oldPagesCount) {
      const activePages = [];
      if (page < showingPagesMaxCount) {
        for (let i = page; i > 0; i--) activePages.unshift(i);
      } else {
        for (let i = showingPagesMaxCount; i > 0; i--) activePages.unshift(i);
      }
      return { activePages, oldPagesCount: page };
    }

    name && sessionStorage.setItem(name, activePage.toString());
    return null;
  }

  private prevPage = () => {
    const { activePage } = this.props;
    activePage - 1 && this.onChangeNormal(activePage - 1);
  }

  private nextPage = () => {
    const { activePage, page } = this.props;
    activePage + 1 <= page && this.onChangeNormal(activePage + 1);
  }

  private onChange = (data: IPaginationChange) => this.onChangeNormal(data.selected + 1);

  private onChangeNormal = (page: number) => {
    this.props.name && sessionStorage.setItem(this.props.name, page.toString());
    this.props.onChange(page);

  }

  public render() {
    const {
      page,
      activePage,
      count,
    } = this.props;

    return (
      <div className="B-paging">
        {!!count && <h3>Total {count}</h3>}
        {page > 1 && <Paginate
          containerClassName="B-paging-buttons"
          pageCount={page}
          pageRangeDisplayed={showingPagesMaxCount}
          previousLabel="<"
          nextLabel=">"
          forcePage={activePage - 1}
          activeClassName="B-active-page"
          onPageChange={this.onChange}
          disableInitialCallback={true}
        />}
      </div>
    );
  }
}

export default Paging;
