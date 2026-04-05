import { theme } from '@/theme';
import React from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import {
   Platform,
   StyleSheet,
   SwitchProps,
   TextInputProps,
   TextStyle,
   ViewStyle,
} from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import { InputStyles } from './InputStyles';

type Props = SwitchProps & {
   name: string;
   control: Control<any>;
   rules?: RegisterOptions;
   label?: string;
   defaultValue?: string;
   style?: TextStyle | ViewStyle;
   error?: string | null;
   inputProps?: Omit<TextInputProps, 'onChangeText' | 'value'>;
   icon?: React.JSX.Element;
}

export function InputSwitch({
   name,
   control,
   rules,
   label,
   defaultValue = '',
   error,
   icon,
   ...inputProps
}: Props) {
   return (
      <InputStyles label={label} error={error ?? ''} icon={icon} style={styles.container}>
         <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
            render={({ field: { onChange, value } }) => {
               return (
                  <Switch
                     trackColor={{ false: '#767577', true: theme.colors.success }}
                     thumbColor={!!value ? '#fff' : '#f4f3f4'}
                     ios_backgroundColor="#3e3e3e"
                     onValueChange={() => onChange(!value)}
                     value={!!value}
                     {...inputProps}
                  />
               );
            }}
         />
      </InputStyles>
   );
}

const styles = StyleSheet.create({
   container:
   {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'

   },
   input: {
      height: 44,
      borderRadius: 8,
      paddingHorizontal: 12,
      color: theme.colors.gray,

      borderColor: theme.border.primary,
      borderWidth: 0.5,
      backgroundColor: theme.colors.gray,
      shadowColor: theme.shadows.gray,
      shadowOffset: Platform.select({
         ios: { width: 3, height: 1 },
         android: { width: 6, height: 6 }
      }),
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: Platform.OS === "ios" ? 1 : 10,
   },
   inputError: {
      borderColor: theme.border.danger,
      shadowColor: theme.shadows.danger,
      shadowOffset: Platform.select({
         ios: { width: 3, height: 1 },
         android: { width: 6, height: 6 }
      }),
      shadowOpacity: 1,
      elevation: Platform.OS === "ios" ? 1 : 10,
   },

});