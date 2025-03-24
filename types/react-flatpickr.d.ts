declare module "react-flatpickr" {
  import { ComponentProps } from "react";

  interface FlatpickrProps extends Omit<ComponentProps<"input">, "onChange"> {
    value?: string | Date | Date[];
    onChange?: (selectedDates: Date[], dateStr: string, instance: any) => void;
    options?: any;
  }

  const Flatpickr: React.FC<FlatpickrProps>;

  export default Flatpickr;
}
