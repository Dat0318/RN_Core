import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {TextInput, View, Text} from 'react-native';

import {styles} from './styles';

class PinCode extends Component {
  constructor(props) {
    super(props);

    const codeLength = props.number || props.code.length;
    const propsNumber = this.props.number;

    this.state = {
      error: '',
      number: codeLength,
      propsNumber: propsNumber,
      code: new Array(codeLength).fill(''),
      edit: null,
      reset: false,
    };

    this.textInputsRefs = [];

    this.clean = this.clean.bind(this);
    this.focus = this.focus.bind(this);
    this.isFocus = this.isFocus.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  // componentWillReceiveProps(newProps) {
  //   const codeLength = newProps.number || newProps.code.length;

  //   if (newProps.number !== this.props.number) {
  //     this.setState({
  //       number: codeLength,
  //       edit: null,
  //     });
  //   }
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    const codeLength = nextProps.number || nextProps.code.length;
    if (nextProps.number !== prevState.propsNumber) {
      this.setState({
        number: codeLength,
        edit: null,
      });
    }
    return null;
  }

  clean() {
    this.setState(prevState => {
      return {
        code: new Array(prevState.number).fill(''),
        edit: null,
        reset: true,
      };
    });
    this.focus(0);
  }

  focus(id) {
    // Check to ensure that input exists. This is important in the case of autofill.
    if (this.textInputsRefs[id]) this.textInputsRefs[id].focus();
  }

  isFocus(id) {
    let newCode = this.state.code.slice();

    for (let i = 0; i < newCode.length; i++) if (i >= id) newCode[i] = '';

    this.setState({
      code: newCode,
      edit: id,
    });
  }

  handleEdit(number, id) {
    let newCode = this.state.code.slice();

    // Detecting if the entire code has been pasted or autofilled into
    // the first field.
    const hasAutofilled = number.length > 1 && id === 0;

    if (hasAutofilled) {
      const autofillCode = number.split('');

      // Need to update state so UI updates.
      this.setState(
        {
          code: newCode.map((code, i) => {
            return autofillCode[i] ? autofillCode[i] : code;
          }),
          edit:
            autofillCode.length >= this.props.number
              ? this.props.number - 1
              : autofillCode.length,
          reset: false,
        },
        () => {
          this.focus(this.state.edit);
        },
      );
    } else {
      newCode[id] = number[0];
    }

    // User filling the last pin ?
    if (
      id === this.state.number - 1 ||
      (hasAutofilled && number.length === this.props.number)
    ) {
      this.focus(0);

      // App pass a checkPinCode function
      if (this.props.checkPinCode) {
        this.props.checkPinCode(newCode.join(''), success => {
          // App say it's different than code
          if (!success) {
            this.setState({
              error: this.props.error,
              code: new Array(this.state.number).fill(''),
              edit: 0,
              reset: true,
            });
          } else {
            // Is Okey !!!
            this.setState(
              prevState => ({
                edit: prevState.edit + 1,
                code: newCode,
                reset: true,
              }),
              this.props.success,
            );
          }
        });

        return;
      }

      // no checkPinCode function
      // But it's different than code
      if (this.props.code !== newCode.join('')) {
        this.setState({
          error: this.props.error,
          code: new Array(this.state.number).fill(''),
          edit: 0,
          reset: true,
        });

        return;
      }

      this.setState(
        prevState => ({
          edit: prevState.edit + 1,
          code: newCode,
          reset: true,
        }),
        this.props.success,
      );

      return;
    }

    if (!hasAutofilled) {
      this.focus(this.state.edit + 1);

      this.setState(prevState => {
        return {
          error: '',
          code: newCode,
          edit: prevState.edit + 1,
          reset: false,
        };
      });
    }
  }

  onKeyPress(e) {
    if (e.nativeEvent.key === 'Backspace') {
      const edit = this.state.edit;
      const toFocus = edit > 0 ? edit - 1 : 0;
      this.focus(toFocus);
    }
  }

  render() {
    const {
      text,
      success,
      pinStyle,
      textStyle,
      errorStyle,
      obfuscation,
      containerStyle,
      containerPinStyle,
      ...props
    } = this.props;

    var pins = [];
    for (let index = 0; index < this.state.number; index++) {
      const id = index;
      const value = this.state.code[id]
        ? obfuscation
          ? '*'
          : this.state.code[id].toString()
        : '';

      pins.push(
        <TextInput
          key={id + value + this.state.reset} // force to re-render on update
          ref={ref => (this.textInputsRefs[id] = ref)}
          onChangeText={text => this.handleEdit(text, id)}
          onFocus={() => this.isFocus(id)}
          value={value}
          maxLength={id === 0 ? this.props.number : 1}
          style={[styles.pin, pinStyle]}
          returnKeyType={'done'}
          autoCapitalize={'sentences'}
          autoCorrect={false}
          autoFocus={
            (id === 0 &&
              this.state.edit === null &&
              this.props.autoFocusFirst) ||
            id === this.state.edit
          }
          onKeyPress={this.onKeyPress}
          {...props}
        />,
      );
    }

    const error = this.state.error ? (
      <Text style={[styles.error, errorStyle]}>{this.state.error}</Text>
    ) : null;

    return (
      <View style={[styles.container, containerStyle]}>
        {/* <Text style={[styles.text, textStyle]}>{text}</Text> */}

        <View style={[styles.containerPin, containerPinStyle]}>{pins}</View>

        {error}
      </View>
    );
  }
}

PinCode.propTypes = {
  code: PropTypes.string,
  success: PropTypes.func.isRequired,
  number: PropTypes.number,
  checkPinCode: PropTypes.func,
  autoFocusFirst: PropTypes.bool,
  obfuscation: PropTypes.bool,
  pinStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  containerPinStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  errorStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

PinCode.defaultProps = {
  code: '',
  number: 4,
  checkPinCode: null,
  autoFocusFirst: true,
  obfuscation: false,
  text: 'Pin code',
  error: 'Bad pin code.',
  pinStyle: {},
  containerPinStyle: {},
  containerStyle: {},
  textStyle: {},
  errorStyle: {},
};

export default PinCode;
