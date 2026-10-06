import { useEffect, useState } from 'react';
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
import { NotFound } from '../shared/NotFound';
import { ThemeMenu } from '../shared/ThemeMenu';
import { useHashRoute } from '../shared/useHashRoute';
import { Activity } from './Activity';
import { Cards, type CardSettings } from './Cards';
import {
  cards,
  contacts,
  formatMoney,
  OPENING_BALANCE,
  transactions,
  type Transaction,
} from './data';
import { FramePage } from './FramePage';
import { Home } from './Home';
import { Profile } from './Profile';
import { Send } from './Send';
import { TransactionDetail } from './TransactionDetail';
import { useShowsFrame } from './useFramed';

/** The five tabs. A tab stays current on the screens under it. */
const tabs = [
  { route: '', label: 'Home', icon: GridIcon },
  { route: 'activity', label: 'Activity', icon: FileIcon },
  { route: 'send', label: 'Send', icon: SendIcon },
  { route: 'cards', label: 'Cards', icon: CardIcon },
  { route: 'profile', label: 'Profile', icon: UserIcon },
] as const;

const isUnder = (route: string, tab: string) =>
  tab === '' ? route === '' : route === tab || route.startsWith(`${tab}/`);

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
  const [notice, setNotice] = useState<Notice | null>(null);

  // A notice reads in a few seconds and then gets out of the way; the close
  // button is there for anyone who is done sooner.
  useEffect(() => {
    if (notice === null) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const all = [...sent, ...transactions];
  const [screen, id] = route.split('/');
  const transaction = screen === 'activity' && id ? all.find((t) => t.id === id) : undefined;
  const contact = screen === 'send' && id ? contacts.find((c) => c.id === id) : undefined;
  const known =
    ['', 'activity', 'send', 'cards', 'profile'].includes(route) ||
    transaction !== undefined ||
    contact !== undefined;
  // A screen under a tab offers the way back to it, as a phone app does.
  const back = transaction ? 'activity' : contact ? 'send' : undefined;
  const say = (title: string, description: string) => setNotice({ title, description });

  if (showsFrame && known) return <FramePage route={route} />;

  return (
    <AppShell>
      <AppHeader width="full" actions={<ThemeMenu />}>
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
                onSent={(to, amount, note) => {
                  const made: Transaction = {
                    id: `tx-sent-${sent.length + 1}`,
                    title: to.name,
                    category: 'Transfer',
                    amount,
                    direction: 'out',
                    day: 'Today',
                    time: 'Just now',
                    method: 'Pouch balance',
                    status: 'Completed',
                    ...(note ? { note } : {}),
                  };
                  setSent((list) => [made, ...list]);
                  setBalance((value) => Math.round((value - amount) * 100) / 100);
                  say('Money sent', `${formatMoney(amount)} is with ${to.name} now.`);
                  navigate(`activity/${made.id}`);
                }}
              />
            ) : route === 'activity' ? (
              <Activity transactions={all} />
            ) : route === 'cards' ? (
              <Cards
                cards={cards}
                settings={settings}
                onChange={(card, next) => setSettings((all) => ({ ...all, [card]: next }))}
              />
            ) : route === 'profile' ? (
              <Profile onNotice={say} />
            ) : (
              <Home
                balance={balance}
                recent={all.slice(0, 4)}
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
