import * as usersService from '../services/users';

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    page:null,
    searchText:undefined,
  },
  reducers: {
    save(state, { payload: { data: list, total, page ,searchText} }) {
      return { ...state, list, total, page,searchText };
    },

  },
  effects: {
    *fetch({ payload: { page = 1 ,searchText } }, { call, put }) {
      const { data, headers } = yield call(usersService.fetch, { page ,searchText});
      yield put({
        type: 'save',
        payload: {
          data,
          searchText,
          total: headers,
          page: parseInt(page, 10),
        },
      });
      },
    *remove({ payload: { id ,searchText } }, { call, put, select }) {
      console.log("remove effect");
      yield call(usersService.remove, id);
      //const page = yield select(state => state.users.page);
      const total = yield select(state=>state.users.total);
      const page = (total-1)%5==0?(parseInt(total/5)):(Math.ceil(total/5));
      yield put({ type: 'fetch', payload: { page,searchText } });
    },

    *patch({ payload: { id, values } }, { call, put, select }) {
      yield call(usersService.patch, id, values);
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },
    *create({ payload: {values,searchText} }, { call, put, select }) {
      yield call(usersService.create, values);
      let page = yield select(state => state.users.page);
      const total = yield select(state=>state.users.total);
      if(searchText != undefined) {
        if (searchText.indexOf(values.titie >= 0) || searchText.indexOf(values.published >= 0) || searchText.indexOf(values.author >= 0) || searchText.indexOf(values.description) >= 0) {
          page = (total) % 5 == 0 ? (parseInt(total / 5 + 1)) : (Math.ceil(total / 5));
        }
      }else{
        page = (total) % 5 == 0 ? (parseInt(total / 5 + 1)) : (Math.ceil(total / 5));
      }

      yield put({ type: 'fetch', payload: { page ,searchText} });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/users') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
