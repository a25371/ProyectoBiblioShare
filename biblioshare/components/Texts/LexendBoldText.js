import React from 'react';
import { Text } from 'react-native';

const LexendBoldText = (props) => {
  return <Text {...props} style={[props.style, { fontFamily: 'Lexend_700Bold' }]} />;
};

export default LexendBoldText;