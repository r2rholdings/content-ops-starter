/**
 * Utility for mapping style objects to CSS class names
 * Primarily designed to work with Tailwind CSS classes
 */

/**
 * Interface for style objects
 */
export interface StyleProps {
  padding?: Padding;
  margin?: Margin;
  width?: Width;
  height?: Height;
  color?: Color;
  backgroundColor?: BackgroundColor;
  borderColor?: BorderColor;
  borderWidth?: BorderWidth;
  borderRadius?: BorderRadius;
  textAlign?: TextAlign;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  display?: Display;
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  gap?: Gap;
  position?: Position;
  shadow?: Shadow;
  opacity?: Opacity;
  overflow?: Overflow;
  zIndex?: ZIndex;
  transition?: Transition;
  transform?: Transform;
}

// Sub-interfaces for specific style properties
export type Padding = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  x?: string;
  y?: string;
  all?: string;
};

export type Margin = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  x?: string;
  y?: string;
  all?: string;
};

export type Width = string;
export type Height = string;

export type Color = string;
export type BackgroundColor = string;
export type BorderColor = string;

export type BorderWidth = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
};

export type BorderRadius = {
  topLeft?: string;
  topRight?: string;
  bottomRight?: string;
  bottomLeft?: string;
  all?: string;
};

export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type FontSize = string;
export type FontWeight = string;

export type Display = 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none';
export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type JustifyContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type Gap = string;

export type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
export type Shadow = string;
export type Opacity = string;
export type Overflow = 'auto' | 'hidden' | 'visible' | 'scroll';
export type ZIndex = string;
export type Transition = string;
export type Transform = string;

/**
 * Maps padding object to corresponding Tailwind CSS classes
 */
function mapPaddingToClassNames(padding: Padding): string[] {
  const classes: string[] = [];

  if (padding.all) {
    classes.push(`p-${padding.all}`);
  } else {
    if (padding.y) classes.push(`py-${padding.y}`);
    if (padding.x) classes.push(`px-${padding.x}`);
    if (padding.top) classes.push(`pt-${padding.top}`);
    if (padding.right) classes.push(`pr-${padding.right}`);
    if (padding.bottom) classes.push(`pb-${padding.bottom}`);
    if (padding.left) classes.push(`pl-${padding.left}`);
  }

  return classes;
}

/**
 * Maps margin object to corresponding Tailwind CSS classes
 */
function mapMarginToClassNames(margin: Margin): string[] {
  const classes: string[] = [];

  if (margin.all) {
    classes.push(`m-${margin.all}`);
  } else {
    if (margin.y) classes.push(`my-${margin.y}`);
    if (margin.x) classes.push(`mx-${margin.x}`);
    if (margin.top) classes.push(`mt-${margin.top}`);
    if (margin.right) classes.push(`mr-${margin.right}`);
    if (margin.bottom) classes.push(`mb-${margin.bottom}`);
    if (margin.left) classes.push(`ml-${margin.left}`);
  }

  return classes;
}

/**
 * Maps border width object to corresponding Tailwind CSS classes
 */
function mapBorderWidthToClassNames(borderWidth: BorderWidth): string[] {
  const classes: string[] = [];

  if (borderWidth.all) {
    classes.push(`border-${borderWidth.all}`);
  } else {
    if (borderWidth.top) classes.push(`border-t-${borderWidth.top}`);
    if (borderWidth.right) classes.push(`border-r-${borderWidth.right}`);
    if (borderWidth.bottom) classes.push(`border-b-${borderWidth.bottom}`);
    if (borderWidth.left) classes.push(`border-l-${borderWidth.left}`);
  }

  return classes;
}

/**
 * Maps border radius object to corresponding Tailwind CSS classes
 */
function mapBorderRadiusToClassNames(borderRadius: BorderRadius): string[] {
  const classes: string[] = [];

  if (borderRadius.all) {
    classes.push(`rounded-${borderRadius.all}`);
  } else {
    if (borderRadius.topLeft) classes.push(`rounded-tl-${borderRadius.topLeft}`);
    if (borderRadius.topRight) classes.push(`rounded-tr-${borderRadius.topRight}`);
    if (borderRadius.bottomRight) classes.push(`rounded-br-${borderRadius.bottomRight}`);
    if (borderRadius.bottomLeft) classes.push(`rounded-bl-${borderRadius.bottomLeft}`);
  }

  return classes;
}

/**
 * Maps flex properties to corresponding Tailwind CSS classes
 */
