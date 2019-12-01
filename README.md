# React/Reduxで作るCRUDアプリケーション

## アプリケーションについて

- [フロントエンドエンジニアのための React ・ Redux アプリケーション開発入門](https://www.udemy.com/react-application-development/)
- サーバーはFirebaseを使用
- [完成URL](https://react-crud-c462c.firebaseapp.com/)


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

