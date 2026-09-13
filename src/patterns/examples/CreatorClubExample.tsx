'use client';

import { useState } from 'react';
import { Badge, Button, Card, CardBody, CardFooter, Heading, Text } from '@/components';

export function CreatorClubExample() {
  const [joined, setJoined] = useState(false);
  return (
    <Card variant="brand" padding="lg" glint={['top-start', 'bottom-end']} className="max-w-lg">
      <Badge status="info">Weekly drawing club</Badge>
      <Heading as="h2" size="display-md">
        Small sketches. New worlds.
      </Heading>
      <CardBody>Share your characters, trade ideas and find your next drawing prompt.</CardBody>
      <CardFooter>
        <Button onClick={() => setJoined(!joined)} aria-pressed={joined}>
          {joined ? 'Leave club' : 'Join the club'}
        </Button>
      </CardFooter>
      <output>
        <Text>{joined ? 'You joined the club. Welcome!' : 'Open to every skill level.'}</Text>
      </output>
    </Card>
  );
}
