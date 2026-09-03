import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  Heading,
  IconButton,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  MinusIcon,
  PlusIcon,
  RadioGroup,
  RadioGroupItem,
  SearchIcon,
  Slider,
  Text,
} from 'kirua';
import { brands, categories, colours, idr, sizes, type Category } from './data';
import { emptyFilters, type FilterState } from './filterState';

export interface FiltersProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
  /**
   * The search box and the category list live here as well as in the header,
   * because the header hides both below `lg` and this panel is what a phone
   * gets instead. One control in two places beats a phone that cannot search.
   */
  query: string;
  onQueryChange: (next: string) => void;
  category: Category | 'all';
  onCategoryChange: (next: Category | 'all') => void;
}

/**
 * The same component in two places: a column from `md` up, and inside a `Sheet`
 * below it. Every group is an `Accordion` set to `multiple` — closing the size
 * filter to open the colour filter would be maddening on a phone, which is the
 * whole difference between `single` and `multiple`.
 */
/** Every collapsible section, so "open all" has something to name. */
const SECTIONS = ['category', 'price', 'brand', 'size'] as const;

export function Filters({
  value,
  onChange,
  query,
  onQueryChange,
  category,
  onCategoryChange,
}: FiltersProps) {
  const [open, setOpen] = useState<string[]>([...SECTIONS]);

  const toggle = (key: 'brands' | 'colours' | 'sizes', item: string) =>
    onChange({
      ...value,
      [key]: value[key].includes(item)
        ? value[key].filter((v) => v !== item)
        : [...value[key], item],
    });

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <Heading as="h2" size="body-md">
          Filter
        </Heading>
        <div className="flex items-center gap-1">
          {/* Plus and minus, because the control does the opposite of what it
              shows: a minus closes what is open. A chevron would say
              "expand this one" and this one is all of them. */}
          <IconButton
            aria-label={open.length === 0 ? 'Open every section' : 'Close every section'}
            variant="ghost"
            size="sm"
            onClick={() => setOpen(open.length === 0 ? [...SECTIONS] : [])}
          >
            {open.length === 0 ? <PlusIcon /> : <MinusIcon />}
          </IconButton>
          <Button variant="ghost" size="sm" onClick={() => onChange(emptyFilters)}>
            Reset
          </Button>
        </div>
      </div>

      <div className="lg:hidden">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            aria-label="Search products"
            placeholder="Search products"
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </InputGroup>
      </div>

      <Accordion type="multiple" value={open} onValueChange={setOpen}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={category}
              onValueChange={(next) => onCategoryChange(next as Category | 'all')}
              className="grid gap-2 pt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="all" id="category-all" />
                <Label htmlFor="category-all">Everything</Label>
              </div>
              {categories.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <RadioGroupItem value={item.id} id={`category-${item.id}`} />
                  <Label htmlFor={`category-${item.id}`}>{item.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 pt-2">
              <Slider
                value={value.price}
                min={0}
                max={800000}
                step={10000}
                thumbLabels={['Lowest price', 'Highest price']}
                onValueChange={([low, high]) =>
                  onChange({ ...value, price: [low ?? 0, high ?? 800000] })
                }
              />
              <Text size="sm" className="tabular-nums">
                {idr(value.price[0])} – {idr(value.price[1])}
              </Text>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 pt-1">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center gap-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={value.brands.includes(brand)}
                    onCheckedChange={() => toggle('brands', brand)}
                  />
                  <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-3 pt-1">
              {sizes.map((size) => (
                <div key={size} className="flex items-center gap-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={value.sizes.includes(size)}
                    onCheckedChange={() => toggle('sizes', size)}
                  />
                  <Label htmlFor={`size-${size}`}>{size}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colour">
          <AccordionTrigger>Colour</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {colours.map((colour) => (
                <div key={colour} className="flex items-center gap-2">
                  <Checkbox
                    id={`colour-${colour}`}
                    checked={value.colours.includes(colour)}
                    onCheckedChange={() => toggle('colours', colour)}
                  />
                  <Label htmlFor={`colour-${colour}`}>{colour}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="condition">
          <AccordionTrigger>Condition</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              className="pt-1"
              value={value.condition}
              onValueChange={(condition) =>
                onChange({ ...value, condition: condition as FilterState['condition'] })
              }
              aria-label="Condition"
            >
              {(
                [
                  ['any', 'Any'],
                  ['new', 'New'],
                  ['used', 'Used'],
                ] as const
              ).map(([id, label]) => (
                <div key={id} className="flex items-center gap-2">
                  <RadioGroupItem value={id} id={`cond-${id}`} />
                  <Label htmlFor={`cond-${id}`}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