function mapFlexPropertiesToClassNames(
  display: Display = 'block',
  flexDirection?: FlexDirection,
  justifyContent?: JustifyContent,
  alignItems?: AlignItems,
  gap?: Gap
): string[] {
  const classes: string[] = [];

  // Add display class
  classes.push(display);
  
  // Add flex direction if display is flex or inline-flex
  if ((display === 'flex' || display === 'inline-flex') && flexDirection) {
    classes.push(`flex-${flexDirection}`);
  }

  // Add justify content if display is flex or inline-flex
  if ((display === 'flex' || display === 'inline-flex') && justifyContent) {
    classes.push(`justify-${justifyContent}`);
  }

  // Add align items if display is flex or inline-flex
  if ((display === 'flex' || display === 'inline-flex') && alignItems) {
    classes.push(`items-${alignItems}`);
  }

  // Add gap if provided
  if (gap) {
    classes.push(`gap-${gap}`);
  }

  return classes;
}

/**
 * Main function to map style object to CSS class names
 */
export function mapStylesToClassNames(styles?: StyleProps): string {
  if (!styles) return '';

  const classNames: string[] = [];

  // Map padding
  if (styles.padding) {
    classNames.push(...mapPaddingToClassNames(styles.padding));
  }

  // Map margin
  if (styles.margin) {
    classNames.push(...mapMarginToClassNames(styles.margin));
  }

  // Map width
  if (styles.width) {
    classNames.push(`w-${styles.width}`);
  }

  // Map height
  if (styles.height) {
    classNames.push(`h-${styles.height}`);
  }

  // Map text color
  if (styles.color) {
    classNames.push(`text-${styles.color}`);
  }

  // Map background color
  if (styles.backgroundColor) {
    classNames.push(`bg-${styles.backgroundColor}`);
  }

  // Map border color
  if (styles.borderColor) {
    classNames.push(`border-${styles.borderColor}`);
  }

  // Map border width
  if (styles.borderWidth) {
    classNames.push(...mapBorderWidthToClassNames(styles.borderWidth));
  }

  // Map border radius
  if (styles.borderRadius) {
    classNames.push(...mapBorderRadiusToClassNames(styles.borderRadius));
  }

  // Map text alignment
  if (styles.textAlign) {
    classNames.push(`text-${styles.textAlign}`);
  }

  // Map font size
  if (styles.fontSize) {
    classNames.push(`text-${styles.fontSize}`);
  }

  // Map font weight
  if (styles.fontWeight) {
    classNames.push(`font-${styles.fontWeight}`);
  }

  // Map flex properties
  if (styles.display || styles.flexDirection || styles.justifyContent || styles.alignItems || styles.gap) {
    classNames.push(
      ...mapFlexPropertiesToClassNames(
        styles.display,
        styles.flexDirection,
        styles.justifyContent,
        styles.alignItems,
        styles.gap
      )
    );
  }

  // Map position
  if (styles.position) {
    classNames.push(styles.position);
  }

  // Map shadow
  if (styles.shadow) {
    classNames.push(`shadow-${styles.shadow}`);
  }

  // Map opacity
  if (styles.opacity) {
    classNames.push(`opacity-${styles.opacity}`);
  }

  // Map overflow
  if (styles.overflow) {
    classNames.push(`overflow-${styles.overflow}`);
  }

  // Map z-index
  if (styles.zIndex) {
    classNames.push(`z-${styles.zIndex}`);
  }

  // Map transition
  if (styles.transition) {
    classNames.push(`transition-${styles.transition}`);
  }

  // Map transform
  if (styles.transform) {
    classNames.push(`transform-${styles.transform}`);
  }

  return classNames.join(' ');
}

/**
 * Helper function to combine multiple style objects
 * Later objects will override properties from earlier ones
 */
export function combineStyles(...styleObjects: (StyleProps | undefined)[]): StyleProps {
  return styleObjects.reduce((combined, styleObj) => {
    if (!styleObj) return combined;
    return { ...combined, ...styleObj };
  }, {});
}

/**
 * Helper function to create a style object with padding
 */
export function createPadding(
  top?: string,
  right?: string,
  bottom?: string,
  left?: string,
  x?: string,
  y?: string,
  all?: string
): Padding {
  return { top, right, bottom, left, x, y, all };
}

/**
 * Helper function to create a style object with margin
 */
export function createMargin(
  top?: string,
  right?: string,
  bottom?: string,
  left?: string,
  x?: string,
  y?: string,
  all?: string
): Margin {
  return { top, right, bottom, left, x, y, all };
}

/**
 * Helper function to create a flex container style object
 */
export function createFlexContainer(
  direction: FlexDirection = 'row',
  justify?: JustifyContent,
  align?: AlignItems,
  gap?: Gap
): Partial<StyleProps> {
  return {
    display: 'flex',
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    gap,
  };
}

