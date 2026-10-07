import { useCallback, useEffect, useState } from 'react';
import {
  AppBody,
  AppHeader,
  AppMain,
  AppShell,
  BottomNav,
  BottomNavLink,
  CardIcon,
  CheckIcon,
  ChevronStartIcon,
  Container,
  FileIcon,
  GridIcon,
  IconButton,
  SendIcon,
  SparkleIcon,
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
  UserIcon,
  Wordmark,
} from '@kobars/kirua';
import { AllExamplesLink } from '../shared/AllExamplesLink';
import { NotFound } from '../shared/NotFound';
import { ThemeMenu } from '../shared/ThemeMenu';
import { useHashRoute } from '../shared/useHashRoute';
import { Activity } from './Activity';
import { Cards, type CardSettings } from './Cards';
import {
  cards,
  contacts,
  earlier,
  formatDay,
  formatMoney,
  goals as startingGoals,
  isoDay,
  OPENING_BALANCE,
  transactions,
  type Goal,
  type Transaction,
} from './data';
import { FramePage } from './FramePage';
import { GoalDetail } from './GoalDetail';
import { Help } from './Help';
import { Home } from './Home';
import { Profile } from './Profile';
import { Send } from './Send';
import { TransactionDetail } from './TransactionDetail';
import { insideFrame, useShowsFrame } from './useFramed';
import { Verify } from './Verify';

/** The five tabs. A tab stays current on the screens under it. */
const tabs = [
  { route: '', label: 'Home', icon: GridIcon },
  { route: 'activity', label: 'Activity', icon: FileIcon },
  { route: 'send', label: 'Send', icon: SendIcon },
  { route: 'cards', label: 'Cards', icon: CardIcon },
  { route: 'profile', label: 'Profile', icon: UserIcon },
] as const;

/** Home has no list of goals of its own, so a goal's screen sits under it. */
const isUnder = (route: string, tab: string) =>
  tab === ''
    ? route === '' || route.startsWith('goals/')
    : route === tab || route.startsWith(`${tab}/`);

/** The screens under Profile, by the last part of their route. */
const PROFILE_SCREENS = ['verify', 'help'];

interface Notice {
  title: string;
  description: string;
}

/**
 * Pouch, a money app made only for phones. There is no wide layout to fall
 * back to: on a window as wide as a tablet the section shows the app inside a
 * `DeviceFrame` instead, at a phone's width.
 */
