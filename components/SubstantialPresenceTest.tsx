import { useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { FC } from 'react';
import { addDays, differenceInDays } from 'date-fns';

const CURRENT_YEAR = new Date().getFullYear();
const TOTAL_REQUIREMENT = 183;
const CURRENT_YEAR_REQUIREMENT = 31;
const YEAR_MULTIPLIERS = [1, 1 / 3, 1 / 6];
const NUM_YEARS_TO_INCLUDE = YEAR_MULTIPLIERS.length * 4;

interface Range {
  start: number;
  end: number;
}

interface YearDetails {
  present: boolean;
  ranges: Range[];
}

const yearAtom = atomWithStorage(
  'substantialPresenceTest:selectedYear',
  CURRENT_YEAR
);
const yearsDetailsAtom = atomWithStorage<Record<number, YearDetails>>(
  'substantialPresenceTest:yearsDetails',
  {}
);

function getAllValidDays(
  year: number,
  yearsDetails: Record<number, YearDetails>
) {
  return YEAR_MULTIPLIERS.map((multiplier, i) => {
    const offsetYear = year - i;
    return getValidDays(multiplier, yearsDetails[offsetYear]);
  }).reduce(
    (acc, curr) => ({
      totalDays: acc.totalDays + curr.validDays,
      validDays: acc.validDays + curr.validDays,
      lastDay: Math.max(curr.lastDay ?? 0, acc.lastDay ?? 0),
    }),
    { totalDays: 0, validDays: 0, lastDay: 0 }
  );
}

function getValidDays(multiplier: number, details?: YearDetails) {
  const totalDays = details?.present
    ? details.ranges.reduce(
        (total, range) => total + differenceInDays(range.end, range.start) + 1,
        0
      )
    : 0;
  const validDays = Math.floor(totalDays * multiplier);
  return { totalDays, validDays, lastDay: details?.ranges.at(-1)?.end };
}

const SubstantialPresenceTest = () => {
  const year = useAtomValue(yearAtom);
  const yearsDetails = useAtomValue(yearsDetailsAtom);

  const { validDays, lastDay } = getAllValidDays(year, yearsDetails);
  const { validDays: currentYearValidDays } = getValidDays(
    YEAR_MULTIPLIERS[0],
    yearsDetails[year]
  );

  const dayOfPassing =
    validDays >= TOTAL_REQUIREMENT
      ? currentYearValidDays > CURRENT_YEAR_REQUIREMENT
        ? new Date(lastDay!)
        : addDays(lastDay!, CURRENT_YEAR_REQUIREMENT - currentYearValidDays)
      : addDays(lastDay!, TOTAL_REQUIREMENT - validDays);

  return (
    <section
      style={{
        padding: 'var(--theme-spacing-2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 'var(--theme-roundness)',
      }}
    >
      <h3 style={{ marginTop: '0' }}>Substantial Presence Test Calculator</h3>
      <YearPicker />

      <table
        style={{
          width: '100%',
          borderSpacing: '5px',
          margin: '20px 0',
          padding: '5px',
        }}
      >
        <tbody>
          <YearCounterRows />

          <tr>
            <td></td>
            <td>Total eligible days for the current year</td>
            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
              {currentYearValidDays} / {CURRENT_YEAR_REQUIREMENT}
            </td>
          </tr>

          <tr>
            <td></td>
            <td>Total eligible days</td>
            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
              {validDays} / {TOTAL_REQUIREMENT}
            </td>
          </tr>
        </tbody>
      </table>

      <div>
        {validDays >= TOTAL_REQUIREMENT &&
        currentYearValidDays >= CURRENT_YEAR_REQUIREMENT ? (
          <>
            You have passed the Substantial Presence Test for{' '}
            <span style={{ fontWeight: 'bold' }}>{year}</span>!
          </>
        ) : dayOfPassing.getFullYear() === year ? (
          <>
            If you remain in the country, you will pass the Substantial Presence
            Test on{' '}
            <time
              style={{ fontWeight: 'bold' }}
              dateTime={dayOfPassing.toISOString()}
            >
              {dayOfPassing.toLocaleDateString()}
            </time>
            .
          </>
        ) : (
          <>
            You cannot pass the Substantial Presence Test in{' '}
            <span style={{ fontWeight: 'bold' }}>{year}</span>.
          </>
        )}
      </div>
    </section>
  );
};

const YearPicker = () => {
  const [year, setYear] = useAtom(yearAtom);

  return (
    <label>
      Which year would you like to test for?{' '}
      <select value={year} onChange={(e) => setYear(+e.currentTarget.value)}>
        {new Array(NUM_YEARS_TO_INCLUDE).fill(0).map((_, i) => {
          const year = CURRENT_YEAR - i;
          return (
            <option key={year} value={year}>
              {year}
            </option>
          );
        })}
      </select>
    </label>
  );
};

const YearCounterRows = () => {
  return (
    <>
      {YEAR_MULTIPLIERS.map((multiplier, i) => {
        return <YearCounter key={i} yearOffset={i} multiplier={multiplier} />;
      })}
    </>
  );
};

function startOfYear(year: number) {
  return new Date(`${year}-01-01`).getTime();
}

function endOfYear(year: number) {
  return new Date(`${year}-12-31`).getTime();
}

function functionalEndOfYear(year: number) {
  return Math.min(Date.now(), endOfYear(year));
}

interface YearCounterProps {
  yearOffset: number;
  multiplier: number;
}

const YearCounter: FC<YearCounterProps> = ({ yearOffset, multiplier }) => {
  const year = useAtomValue(yearAtom) - yearOffset;

  const [yearsDetails, setYearsDetails] = useAtom(yearsDetailsAtom);
  const details = yearsDetails[year] ?? {
    present: false,
    ranges: [
      {
        start: startOfYear(year),
        end: functionalEndOfYear(year),
      },
    ],
  };

  const { totalDays, validDays } = getValidDays(multiplier, details);

  return (
    <>
      <tr>
        <td style={{ width: '75px' }}>{year}</td>
        <td>
          <label>
            I was present{' '}
            <input
              type="checkbox"
              checked={details.present}
              onChange={(e) =>
                setYearsDetails({
                  ...yearsDetails,
                  [year]: { ...details, present: e.currentTarget.checked },
                })
              }
            />
          </label>
        </td>
        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          {totalDays} × 1/{1 / multiplier} = {validDays}
        </td>
      </tr>

      {details.present && (
        <YearCounterRanges
          year={year}
          yearDetails={details}
          addRange={() => {
            const previousRange = details.ranges.at(-1)!;
            setYearsDetails({
              ...yearsDetails,
              [year]: {
                ...details,
                ranges: [
                  ...details.ranges,
                  {
                    start: addDays(previousRange.end, 1).getTime(),
                    end: functionalEndOfYear(year),
                  },
                ],
              },
            });
          }}
          removeRange={(i) => {
            setYearsDetails({
              ...yearsDetails,
              [year]: {
                ...details,
                ranges: details.ranges.filter((_, j) => i !== j),
              },
            });
          }}
          setRange={(i, range) => {
            setYearsDetails({
              ...yearsDetails,
              [year]: {
                ...details,
                ranges: details.ranges.map((r, j) => (i === j ? range : r)),
              },
            });
          }}
        />
      )}

      <tr style={{ height: '10px' }}></tr>
    </>
  );
};

interface YearCounterRangesProps {
  year: number;
  yearDetails: YearDetails;
  addRange: () => void;
  removeRange: (i: number) => void;
  setRange: (i: number, range: Range) => void;
}

const YearCounterRanges: FC<YearCounterRangesProps> = ({
  year,
  yearDetails,
  addRange,
  removeRange,
  setRange,
}) => {
  return (
    <>
      {yearDetails.ranges.map((range, i) => {
        return (
          <YearCounterRange
            key={i}
            year={year}
            first={i === 0}
            lastRemaining={yearDetails.ranges.length === 1}
            previousRange={yearDetails.ranges[i - 1]}
            range={range}
            removeRange={() => removeRange(i)}
            setStart={(start) => setRange(i, { ...range, start })}
            setEnd={(end) => setRange(i, { ...range, end })}
          />
        );
      })}
      <tr>
        <td></td>
        <td>
          <button
            onClick={addRange}
            disabled={
              dateString(yearDetails.ranges.at(-1)!.end) ===
              dateString(functionalEndOfYear(year))
            }
            style={{ borderRadius: '100px' }}
          >
            + add range
          </button>
        </td>
      </tr>
    </>
  );
};

function dateString(datetime: number | Date) {
  return new Date(datetime).toISOString().split('T')[0];
}

interface YearCounterRangeProps {
  year: number;
  first?: boolean;
  lastRemaining: boolean;
  previousRange?: YearDetails['ranges'][number];
  range: YearDetails['ranges'][number];
  removeRange: () => void;
  setStart: (start: number) => void;
  setEnd: (end: number) => void;
}

const YearCounterRange: FC<YearCounterRangeProps> = ({
  year,
  first = false,
  lastRemaining,
  previousRange,
  range,
  removeRange,
  setStart,
  setEnd,
}) => {
  return (
    <tr>
      <td></td>
      <td>
        {!first && 'and '}from{' '}
        <input
          type="date"
          value={dateString(range.start)}
          onChange={(e) => setStart(new Date(e.currentTarget.value).getTime())}
          min={dateString(
            previousRange
              ? addDays(previousRange.end, 1).getTime()
              : startOfYear(year)
          )}
          max={dateString(range.end)}
        />{' '}
        till{' '}
        <input
          type="date"
          value={dateString(range.end)}
          onChange={(e) => setEnd(new Date(e.currentTarget.value).getTime())}
          min={dateString(range.start)}
          max={dateString(functionalEndOfYear(year))}
        />{' '}
        <button
          disabled={lastRemaining}
          onClick={removeRange}
          style={{
            borderRadius: '100px',
            height: '28px',
            width: '28px',
          }}
        >
          x
        </button>
      </td>
    </tr>
  );
};

export default SubstantialPresenceTest;
