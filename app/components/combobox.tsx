import {
  UseComboboxProps,
  UseComboboxReturnValue,
  UseComboboxState,
  UseComboboxStateChangeOptions,
  useCombobox,
} from "downshift";
import React, {
  PropsWithChildren,
  createContext,
  forwardRef,
  useContext,
  useState,
} from "react";

type ComboboxContextValue = Pick<
  UseComboboxReturnValue<any>,
  | "inputValue"
  | "isOpen"
  | "getLabelProps"
  | "getMenuProps"
  | "getInputProps"
  | "highlightedIndex"
  | "getItemProps"
  | "selectedItem"
>;

const defaultStateReducer = (
  state: UseComboboxState<any>,
  actionAndChanges: UseComboboxStateChangeOptions<any>
) => {
  const { type, changes } = actionAndChanges;
  return changes;
};

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

const useComboboxContext = ({ componentName }: { componentName: string }) => {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error(
      `${componentName} components must be rendered inside of Combobox.Root component`
    );
  }

  return context;
};

export function Combobox() {}

export function ComboboxRoot<T>({
  children,
  filterFunc,
  items,
  onInputChange,
  onSelect,
  searchTerm,
  stateReducer = defaultStateReducer,
}: {
  filterFunc?: (item: T, query: string) => boolean;
  items: T[];
  onInputChange?: (inputValue: string) => void;
  onSelect?: (item: T) => void;
  stateReducer?: UseComboboxProps<any>["stateReducer"];
  searchTerm?: string;
  children: ({
    isOpen,
    filteredItems,
    highlightedIndex,
    selectedItem,
  }: {
    isOpen: boolean;
    filteredItems: T[];
    highlightedIndex: number;
    selectedItem: T;
  }) => any;
}) {
  const [query, setQuery] = useState("");

  const filteredItems = filterFunc
    ? items.filter((item) => filterFunc(item, query))
    : items;

  const {
    inputValue,
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    onSelectedItemChange({ selectedItem }) {
      onSelect && onSelect(selectedItem);
    },
    onInputValueChange({ inputValue }) {
      setQuery(inputValue ?? "");
      onInputChange && onInputChange(inputValue ?? "");
    },
    items,
    inputValue: searchTerm ?? "",
    itemToString(item) {
      return item ? item : "";
    },
    stateReducer,
  });

  return (
    <ComboboxContext.Provider
      value={{
        inputValue,
        isOpen,
        getLabelProps,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
        selectedItem,
      }}
    >
      {children({ isOpen, filteredItems, highlightedIndex, selectedItem })}
    </ComboboxContext.Provider>
  );
}

export function ComboboxLabel({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLLabelElement>) {
  const { getLabelProps } = useComboboxContext({
    componentName: "ComboboxLabel",
  });

  return (
    <label {...props} {...getLabelProps()}>
      {children}
    </label>
  );
}

export const ComboboxInput = forwardRef(function ComboboxInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const { getInputProps } = useComboboxContext({
    componentName: "ComboboxInput",
  });

  return <input {...props} {...getInputProps()} />;
});

export function ComboboxItems({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLUListElement>) {
  const { getMenuProps } = useComboboxContext({
    componentName: "ComboboxItems",
  });

  return (
    <ul {...props} {...getMenuProps()}>
      {children}
    </ul>
  );
}

export function ComboboxItem({
  item,
  index,
  children,
  ...props
}: {
  item: any;
  index: number;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLLIElement>) {
  const { getItemProps } = useComboboxContext({
    componentName: "ComboboxItem",
  });

  return (
    <li {...props} {...getItemProps({ item, index })}>
      {children}
    </li>
  );
}

Combobox.Root = ComboboxRoot;
Combobox.Label = ComboboxLabel;
Combobox.Input = ComboboxInput;
Combobox.Items = ComboboxItems;
Combobox.Item = ComboboxItem;
