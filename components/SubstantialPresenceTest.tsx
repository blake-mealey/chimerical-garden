import { Fragment, useEffect, useReducer, useState } from 'react';

const NUM_YEARS_TO_INCLUDE = 10;
const CURRENT_YEAR = new Date().getFullYear();
const TOTAL_REQUIREMENT = 183;
const YEAR_REQUIREMENTS = [
  {
    yearOffset: 0,
    minimum: 31,
    multiplier: 1,
  },
  {
    yearOffset: -1,
    multiplier: 1 / 3,
  },
  {
    yearOffset: -2,
    multiplier: 1 / 6,
  },
];

function dateToValue(date: Date) {
  return date.toISOString().split('T')[0];
}

function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

type DayCounterRangeProps = {
  year: number;
  onChange?: (range: DayCounterRange) => void;
};

const DayCounterRange = function ({ year, onChange }: DayCounterRangeProps) {
  const min = `${year}-01-01`;
  const max = year !== CURRENT_YEAR ? `${year}-12-31` : dateToValue(new Date());

  const [start, setStart] = useState(new Date(min));
  const [end, setEnd] = useState(new Date(max));

  function computeChange() {
    if (onChange) {
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      onChange({ count: daysDiff, start, end }); // TODO: Should we include the last day?
    }
  }

  useEffect(() => {
    computeChange();
  }, [start, end]);

  function handleChange(setter: (date: Date) => void, value: Date) {
    setter(value);
  }

  return (
    <span>
      <label>
        from{' '}
        <input
          type="date"
          min={min}
          max={dateToValue(addDays(end, -1))}
          value={dateToValue(start)}
          onChange={(e) =>
            handleChange(setStart, new Date(e.target.valueAsDate!))
          }
        />
      </label>{' '}
      <label>
        till{' '}
        <input
          type="date"
          min={dateToValue(addDays(start, 1))}
          max={max}
          value={dateToValue(end)}
          onChange={(e) =>
            handleChange(setEnd, new Date(e.target.valueAsDate!))
          }
        />
      </label>
    </span>
  );
};

type DayCounterRange = {
  count: number;
  start: Date | null;
  end: Date | null;
};

type DayCounterState = {
  present: boolean;
  ranges: DayCounterRange[];
  count: number;
};

type DayCounterAction =
  | { type: 'togglePresent' }
  | { type: 'addRange' }
  | { type: 'removeRange'; range: DayCounterRange }
  | { type: 'updateRange'; range: DayCounterRange; updates: DayCounterRange };

function dayCounterReducer(
  state: DayCounterState,
  action: DayCounterAction
): DayCounterState {
  function primaryReducer() {
    if (action.type === 'togglePresent') {
      return { ...state, present: !state.present };
    } else if (action.type === 'addRange') {
      return {
        ...state,
        ranges: [...state.ranges, { count: 0, start: null, end: null }],
      };
    } else if (action.type === 'removeRange') {
      return {
        ...state,
        ranges: state.ranges.filter((x) => x !== action.range),
      };
    } else if (action.type === 'updateRange') {
      return {
        ...state,
        ranges: state.ranges.map((x) =>
          x !== action.range ? x : { ...x, ...action.updates }
        ),
      };
    }
    throw new Error();
  }

  const nextState = primaryReducer();
  return {
    ...nextState,
    count: !nextState.present
      ? 0
      : nextState.ranges.reduce((count, range) => count + range.count, 0),
  };
}

type DayCounterProps = {
  year: number;
  onChange?: (count: number) => void;
};