export function App() {
  const [route, navigate] = useHashRoute('mobile', '');
  const showsFrame = useShowsFrame();
  const [balance, setBalance] = useState(OPENING_BALANCE);
  const [sent, setSent] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Record<string, CardSettings>>({});
  const [goals, setGoals] = useState<Goal[]>(startingGoals);
  const [verified, setVerified] = useState(false);
  const [olderLoaded, setOlderLoaded] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const loadOlder = useCallback(() => setOlderLoaded(true), []);

  // A notice reads in a few seconds and then gets out of the way; the close
  // button is there for anyone who is done sooner.
  useEffect(() => {
    if (notice === null) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const all = [...sent, ...transactions, ...(olderLoaded ? earlier : [])];
  const [screen, id] = route.split('/');
  // An older payment opened from a link is found even before the list loads it.
  const transaction =
    screen === 'activity' && id ? [...all, ...earlier].find((t) => t.id === id) : undefined;
  const contact = screen === 'send' && id ? contacts.find((c) => c.id === id) : undefined;
  const goal = screen === 'goals' && id ? goals.find((g) => g.id === id) : undefined;
  const profileScreen =
    screen === 'profile' && id && PROFILE_SCREENS.includes(id) ? id : undefined;
  const known =
    ['', 'activity', 'send', 'cards', 'profile'].includes(route) ||
    transaction !== undefined ||
    contact !== undefined ||
    goal !== undefined ||
    profileScreen !== undefined;
  // A screen under a tab offers the way back to it, as a phone app does.
  const back = transaction
    ? 'activity'
    : contact
      ? 'send'
      : goal
        ? ''
        : profileScreen
          ? 'profile'
          : undefined;
  const say = (title: string, description: string) => setNotice({ title, description });

  if (showsFrame && known) return <FramePage route={route} />;

  return (
    <AppShell>
      <AppHeader width="full" actions={<ThemeMenu />}>
        {/* On a phone the hub is one tap away, as in every section. Inside
            the frame it is not offered: the page around the frame has it, and
            following it here would open the hub inside the phone. */}
        {back === undefined && !insideFrame() && <AllExamplesLink />}
        {back !== undefined && (
          <IconButton asChild variant="ghost" aria-label="Back">
            <a href={`#/mobile/${back}`}>
              <ChevronStartIcon />
            </a>
          </IconButton>
        )}
        <Wordmark href="#/mobile/" icon={<SparkleIcon />}>
          Pouch
        </Wordmark>
      </AppHeader>

      <AppBody width="full">
        <AppMain data-route={`mobile/${route}`}>
          <Container width="full" pad="sm">
            {!known ? (
              <NotFound name="Pouch" home="#/mobile/" />
            ) : goal ? (
              <GoalDetail
                goal={goal}
                balance={balance}
                onAdd={(target, amount) => {
                  setGoals((list) =>
                    list.map((g) =>
                      g.id === target.id ? { ...g, saved: g.saved + amount } : g,
                    ),
                  );
                  setBalance((value) => Math.round((value - amount) * 100) / 100);
                  say('Money added', `${formatMoney(amount)} is in ${target.name} now.`);
                }}
              />
            ) : profileScreen === 'verify' ? (
              <Verify
                onDone={() => {
                  setVerified(true);
                  say('Identity verified', 'You can now send more than $1,000 at a time.');
                  navigate('profile');
                }}
              />
            ) : profileScreen === 'help' ? (
              <Help onNotice={say} />
            ) : transaction ? (
              <TransactionDetail
                key={transaction.id}
                transaction={transaction}
                onNotice={say}
              />
            ) : screen === 'send' ? (
              <Send
                key={route}
                balance={balance}
                to={contact}
                verified={verified}
                onSent={(to, amount, note, on) => {
                  const made: Transaction = {
                    id: `tx-sent-${sent.length + 1}`,
                    title: to.name,
                    category: 'Transfer',
                    amount,
                    direction: 'out',
                    day: on ? formatDay(on) : 'Today',
                    date: on ? isoDay(on) : '2026-10-07',
                    time: on ? 'Morning' : 'Just now',
                    method: 'Pouch balance',
                    status: on ? 'Scheduled' : 'Completed',
                    ...(note ? { note } : {}),
                  };
                  setSent((list) => [made, ...list]);
                  // A scheduled payment leaves the balance on its day, not now.
                  if (on) {
                    say(
                      'Payment scheduled',
                      `${formatMoney(amount)} goes to ${to.name} on ${formatDay(on)}.`,
                    );
                  } else {
                    setBalance((value) => Math.round((value - amount) * 100) / 100);
                    say('Money sent', `${formatMoney(amount)} is with ${to.name} now.`);
                  }
                  navigate(`activity/${made.id}`);
                }}
              />
            ) : route === 'activity' ? (
              <Activity transactions={all} more={!olderLoaded} onLoadMore={loadOlder} />
            ) : route === 'cards' ? (
              <Cards
                cards={cards}
                settings={settings}
                onChange={(card, next) => setSettings((all) => ({ ...all, [card]: next }))}
              />
            ) : route === 'profile' ? (
              <Profile verified={verified} onNotice={say} />
            ) : (
              <Home
                balance={balance}
                recent={all.filter((t) => t.status !== 'Scheduled').slice(0, 4)}
                goals={goals}
                onSend={() => navigate('send')}
                onNotice={say}
              />
            )}
          </Container>
        </AppMain>
      </AppBody>

      <ToastViewport>
        {notice !== null && (
          <Toast
            status="success"
            icon={<CheckIcon />}
            close={<ToastClose label="Close" onClick={() => setNotice(null)} />}
          >
            <ToastTitle>{notice.title}</ToastTitle>
            <ToastDescription>{notice.description}</ToastDescription>
          </Toast>
        )}
      </ToastViewport>

      <BottomNav aria-label="Main">
        {tabs.map(({ route: target, label, icon: Icon }) => (
          <BottomNavLink
            key={label}
            href={`#/mobile/${target}`}
            icon={<Icon />}
            current={isUnder(route, target)}
          >
            {label}
          </BottomNavLink>
        ))}
      </BottomNav>
    </AppShell>
  );
}
