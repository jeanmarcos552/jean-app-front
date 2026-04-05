import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type RootProps = {
   children?: ReactNode;
   style?: StyleProp<ViewStyle>;
   gap?: number;
};

export const ContainerLayout = ({ children, style, gap = 8 }: RootProps) => {

   return (
      <View style={StyleSheet.flatten([  styles.container, { gap }, style, ])}>
         {children}
      </View>
   )
};


const styles = StyleSheet.create({

   container: {
      flex: 1,
      paddingHorizontal: 2,
   },

});