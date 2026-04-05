import React from 'react';

import { AntDesign } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Icon } from '../Card/Icon';
import Text from '../Text';
import View from '../View';
import { Root } from './Root';

type EmptyProps = {
   children?: React.ReactNode;
   mensagem?: string;
}
export const Empty = ({ children, mensagem }: EmptyProps) => {
   const msg = mensagem || "Nenhum dado encontrado.";
   return (
      <Root>
         <View style={styles.container}>
            <Icon style={styles.icon} size="large">
               <AntDesign name="frown" size={18} color="#ffffff" />
            </Icon>
            <Text type='titulo' style={styles.icon}>
               {msg}
            </Text>

            <View style={styles.loading}>
               {children ?? children}
            </View>
         </View>
      </Root>
   );
}


const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 22,
   },

   loading: {
      gap: 22
   },

   icon: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      gap: 12

   }
})