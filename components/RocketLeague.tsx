import { FC, useEffect, useState } from 'react';
import styles from './rocket-league.module.css';

interface ResponseData {
  minutes: number;
}

type State =
  | {
      status: 'loading';
    }
  | { status: 'loaded'; data: ResponseData }
  | { status: 'error'; error: any };

const numberFormatter = new Intl.NumberFormat('en-US', {
  style: 'unit',
  unit: 'hour',
  unitDisplay: 'long',
});

interface ContentProps {
  state: State;
}

const Content = ({ state }: ContentProps) => {
  if (state.status === 'loading') {
    return <div>...</div>;
  }

  if (state.status === 'error') {
    console.error(state.error);
    return <div>Something went wrong :(</div>;
  }

  if (state.status === 'loaded') {
    return (
      <div>
        <div className={styles.label}>Time played</div>
        <div>{numberFormatter.format(Math.floor(state.data.minutes / 60))}</div>
      </div>
    );
  }

  return null;
};

export default function RocketLeague() {
  const [state, setState] = useState<State>({
    status: 'loading',
  });
  useEffect(() => {
    fetch('/api/rocket-league')
      .then((res) => {
        res
          .json()
          .then((data) => setState({ status: 'loaded', data }))
          .catch((error) => {
            setState({ status: 'error', error });
          });
      })
      .catch((error) => {
        setState({ status: 'error', error });
      });
  }, []);

  return (
    <div className={styles.container}>
      <img className={styles.logo} src="/images/rocket-league.svg" />
      <Content state={state} />
    </div>
  );
}
