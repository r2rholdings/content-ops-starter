/**
 * Utility functions for generating data attributes for components
 * These attributes are used for Stackbit's visual editing features
 */

/**
 * DataAttributes interface defines the shape of data attributes
 * that can be applied to components for Stackbit's editing
 */
export interface DataAttributes {
  'data-sb-object-id'?: string;
  'data-sb-field-path'?: string;
  [key: string]: string | undefined;
}

/**
 * Options for generating data attributes
 */
export interface DataAttributesOptions {
  /** The object ID associated with the component */
  objectId?: string;
  /** The field path associated with the component */
  fieldPath?: string;
  /** Additional custom attributes to include */
  customAttributes?: Record<string, string>;
}

/**
 * Creates data attributes object for Stackbit's visual editing
 * 
 * @param options - Configuration options for the data attributes
 * @returns An object containing data attributes
 */
export function getDataAttributes(options: DataAttributesOptions = {}): DataAttributes {
  const { objectId, fieldPath, customAttributes = {} } = options;
  
  const dataAttributes: DataAttributes = {};
  
  // Add object ID attribute if provided
  if (objectId) {
    dataAttributes['data-sb-object-id'] = objectId;
  }
  
  // Add field path attribute if provided
  if (fieldPath) {
    dataAttributes['data-sb-field-path'] = fieldPath;
  }
  
  // Add any custom attributes
  Object.entries(customAttributes).forEach(([key, value]) => {
    dataAttributes[key] = value;
  });
  
  return dataAttributes;
}

/**
 * Creates nested field path by joining parent path with the child path
 * 
 * @param parentPath - The parent field path
 * @param childPath - The child field path to append
 * @returns The joined field path
 */
export function createFieldPath(parentPath: string, childPath: string): string {
  return parentPath ? `${parentPath}.${childPath}` : childPath;
}

/**
 * Creates an array item field path
 * 
 * @param fieldPath - The base field path for the array
 * @param index - The index of the item in the array
 * @returns The field path for the specific array item
 */
export function createArrayFieldPath(fieldPath: string, index: number): string {
  return `${fieldPath}.${index}`;
}

/**
 * Maps a list of items to their corresponding field paths
 * 
 * @param items - The array of items to map
 * @param fieldPath - The base field path for the array
 * @param mapFn - Optional mapping function to generate custom paths
 * @returns An array of [item, fieldPath] tuples
 */
export function mapItemsToFieldPaths<T>(
  items: T[],
  fieldPath: string,
  mapFn?: (item: T, index: number, fieldPath: string) => string
): Array<[T, string]> {
  return items.map((item, index) => {
    const itemFieldPath = mapFn 
      ? mapFn(item, index, fieldPath)
      : createArrayFieldPath(fieldPath, index);
    return [item, itemFieldPath];
  });
}

export function getDataAttrs(props: any = {}): any {
    return Object.entries(props).reduce((dataAttrs, [key, value]) => {
        if (key.startsWith('data-')) {
            dataAttrs[key] = value;
        }
        return dataAttrs;
    }, {});
}
