import React from "react";
import { Button, ButtonProps } from "../../Buttons";
import Text from "../../Text";
import View from "../../View";

type ActionProps = ButtonProps & {
  label?: string;
};
export const Action = ({ label, ...rest }: ActionProps) => {
  return (
    <View style={{ bottom: 12, alignItems: "center" }}>
      {label && <Text type="small">{label}</Text>}
      <Button variant="success" size="large" {...rest} />
    </View>
  );
};
