import React from 'react';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';


interface IconProps {
  size: number;
  name: string;
  color: string;
  style?: {}
}

const Material = (props: IconProps) => <MaterialIcon {...props} />
const MaterialCommunity = (props: IconProps) => <MaterialCommunityIcon {...props} />
const FontAwesome = (props: IconProps) => <FontAwesomeIcon {...props} />
const Entypo = (props: IconProps) => <EntypoIcon {...props} />

export default  {
  Material,
  MaterialCommunity,
  FontAwesome,
  Entypo
}
