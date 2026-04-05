import { theme } from '@/theme';
import React from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { Pressable, StyleProp, StyleSheet, TextInputProps, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Text from '../Text';
import { InputStyles } from './InputStyles';

type RadioButtonProps = {
   label: string;
   value: string;
   selectedValue: string;
   onSelect: (value: string) => void;
}

export const RadioButton = ({ label, value, selectedValue, onSelect }: RadioButtonProps) => {
   const isSelected = String(selectedValue) === String(value);

   return (
      <Pressable style={styles.radioContainer} onPress={() => onSelect(value)}>
         <View style={[styles.outerCircle, isSelected && styles.outerCircleSelected]}>
            {isSelected && (
               <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <View style={styles.innerCircle} />
               </Animated.View>
            )}
         </View>
         <Text type='subtitulo'>{label}</Text>
      </Pressable>
   );
};

type Props = {
   name: string;
   control: Control<any>;
   rules?: RegisterOptions;
   label?: string;
   defaultValue?: string;
   style?: StyleProp<ViewStyle>;
   error?: string | null;
   inputProps?: Omit<TextInputProps, 'onChangeText' | 'value'>;
   icon?: React.JSX.Element;
   options: { label: string; value: string }[];
}

export default function RadioGroup({ control, name, rules, label, defaultValue,
   style,
   error,
   inputProps,
   icon,
   options }: Props) {

   return (
      <InputStyles label={label} error={error ?? ''} icon={icon} style={[style, styles.container]}>
         <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
            render={({ field: { onChange, value } }) => {
               return (<>
                  {options.map(option => (
                     <RadioButton
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        selectedValue={value}
                        onSelect={(option: any) => {
                           onChange(option);
                        }}
                        {...inputProps}
                     />))}
               </>);
            }}
         />
      </InputStyles>


   );
}



const styles = StyleSheet.create({
   radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 6,
      gap: 6,
      marginTop: 12,
   },
   outerCircle: {
      height: 22,
      width: 22,
      borderRadius: 44,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: 'rgba(82, 6, 55, 0.068)',
      alignItems: 'center',
      justifyContent: 'center',
   },
   outerCircleSelected: {
      borderColor: theme.colors.primary,
   },
   innerCircle: {
      height: 16,
      width: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
   },
   container: {
     gap: 6,
     paddingTop: 6,

   },
});