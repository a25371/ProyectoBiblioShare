import React from 'react';
import { Text } from 'react-native';

const LexendText = (props) => {
  return <Text {...props} style={[props.style, { fontFamily: 'Lexend_400Regular' }]} />;
};

export default LexendText;