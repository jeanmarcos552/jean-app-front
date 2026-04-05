import { theme } from '@/theme';
import React from 'react';
import { StyleProp, ViewProps, View as ViewRN, ViewStyle } from 'react-native';
import { viewStylesVariant } from './View';

export type ViewProp = ViewProps & {
   children?: React.ReactNode;
   style?: StyleProp<ViewStyle>;
   variant?: keyof typeof viewStylesVariant;
   backgroundColor?: keyof typeof theme.background;
   flex?: number;
};

const Flex = ({ children, style, variant, flex, ...rest }: ViewProp) => {
   return (
      <ViewRN
         style={[viewStylesVariant[variant || 'column'], style, {
            flex: flex ?? 1,
         }]}
         {...rest}
      >
         {children && children}
      </ViewRN>
   );
};


export default Flex;
