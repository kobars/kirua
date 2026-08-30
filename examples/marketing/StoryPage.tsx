import {
  Card,
  CardBody,
  CardTitle,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from 'kirua';
import { MILESTONES, PRINCIPLES } from './data';

/**
 * The long-form page, and the first real body copy in this repository.
 *
 * Everything else here is an application: labels, rows and controls. A story
 * page is paragraphs, and paragraphs are what the content primitives have to be
 * designed against rather than guessed at.
 */
export function StoryPage() {
  return (
    <div className="mx-auto grid w-full max-w-3xl grid-cols-[minmax(0,1fr)] content-start gap-6 px-4 py-8 md:px-8">
      <div className="grid gap-3">
        <p className="text-caption font-medium text-fg-muted uppercase">Our story</p>
        <h1 className="text-heading-lg font-semibold text-balance text-fg">
          We built the thing we kept failing to do by hand
        </h1>
        <p className="text-body-lg text-fg-secondary">
          Aozora started as a shared spreadsheet between two illustrators, and it exists because
          that spreadsheet lost work. Not files — commissions. About one in ten briefs ended in
          a message nobody answered.
        </p>
      </div>

      <Separator />

      <div className="grid gap-4">
        <h2 className="text-heading-md font-semibold text-fg">How it began</h2>
        <p className="text-body-md text-fg-secondary">
          In 2021 Mei was drawing chibi commissions in the evenings and Rangga was inking short
          comics. They took briefs in four places at once: two social inboxes, an email address
          and, occasionally, a message written on a phone screen and photographed. The
          spreadsheet was the attempt to put those four in one column, and it worked exactly as
          well as a spreadsheet does.
        </p>
        <p className="text-body-md text-fg-secondary">
          What it could not do was tell an artist what was owed and by whom. That is the
          question every artist we have spoken to since asks first, and it is the question the
          first version of Aozora answered before it could do anything else.
        </p>

        <h3 className="text-heading-sm font-semibold text-fg">What we kept from that year</h3>
        <ul className="grid gap-2">
          {PRINCIPLES.map((principle) => (
            <li key={principle.title} className="text-body-md text-fg-secondary">
              <span className="font-medium text-fg">{principle.title}.</span> {principle.body}
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      <div className="grid gap-4">
        <h2 className="text-heading-md font-semibold text-fg">Four years, four changes</h2>
        <p className="text-body-md text-fg-secondary">
          The list below is deliberately short. Most of what happened in between was
          maintenance, and a company history that reads like a changelog is a company history
          nobody finishes.
        </p>

        {/* Chronological, and a sequence rather than a comparison — the shape a
            Timeline is for. It is a table until that component exists. */}
        <Table>
          <TableBody>
            {MILESTONES.map((milestone) => (
              <TableRow key={milestone.at}>
                <TableCell className="align-top whitespace-nowrap tabular-nums">
                  <time dateTime={milestone.at}>{milestone.when}</time>
                </TableCell>
                <TableCell className="align-top">
                  <span className="block font-medium text-fg">{milestone.what}</span>
                  <span className="block text-body-sm text-fg-secondary">
                    {milestone.detail}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Card variant="brand" padding="lg" glint={['top-start', 'bottom-end']}>
        <CardTitle as="h2" className="text-heading-lg">
          The part we will not change
        </CardTitle>
        <CardBody>
          An artist who leaves takes everything with them: full-resolution files, a documented
          manifest, and no account required to open either. We would rather be left easily than
          kept by friction.
        </CardBody>
      </Card>
    </div>
  );
}