const DayCounter = function ({ year, onChange }: DayCounterProps) {
  const [state, dispatch] = useReducer(dayCounterReducer, {
    present: false,
    ranges: [{ count: 0, start: null, end: null }],
    count: 0,
  });

  useEffect(() => {
    if (onChange) {
      onChange(state.count);
    }
  }, [state.count]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 'var(--theme-spacing-1)',
      }}
    >
      <label>
        I was present{' '}
        <input
          type="checkbox"
          checked={state.present}
          onChange={() => dispatch({ type: 'togglePresent' })}
        />
      </label>

      {state.present ? (
        <>
          {state.ranges.map((range, i) => (
            <div key={i}>
              <span>
                {i !== 0 ? <span>and </span> : null}
                <DayCounterRange
                  year={year}
                  onChange={(updates) =>
                    dispatch({ type: 'updateRange', range, updates })
                  }
                />
              </span>{' '}
              <button
                disabled={state.ranges.length === 1}
                onClick={() => dispatch({ type: 'removeRange', range })}
                style={{
                  borderRadius: '28px',
                  width: '28px',
                  height: '28px',
                  transition: 'ease-in-out 0.2s',
                }}
              >
                x
              </button>
            </div>
          ))}
          <button
            onClick={() => dispatch({ type: 'addRange' })}
            style={{ borderRadius: '28px' }}
          >
            + add range
          </button>
        </>
      ) : null}
    </div>
  );
};

const SubstantialPresenceTest = function () {
  function getDefaultDayCounts(year: number) {
    const dayCounts: Record<number, number> = {};
    YEAR_REQUIREMENTS.forEach((req) => (dayCounts[year + req.yearOffset] = 0));
    return dayCounts;
  }

  const [year, setYear] = useState(CURRENT_YEAR);
  const [dayCounts, setDayCounts] = useState<Record<number, number>>(
    getDefaultDayCounts(CURRENT_YEAR)
  );

  const total = YEAR_REQUIREMENTS.reduce(
    (sum, req) =>
      sum + Math.floor(dayCounts[year + req.yearOffset] * req.multiplier),
    0
  );

  const currentDate = new Date();
  const passingDate = new Date(
    currentDate.setDate(currentDate.getDate() + (TOTAL_REQUIREMENT - total))
  );

  return (
    <section
      style={{
        padding: 'var(--theme-spacing-2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 'var(--theme-roundness)',
      }}
    >
      <h3 style={{ marginTop: '0' }}>Substantial Presence Test Calculator</h3>

      <label>
        Which year would you like to test for?{' '}
        <select
          value={year}
          onChange={(e) => {
            setYear(+e.target.value);
            setDayCounts(getDefaultDayCounts(+e.target.value));
          }}
        >
          {new Array(NUM_YEARS_TO_INCLUDE).fill(0).map((_, i) => (
            <option key={i} value={CURRENT_YEAR - i}>
              {CURRENT_YEAR - i}
            </option>
          ))}
        </select>
      </label>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'min-content auto auto',
          gap: 'var(--theme-spacing-3)',
          marginTop: 'var(--theme-spacing-2)',
        }}
      >
        {YEAR_REQUIREMENTS.map((req) => (
          <Fragment key={year + req.yearOffset}>
            <span style={{ opacity: 0.8 }}>{year + req.yearOffset}</span>
            <DayCounter
              year={year + req.yearOffset}
              onChange={(count) => {
                setDayCounts({
                  ...dayCounts,
                  [year + req.yearOffset]: Math.floor(count),
                });
              }}
            />
            <span>
              {dayCounts[year + req.yearOffset]} x 1/{1 / req.multiplier} ={' '}
              {Math.floor(dayCounts[year + req.yearOffset] * req.multiplier)}
            </span>
          </Fragment>
        ))}

        <span style={{ gridColumnStart: '2' }}>Total eligible days:</span>
        <span>
          {total} / {TOTAL_REQUIREMENT}
        </span>

        <span style={{ gridColumnStart: '2' }}>
          {total < TOTAL_REQUIREMENT
            ? `If you remain in the country, you will pass the Substantial Presence Test on ${dateToValue(
                passingDate
              )}`
            : `You have passed the Substantial Presence Test for ${year}! 🎉`}
        </span>
      </div>
    </section>
  );
};

export default SubstantialPresenceTest;
