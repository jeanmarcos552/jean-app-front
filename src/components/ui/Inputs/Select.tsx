import { theme } from '@/theme';
import { Picker } from '@react-native-picker/picker';
import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '../Text';
import View from '../View';
import { InputStyles } from './InputStyles';
import { stylesInput } from './Text';

interface SelectProps {
   label?: string
   error?: string
   placeholder?: string
   focus?: boolean
   control: any
   name: string
   mask?: any
   options: { label: string; value: any }[],
   corInicial?: string;
   bg?: string;
   icon?: React.JSX.Element;
   style?: object;
   handleChangeText?: (text: string) => void;
}

export const Select = ({ control, name, error, options, label, icon, style, handleChangeText }: SelectProps) => {
   const pickerRef = useRef<Picker<any>>(null);

   function open() {
      pickerRef.current?.focus?.();
   }

   if (!options) return null;

   return (
      <InputStyles label={label} error={error ?? ''} icon={icon} style={[style, styles.container]}>

         <Controller
            name={name}
            control={control}
            rules={{
               required: true,
            }}
            render={({ field: { onChange, value } }) => {
               return (
                  <View style={[
                     stylesInput.input, styles.container,
                     Platform.select({
                        ios: {
                           height: 'auto'
                        },
                     })
                  ]}>
                     <TouchableOpacity onPress={() => {
                        open();
                     }}>
                        <Text>
                           {options.find(item => String(item.value) === String(value))?.label || label || 'Selecione...'}
                        </Text>
                     </TouchableOpacity>

                     <Picker
                        style={Platform.select({
                           android: {
                              display: 'none'
                           },
                        })}
                        itemStyle={{
                           fontSize: 14, color: theme.colors.white,
                           fontFamily: theme.fonts.body
                        }}
                        ref={pickerRef}
                        mode='dialog'
                        selectedValue={value}
                        onValueChange={(itemValue) => {
                           if (handleChangeText) {
                              handleChangeText(itemValue);
                           }

                           onChange(itemValue)
                        }}
                     >
                        {options.map(item => {
                           return (
                              <Picker.Item key={item.value} label={item.label} value={item.value} />
                           )
                        })}
                     </Picker>
                  </View>
               )
            }}
         />
      </InputStyles>
   );
};

const styles = StyleSheet.create({
   container: {
      justifyContent: 'center',
   },
   error: {
      alignItems: 'center',
   }
});