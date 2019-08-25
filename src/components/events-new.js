import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { postEvent } from '../actions';

class EventsNew extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  renderField(field) {
    const { input, label, type, meta: { touched, error } } = field;
    return (
      <TextField
        hintText={label}
        floatingLabelText={label}
        type={type}
        errorText={touched && error}
        {...input}
        fullWidth={true}
      />
    )
  }

  async onSubmit(values) {
    const newID = Object.values(this.props.events).reduce((id, data) => (id < data.id ? data.id : id), 0) + 1;
    await this.props.postEvent(Object.assign({}, values, { id: newID }));
    this.props.history.push('/');
  }

  render() {
    const { handleSubmit, pristine, submitting, invalid } = this.props;
    const style = { margin: 12 }
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div><Field label="Title" name="title" type="text" component={this.renderField} /></div>
        <div><Field label="Body" name="body" type="text" component={this.renderField} /></div>
        <RaisedButton
          label="Submit"
          type="submit"
          style={style}
          disabled={pristine || submitting || invalid}
        />
        <RaisedButton
          label="Cancel"
          style={style}
          containerElement={<Link to="/" />}
        />
      </form>
    )
  }
}

const validate = values => {
  const errors = {};
  if (!values.title) errors.title = 'Titleを入力してください';
  if (!values.body) errors.body = 'Bodを入力してください';
  return errors;
}

const mapStateToProps = (state) => {
  return {
    events: state.events,
  }
}

const mapDispatchToProps = ({ postEvent });

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ validate, form: 'eventNewForm' })(EventsNew)
);
