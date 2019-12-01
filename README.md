# React/Reduxで作るCRUDアプリケーション

## アプリケーションについて

- [フロントエンドエンジニアのための React ・ Redux アプリケーション開発入門](https://www.udemy.com/react-application-development/)
- サーバーはFirebaseを使用
- [完成URL](https://react-crud-c462c.firebaseapp.com/)

## Redux Thunkでactionに非同期処理を書く

middlewareである「Redux Thunk」を使うとreduxのactionに非同期処理の関数を返すことができるのでその説明になります。

## 通常のaction

actionでは純粋なobjectを返さなければならない。
そのため非同期処理を書くことができない。

```javascript:action.js
export const HOGE = 'HOGE';

export const foo = () => ({
  type: HOGE
});
```

## Redux Thunk

### about

公式サイト「[Redux Thunk](https://github.com/reduxjs/redux-thunk)」にはこのように書かれてます。

> 単純な基本的なRedux storeでは、actionをdispatchすることによって簡単な同期更新のみを行うことができます。
middlewareはstoreの機能を拡張し、storeと対話する非同期ロジックを作成できるようにします。
thunkは、storeへのアクセスを必要とする複雑な同期ロジックやAJAX requestなどの単純な非同期ロジックなど、基本的なRedux副作用ロジックの推奨middlewareです。

### Setup

```terminal
$ yarn add redux-thunk
```

- reduxの`applyMiddleware`関数の引数にthunkを設定
- createStoreの第二引数に読み込む
- App componentをwrapしているProvider componentのstore propsに設定

``` javascript:index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './reducers';
import App from './App.js';

const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>
  document.getElementById('root')
);
```

### actionで導入

- PromiseベースのHTTPクライアントである`axios`を使用
- 純粋なobjectではなく関数を返せるようになる。第一引数は`dispatch`、第二引数は`getState`を設定
- axiosがPromiseで出来ているので`async await`を使用

``` javascript:action.js
import axios from 'axios';

export const HOGE = 'HOGE';

export const foo = () => async (dispatch, getState) => {
  const { fuga } = getState();
  const response = await axios.get({REST APIのエンドポイント});
  dispatch({ type: HOGE, response })
};
```

これでreducerに処理が行き渡ります。


## Redux Formのdecoratorで受け取れるpropsについて

### importとexportの設定

まずはredux-formの設定を行います。

``` javascript:hoge.js
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

class hoge extends Component {
 constructor(props) {
  super(props);
 }
}

export default reduxForm({ form: 'hogeForm' })(hoge);
```
これで`hoge`componentのpropsにredux-formが提供するpropsを受け取れるようになりました。
そのなかで今回説明するpropsは下記になります。

- handleSubmit
- pristine
- submitting
- invalid

### handleSubmit

文字通りsubmitをしたときにinputのvalueを引数で取得できるpropsです。
設定は下記のようになります。

``` javascript:hoge.js
class hoge extends Component {
 constructor(props) {
  super(props);
  this.onSubmit = this.onSubmit.bind(this);
 }
 
 onSubmit（values） {
  // valuesが各inputのvalue
 }
 
 render() {
  const { handleSubmit } = this.props;
  return (
   <form onSubmit={handleSubmit(this.onSubmit)}>
   </form>
  ) 
 }
}
```

### pristine

フォームに入力されるとfalseを返す。
送信ボタンの活性化/非活性化するときに使用。

``` javascript:hoge.js
class hoge extends Component {
 render() {
  const { pristine } = this.props;
  return (
   <form onSubmit={handleSubmit(this.onSubmit)}>
    <input type="submit" value="Submit" disabled={pristine} />
   </form>
  ) 
 }
}
```

### submitting

フォームのSubmitボタンを押下するとtrueを返す。複数回連続で押下できるのを回避。
上記の`pristine`を併用して、送信ボタンの活性化/非活性化するときに使用。


### invalid

validate errorがあるときはtrueになる。
上記の`pristine`と`submitting`を併用して、送信ボタンの活性化/非活性化するときに使用。

``` javascript:hoge.js
class hoge extends Component {
 render() {
  const { handleSubmit, pristine, submitting, invalid } = this.props;
  return (
   <form onSubmit={handleSubmit(this.onSubmit)}>
    <input type="submit" value="Submit" disabled={pristine || submitting || invalid} />
   </form>
  ) 
 }
}
```

