import {
  ArgTypes,
  Description,
  Heading,
  Primary,
  Stories,
  Title,
  useOf,
} from '@storybook/addon-docs/blocks';

export function DocsPage() {
  const { preparedMeta } = useOf('meta', ['meta']);
  const hasProps = Object.keys(preparedMeta.argTypes).length > 0;
  return (
    <>
      <Title />
      <Description />
      <Heading>Usage</Heading>
      <Primary />
      {hasProps && (
        <>
          <Heading>Props</Heading>
          <ArgTypes />
        </>
      )}
      <Stories title="Examples" includePrimary={false} />
    </>
  );
}