const TAILWIND_MAP = {
    alignItems: {
        'flex-start': 'items-start',
        'flex-end': 'items-end',
        center: 'items-center'
    },
    backgroundPosition: {
        bottom: 'bg-bottom',
        center: 'bg-center',
        left: 'bg-left',
        'left-bottom': 'bg-left-bottom',
        'left-top': 'bg-left-top',
        right: 'bg-right',
        'right-bottom': 'bg-right-bottom',
        'right-top': 'bg-right-top',
        top: 'bg-top'
    },
    backgroundRepeat: {
        repeat: 'bg-repeat',
        'repeat-x': 'bg-repeat-x',
        'repeat-y': 'bg-repeat-y',
        'no-repeat': 'bg-no-repeat'
    },
    backgroundSize: {
        auto: 'bg-auto',
        cover: 'bg-cover',
        contain: 'bg-contain'
    },
    borderRadius: {
        none: 'rounded-none',
        'xx-small': 'rounded-sm',
        'x-small': 'rounded',
        small: 'rounded-md',
        medium: 'rounded-lg',
        large: 'rounded-xl',
        'x-large': 'rounded-2xl',
        'xx-large': 'rounded-3xl',
        full: 'rounded-full'
    },
    borderStyle: {
        none: 'border-none',
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted',
        double: 'border-double'
    },
    borderWidth: {
        0: 'border-0',
        1: 'border',
        2: 'border-2',
        4: 'border-4',
        8: 'border-8'
    },
    boxShadow: {
        none: 'shadow-none',
        'x-small': 'shadow-sm',
        small: 'shadow',
        medium: 'shadow-md',
        large: 'shadow-lg',
        'x-large': 'shadow-xl',
        'xx-large': 'shadow-2xl',
        inner: 'shadow-inner'
    },
    fontSize: {
        'x-small': 'text-xs',
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
        'x-large': 'text-xl',
        'xx-large': 'text-2xl',
        'xxx-large': 'text-3xl'
    },
    fontStyle: {
        italic: 'italic'
    },
    fontWeight: {
        100: 'font-thin',
        200: 'font-extralight',
        300: 'font-light',
        400: 'font-normal',
        500: 'font-medium',
        600: 'font-semibold',
        700: 'font-bold',
        800: 'font-extrabold'
    },
    justifyContent: {
        'flex-start': 'justify-start',
        'flex-end': 'justify-end',
        center: 'justify-center'
    },
    margin: function (value) {
        // for tailwind margins - ['twt0:16', 'twb0:16'], the value will be array ['mt-0', 'mb-4']
        if (Array.isArray(value)) {
            return value.join(' ');
        }
        // for regular margins - ['x0:8', 'y0:16'], the value will be object: { left: 4, top: 10 }
        if (typeof value === 'object' && value !== null) {
            const classNames = [];
            Object.entries(value).forEach(([styleProp, styleValue]) => {
                const twValue = styleValue === 1 ? 'px' : String(Number(styleValue) / 4);
                if (styleProp === 'top') {
                    classNames.push(`mt-${twValue}`);
                } else if (styleProp === 'bottom') {
                    classNames.push(`mb-${twValue}`);
                } else if (styleProp === 'left') {
                    classNames.push(`ml-${twValue}`);
                } else if (styleProp === 'right') {
                    classNames.push(`mr-${twValue}`);
                }
            });
            return classNames.join(' ');
        }
        // this object can not be converted into classes and needs to be handled differently
        console.warn('cannot convert "margin" style field value to class name');
        return '';
    },
    padding: function (value) {
        // for tailwind paddings - ['twt0:16', 'twb0:16'], the value will be array ['pt-0', 'pb-4']
        if (Array.isArray(value)) {
            return value.join(' ');
        }
        // for regular paddings - ['x0:8', 'y0:16'], the value will be object: { left: 4, top: 10 }
        if (typeof value === 'object' && value !== null) {
            const classNames = [];
            Object.entries(value).forEach(([styleProp, styleValue]) => {
                const twValue = styleValue === 1 ? 'px' : String(Number(styleValue) / 4);
                if (styleProp === 'top') {
                    classNames.push(`pt-${twValue}`);
                } else if (styleProp === 'bottom') {
                    classNames.push(`pb-${twValue}`);
                } else if (styleProp === 'left') {
                    classNames.push(`pl-${twValue}`);
                } else if (styleProp === 'right') {
                    classNames.push(`pr-${twValue}`);
                }
            });
            return classNames.join(' ');
        }
        // this object can not be converted into classes and needs to be handled differently
        console.warn('cannot convert "padding" style field value to class name');
        return '';
    },
    textAlign: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify'
    },
    textDecoration: {
        underline: 'underline',
        'line-through': 'line-through',
        'underline line-through': 'underline-line-through'
    }
};

export function mapStylesToClassNames(styles: Record<string, any>) {
    return Object.entries(styles)
        .map(([prop, value]) => {
            if (prop in TAILWIND_MAP) {
                if (typeof TAILWIND_MAP[prop] === 'function') {
                    return TAILWIND_MAP[prop](value);
                } else if (value in TAILWIND_MAP[prop]) {
                    return TAILWIND_MAP[prop][value];
                }
            } else {
                // if prop or value don't exist in the map, use the value as is,
                // useful for direct color values.
                return value;
            }
        })
        .join(' ');
}
