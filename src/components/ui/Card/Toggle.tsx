import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/theme';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import Text from '../Text';
import View from '../View';
import { Root } from './Root';

export function Collapsible({ children, title, ...rest }: PropsWithChildren & { title: string }) {
   const [isOpen, setIsOpen] = useState(true);
   const childrenWithProps = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
         return React.cloneElement(child, { ...rest });
      }
      return child;
   });
   return (
      <View>
         <TouchableOpacity
            style={styles.heading}
            onPress={() => setIsOpen((value) => !value)}
            activeOpacity={0.8}>
            <IconSymbol
               name="chevron.right"
               size={18}
               weight="medium"
               color={theme.colors.primary}
               style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
            />

            <Text type="subtitulo">{title}</Text>
         </TouchableOpacity>

         {isOpen && (
            <Animated.View exiting={FadeOutDown} entering={FadeInUp}>
               <Root>{childrenWithProps}</Root>
            </Animated.View>
         )}
         
      </View>
   );
}

const styles = StyleSheet.create({
   heading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
   },
   content: {
      marginTop: 6,
      marginLeft: 24,
   },
});
