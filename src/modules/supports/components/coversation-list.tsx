import * as React from 'react';
import Socket from '../../../components/websocket';
import ConversationController, { IGetSupportList } from '../../../platform/api/conversation';
import NoProfilePicture from "../../../assets/images/no_profile_picture.png";
import HelperComponent from 'src/platform/classes/helper-component';
import Settings from 'src/platform/services/settings';

interface IProps {
  changeCount: (count: number) => void;
  changeActiveUser: (id: number) => void;
  flag: boolean;
};

interface IState {
  data: IGetSupportList[] | null,
  loading: boolean;
  searchText: string;
  userCount: number;
  activeConversationId: number;
}

class ConversationsList extends HelperComponent<IProps, IState> {
  private page = 1;
  private count = 15;
  private usersPageCount = 0;
  private userListBlock = React.createRef<HTMLDivElement>();

  public state: IState = {
    data: null,
    loading: false,
    searchText: '',
    userCount: 0,
    activeConversationId: 0,
  }

  public componentDidMount() {
    this.getSupportsList();
  }

  public UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if (this.props.flag !== nextProps.flag) {
      this.updateItem();
    }
  }

  private searchUsers = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await this.asyncSetState({ searchText: e.target.value, data: [] });
    this.page = 1;
    this.getSupportsList()
  };

  private getSupportsList = async () => {
    const res = await this.getList();
    if (res.success) {
      this.props.changeCount(res.data.itemCount);

      await this.asyncSetState({ data: res.data.data });

      if (res.data.data[0] && !this.state.activeConversationId) {
        this.selectUser(res.data.data[0].id);
      }

      this.usersPageCount = res.data.pageCount;
    }
  }

  private onScrollUsers = (e: React.SyntheticEvent) => {
    const { data, loading } = this.state;
    if (this.userListBlock.current) {
      if (e.currentTarget.scrollTop > this.userListBlock.current.clientHeight / 4 && !loading && data) {
        this.page += 1;
        if (this.page <= this.usersPageCount) {
          this.getSupportsOnScroll();
        }
      }
    }
  };

  private getSupportsOnScroll = async () => {
    const res = await this.getList();
    if (this.state.data) res.data.data = [...this.state.data, ...res.data.data];
    this.setState({
      data: res.data.data,
      loading: false,
    });
  };

  private getList = async () => {
    await this.asyncSetState({ loading: true });
    const body = {
      search: this.state.searchText,
      count: this.count,
      page: this.page,
    };
    const res = await ConversationController.GetList(body);
    this.setState({ loading: false });
    return res;
  }

  private updateItem = async () => {
    const body = {
      search: this.state.searchText,
      count: this.count,
      page: 1,
    };
    const res = await ConversationController.GetList(body);

    if (res.success) {
      const item = res.data.data.find(x => x.id === this.state.activeConversationId);
      const index = this.state.data ? this.state.data.findIndex(x => x.id === this.state.activeConversationId) : -1;

      if (item && index !== -1) {
        const data = this.state.data;
        if (data) {
          data[index] = item;
          this.setState({ data })
        }
      }
    }
  }

  private selectUser = async (id: number) => {
    this.props.changeActiveUser(id);
    this.setState({ activeConversationId: id });
    const data = this.state.data;
    if (data) {
      const item = data.find(x => x.id === id);
      if (item) {
        item.unSeenCount = 0;
      }
      this.setState({ data })
    }
  };

  public render() {
    const { data } = this.state;
    return (
      <div className="B-support-left">
        <div className='B-support-users'>
          <div className='B-support-search'>
            <label>
              <input type="text" value={this.state.searchText} placeholder="Search.." onChange={this.searchUsers} />
            </label>
          </div>
          <div className='B-support-users-block'>
            <div className="B-support-users-container" onScroll={this.onScrollUsers}>
              <div className="B-support-users-list" ref={this.userListBlock}>

                {data ? data.map((item, index) => (
                  <div key={index} className={`B-suport-users-box ${this.state.activeConversationId === item.id ? 'active-user-message' : ''}`} onClick={() => this.selectUser(item.id)}>
                    <div className="B-support-user-prop">
                      <div className="B-support-user-prop-img"
                        style={{ backgroundImage: `url("${item.photo ? (item.photo.photo || item.photo.photoBlur) || NoProfilePicture : NoProfilePicture}")` }} />
                      <div className="B-support-user-prop-list">
                        <h3>{item.fullName} {item.unSeenCount ? <span
                          className="B-support-message-count">{item.unSeenCount}</span> : null} </h3>
                        <p>{item.messageText}</p>
                      </div>
                    </div>
                  </div>
                )) : null}

                {this.state.loading ? <div className="lds-ellipsis">
                  <div />
                  <div />
                  <div />
                  <div />
                </div> : null}
              </div>
            </div>
          </div>
        </div>

        {<Socket hub="supportBaseHub" data={{ deviceId: Settings.guestId }} onMessage={() => this.getSupportsList()} />}
      </div>
    )
  }
}

export default ConversationsList;