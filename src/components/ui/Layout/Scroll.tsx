import { theme } from "@/theme";
import React from "react";
import { RefreshControl, ScrollView, ScrollViewProps } from "react-native";
import { Separator } from "./Separator";

export type RootScrollProps = ScrollViewProps & {
   isRefetching?: boolean;
   refetch?: () => void;
   gap?: number;
};

export const RootScroll: React.FC<RootScrollProps> = ({
   children,
   contentContainerStyle,
   isRefetching = false,
   refetch = () => { },
   gap = 6,
   ...rest
}) => {
   return (
      <ScrollView
         contentContainerStyle={[
            { marginHorizontal: 6, gap },
            contentContainerStyle,
         ]}
         showsVerticalScrollIndicator={false}
         refreshControl={
            <RefreshControl
               tintColor={theme.colors.primary}
               refreshing={isRefetching}
               onRefresh={refetch}
            />
         }
         {...rest}
      >
         {children}
         <Separator />
      </ScrollView>
   );
};
