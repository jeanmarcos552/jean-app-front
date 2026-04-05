import InputDate from "./Date";
import RadioGroup from "./Radio";
import { Select } from "./Select";
import { InputSwitch } from "./Switch";
import InputText from "./Text";
import { TextArea } from "./TextArea";

export const Input = {
   Text: InputText,
   Checkbox: InputSwitch,
   Radio: RadioGroup,
   Select,
   TextArea,
   Date: InputDate,
}