import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  Field,
  Grid,
  Heading,
  IconButton,
  Inline,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  MinusIcon,
  PlusIcon,
  RadioGroup,
  RadioGroupItem,
  SearchIcon,
  Slider,
  Stack,
  Text,
  Visible,
} from 'kirua';
import { brands, categories, colours, idr, sizes, type Category } from './data';
import { emptyFilters, PRICE_MAX, PRICE_STEP, type FilterState } from './filterState';

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
  /**
   * Off inside the filter sheet, whose own title names the panel. The sheet's
   * close control sits in its top-end corner, so the panel's buttons start on
   * the row below the title instead of underneath that control.
   */
  heading?: boolean;
}

/** Every collapsible section, so "open all" has something to name. */
const SECTIONS = ['category', 'price', 'brand', 'size'] as const;

/**
 * The same component in two places: a column from `md` up, and inside a `Sheet`
 * below it. Every group is an `Accordion` set to `multiple` — closing the size
 * filter to open the colour filter would be maddening on a phone, which is the
 * whole difference between `single` and `multiple`.
 */
export function Filters({
  value,
  onChange,
  query,
  onQueryChange,
  category,
  onCategoryChange,
  heading = true,
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
    <Stack gap={4}>
      <Inline justify={heading ? 'between' : 'end'} gap={3}>
        {heading && (
          <Heading as="h2" size="body-md">
            Filter
          </Heading>
        )}
        <Inline gap={1}>
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
        </Inline>
      </Inline>

      <Visible below="lg">
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
      </Visible>

      <Accordion type="multiple" value={open} onValueChange={setOpen}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={category}
              onValueChange={(next) => onCategoryChange(next as Category | 'all')}
              gap={2}
            >
              <Field orientation="horizontal" controlId="category-all" label="Everything">
                <RadioGroupItem value="all" />
              </Field>
              {categories.map((item) => (
                <Field
                  key={item.id}
                  orientation="horizontal"
                  controlId={`category-${item.id}`}
                  label={item.label}
                >
                  <RadioGroupItem value={item.id} />
                </Field>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <Stack gap={4}>
              <Slider
                value={value.price}
                min={0}
                max={PRICE_MAX}
                step={PRICE_STEP}
                thumbLabels={['Lowest price', 'Highest price']}
                onValueChange={([low, high]) =>
                  onChange({ ...value, price: [low ?? 0, high ?? PRICE_MAX] })
                }
              />
              <Text size="sm" numeric>
                {idr(value.price[0])} – {idr(value.price[1])}
              </Text>
            </Stack>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            <Stack gap={3}>
              {brands.map((brand) => (
                <Field
                  key={brand}
                  orientation="horizontal"
                  controlId={`brand-${brand}`}
                  label={brand}
                >
                  <Checkbox
                    checked={value.brands.includes(brand)}
                    onCheckedChange={() => toggle('brands', brand)}
                  />
                </Field>
              ))}
            </Stack>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <Inline wrap gap={3}>
              {sizes.map((size) => (
                <Field
                  key={size}
                  orientation="horizontal"
                  controlId={`size-${size}`}
                  label={size}
                >
                  <Checkbox
                    checked={value.sizes.includes(size)}
                    onCheckedChange={() => toggle('sizes', size)}
                  />
                </Field>
              ))}
            </Inline>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colour">
          <AccordionTrigger>Colour</AccordionTrigger>
          <AccordionContent>
            <Grid columns={2} gap={3}>
              {colours.map((colour) => (
                <Field
                  key={colour}
                  orientation="horizontal"
                  controlId={`colour-${colour}`}
                  label={colour}
                >
                  <Checkbox
                    checked={value.colours.includes(colour)}
                    onCheckedChange={() => toggle('colours', colour)}
                  />
                </Field>
              ))}
            </Grid>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="condition">
          <AccordionTrigger>Condition</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
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
                <Field key={id} orientation="horizontal" controlId={`cond-${id}`} label={label}>
                  <RadioGroupItem value={id} />
                </Field>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
}
