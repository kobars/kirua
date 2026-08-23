/** Public entry point of the design system. */

export { Button, type ButtonProps } from './Button';
export { buttonVariants } from './Button.variants';
export { IconButton, type IconButtonProps } from './IconButton';
export { Chip, type ChipProps } from './Chip';
export { AvatarStack, type AvatarStackProps, type AvatarItem } from './AvatarStack';
export { Badge, type BadgeProps } from './Badge';
export { Field, type FieldProps } from './Field';
export { Label, type LabelProps } from './Label';
export { Input, type InputProps } from './Input';
export { Textarea, type TextareaProps } from './Textarea';
export { DotGrid, type DotGridProps } from './DotGrid';
export { CornerGlint, type CornerGlintProps } from './CornerGlint';
export { resolveGlints, type Corner } from '@/lib/glint';
export { CARD_RADIUS_PX, PANEL_RADIUS_PX, PANEL_GLINT_INSET_PX } from '@/lib/radius';
export { Stat, StatRow, type StatProps } from './Stat';
export { NavBar, type NavBarProps, type NavItem } from './NavBar';
export {
  Card,
  CardEyebrow,
  CardTitle,
  CardBody,
  CardFooter,
  type CardProps,
  type CardTitleProps,
} from './Card';
export {
  SpotlightPanel,
  SpotlightMedia,
  SpotlightContent,
  type SpotlightPanelProps,
  type SpotlightMediaProps,
} from './SpotlightPanel';

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './Dialog';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './DropdownMenu';
export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './Tooltip';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
export { ScrollArea, ScrollBar, type ScrollAreaProps, type ScrollBarProps } from './ScrollArea';

export * from './icons';
