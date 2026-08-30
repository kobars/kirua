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
import { brands, categories, colours, rupiah, sizes, type Category } from './data';
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
  category: Category | 'semua';
  onCategoryChange: (next: Category | 'semua') => void;
}

/**
 * The same component in two places: a column from `md` up, and inside a `Sheet`
 * below it. Every group is an `Accordion` set to `multiple` — closing the size
 * filter to open the colour filter would be maddening on a phone, which is the
 * whole difference between `single` and `multiple`.
 */
/** Every collapsible section, so "open all" has something to name. */
const SECTIONS = ['kategori', 'harga', 'merek', 'ukuran'] as const;

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
            aria-label={open.length === 0 ? 'Buka semua bagian' : 'Tutup semua bagian'}
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
            aria-label="Cari barang"
            placeholder="Cari barang"
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </InputGroup>
      </div>

      <Accordion type="multiple" value={open} onValueChange={setOpen}>
        <AccordionItem value="kategori">
          <AccordionTrigger>Kategori</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={category}
              onValueChange={(next) => onCategoryChange(next as Category | 'semua')}
              className="grid gap-2 pt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="semua" id="kategori-semua" />
                <Label htmlFor="kategori-semua">Semua</Label>
              </div>
              {categories.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <RadioGroupItem value={item.id} id={`kategori-${item.id}`} />
                  <Label htmlFor={`kategori-${item.id}`}>{item.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="harga">
          <AccordionTrigger>Harga</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 pt-2">
              <Slider
                value={value.price}
                min={0}
                max={800000}
                step={10000}
                thumbLabels={['Harga terendah', 'Harga tertinggi']}
                onValueChange={([low, high]) =>
                  onChange({ ...value, price: [low ?? 0, high ?? 800000] })
                }
              />
              <Text size="sm" className="tabular-nums">
                {rupiah(value.price[0])} – {rupiah(value.price[1])}
              </Text>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="merek">
          <AccordionTrigger>Merek</AccordionTrigger>
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

        <AccordionItem value="ukuran">
          <AccordionTrigger>Ukuran</AccordionTrigger>
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

        <AccordionItem value="warna">
          <AccordionTrigger>Warna</AccordionTrigger>
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

        <AccordionItem value="kondisi">
          <AccordionTrigger>Kondisi</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              className="pt-1"
              value={value.condition}
              onValueChange={(condition) =>
                onChange({ ...value, condition: condition as FilterState['condition'] })
              }
              aria-label="Kondisi"
            >
              {(
                [
                  ['any', 'Semua'],
                  ['new', 'Baru'],
                  ['used', 'Bekas'],
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
