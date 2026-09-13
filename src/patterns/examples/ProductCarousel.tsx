'use client';

import { useRef, useState, type ComponentProps } from 'react';
import { AspectRatio, Button, Carousel, CarouselItem, Text } from '@/components';

const slides = ['Front', 'Side', 'Back', 'Folded', 'Boxed'] as const;

export function ProductCarousel(args: ComponentProps<typeof Carousel>) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  function goTo(index: number) {
    const element = track.current;
    const slide = element?.children[index];
    if (!(slide instanceof HTMLElement) || !element) return;
    const rtl = getComputedStyle(element).direction === 'rtl';
    const parent = element.getBoundingClientRect();
    const child = slide.getBoundingClientRect();
    element.scrollBy({
      left: rtl ? child.right - parent.right : child.left - parent.left,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }
  return (
    <div className="flex max-w-md flex-col gap-4">
      <Carousel
        {...args}
        ref={track}
        onScroll={() => {
          const element = track.current;
          if (!element) return;
          const rtl = getComputedStyle(element).direction === 'rtl';
          const parent = element.getBoundingClientRect();
          const distances = Array.from(element.children, (child) =>
            Math.abs(
              rtl
                ? child.getBoundingClientRect().right - parent.right
                : child.getBoundingClientRect().left - parent.left,
            ),
          );
          setCurrent(distances.indexOf(Math.min(...distances)));
        }}
      >
        {slides.map((label, index) => (
          <CarouselItem
            key={label}
            className="w-full"
            aria-label={`${index + 1} of ${slides.length}: ${label}`}
          >
            <AspectRatio ratio={4 / 3} className="rounded-md bg-sunken">
              <div className="grid size-full place-content-center font-text text-body-md text-fg">
                {label} view
              </div>
            </AspectRatio>
          </CarouselItem>
        ))}
      </Carousel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" disabled={current === 0} onClick={() => goTo(current - 1)}>
          Previous
        </Button>
        <output>
          <Text>
            {current + 1} of {slides.length}
          </Text>
        </output>
        <Button
          variant="secondary"
          disabled={current === slides.length - 1}
          onClick={() => goTo(current + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
