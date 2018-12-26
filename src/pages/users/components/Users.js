import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button, Input } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Users.css';
import { PAGE_SIZE } from '../constants';
import UserModal from './UserModal';

function Users({ dispatch, list: dataSource, loading, isSearch ,searchText, total, page: current }) {
  function deleteHandler(id) {
    console.warn(`TODO: ${id}`);
    dispatch({
      type: 'users/remove',
      payload: {id,searchText},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/users',
      query: { page,searchText },
    }));
  }


  function editHandler(id, values) {
    dispatch({
      type: 'users/patch',
      payload: { id, values },
    });
  }

  function createHandler(values) {
    dispatch({
      type: 'users/create',
      payload: {values,searchText},
    });

    //this.record = {};
  }

  function onInputChanged(event){
    event.persist();
    clearTimeout();
    setTimeout(function(){onSearchChanged(event)},1000);

  }

  function onSearchChanged(event){
    if (event.target.value == "") {
      isSearch = false;
      searchText = undefined;
      pageChangeHandler();
    }else{
      isSearch = true;
      searchText = event.target.value;
      /*
      dispatch({
        type:'users/search',
        payload:event.target.value,
      });
      */
      pageChangeHandler();
    }

  }


  const columns = [
    {
      title: 'published',
      dataIndex: 'published',
      key: 'published',
    },
    {
      title: 'description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation}>
          <UserModal record={record} onOk={editHandler.bind(null, record.id)}>
            <a>Edit</a>
          </UserModal>
          <Popconfirm title="Confirm to delete?" onConfirm={deleteHandler.bind(null, record.id)}>
            <a href="">Delete</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>

        <div className={styles.create}>
          <UserModal record={{}} onOk={createHandler}>
            <Button type="primary">Create User</Button>
          </UserModal>

        </div>

        <Input placeholder="Search" onChange={onInputChanged}/>



        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          rowKey={record => record.id}
          pagination={false}
        />
        <Pagination
          className="ant-table-pagination"
          total={total}
          current={current}
          pageSize={PAGE_SIZE}
          onChange={pageChangeHandler}
        />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { list, total, page ,searchText} = state.users;
  const isSearch = false;
  return {
    list,
    total,
    page,
    isSearch,
    searchText,
    loading: state.loading.models.users,
  };
}

export default connect(mapStateToProps)(Users);
