import { Colors } from "@/constants/theme";
import { ColorsType } from "@/theme";
import React from "react";
import { ActivityIndicator } from "react-native";

type SkeletonProps = {
   size?: number;
   color?: ColorsType;
};

export const Skeleton = ({ size = 22, color = "primary" }: SkeletonProps) => {
   return (
      <ActivityIndicator size={size} color={Colors[color]} />
   );
};


