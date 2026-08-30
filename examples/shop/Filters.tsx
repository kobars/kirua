import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  Label,
  RadioGroup,
  RadioGroupItem,
  Slider,
} from 'kirua';
import { brands, colours, rupiah, sizes } from './data';
import { emptyFilters, type FilterState } from './filterState';

export interface FiltersProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

/**
 * The same component in two places: a column from `md` up, and inside a `Sheet`
 * below it. Every group is an `Accordion` set to `multiple` — closing the size
 * filter to open the colour filter would be maddening on a phone, which is the
 * whole difference between `single` and `multiple`.
 */
export function Filters({ value, onChange }: FiltersProps) {
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
        <h2 className="text-body-md font-semibold text-fg">Filter</h2>
        <Button variant="ghost" size="sm" onClick={() => onChange(emptyFilters)}>
          Reset
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['harga', 'merek', 'ukuran']}>
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
              <p className="text-body-sm text-fg-secondary tabular-nums">
                {rupiah(value.price[0])} – {rupiah(value.price[1])}
              </p>
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
