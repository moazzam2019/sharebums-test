import { PureComponent } from 'react';
import { Select, message, Avatar } from 'antd';
import { debounce } from 'lodash';
import { performerService } from '@services/performer.service';

interface IProps {
  placeholder?: string;
  style?: Record<string, string>;
  onSelect: Function;
  defaultValue?: string;
  disabled?: boolean;
}

export class SelectPerformerDropdown extends PureComponent<IProps> {
  state = {
    loading: false,
    data: [] as any
  };

  loadPerformers = debounce(async (q) => {
    try {
      this.setState({ loading: true });
      const resp = await (await performerService.search({ q, limit: 99 })).data;
      this.setState({
        data: resp.data,
        loading: false
      });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured');
      this.setState({ loading: false });
    }
  }, 500);

  componentDidMount() {
    this.loadPerformers('');
  }

  render() {
    const {
      style, onSelect, defaultValue, disabled
    } = this.props;
    const { data, loading } = this.state;
    return (
      <Select
        showSearch
        defaultValue={defaultValue}
        placeholder="Type to search model..."
        style={style}
        onSearch={this.loadPerformers.bind(this)}
        onChange={(val) => onSelect(val)}
        loading={loading}
        optionFilterProp="children"
        disabled={disabled}
      >
        <Select.Option value="" key="default">
          All Model
        </Select.Option>
        {data && data.length > 0 && data.map((u) => (
          <Select.Option value={u._id} key={u._id} style={{ textTransform: 'capitalize' }}>
            <Avatar size={30} src={u?.avatar || '/static/no-avatar.png'} />
            {' '}
            {`${u?.name || u?.username}`}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
