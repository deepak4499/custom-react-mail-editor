import { isEqual, omit } from 'lodash';
import React, { useContext, useMemo, useRef } from 'react';

export interface ExtensionProps {
  children?: React.ReactNode | React.ReactElement;
  categories: Array<
    | {
      label: string;
      active?: boolean;
      blocks: Array<{
        type: string;
        payload?: any;
        title?: string | undefined;
      }>;
      displayType?: 'grid';
    }
    | {
      label: string;
      active?: boolean;
      blocks: Array<{
        payload?: any;
        title?: string | undefined;
      }>;
      displayType: 'column';
    }
    | {
      label: string;
      active?: boolean;
      blocks: Array<{
        payload?: any;
      }>;
      displayType: 'widget';
    }
  >;
}

export const ExtensionContext = React.createContext<ExtensionProps>({
  categories: [],
});

export const ExtensionProvider: React.FC<ExtensionProps> = props => {
  const value = omit(props, 'children');
  const valueRef = useRef(value);

  const cacheValue = useMemo(() => {
    if (!isEqual(value, valueRef)) {
      valueRef.current = value;
    }
    return valueRef.current;
  }, [value, valueRef]);

  return (
    <ExtensionContext.Provider value={cacheValue}>
      {props.children}
    </ExtensionContext.Provider>
  );
};

export function useExtensionProps() {
  return useContext(ExtensionContext);
}
