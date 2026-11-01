import { filterRows } from './filter-rows';

interface Row { name: string; note: string | null }
const ROWS: Row[] = [{ name: 'Alfa', note: 'Primera' }, { name: 'Beta', note: null }];
const pick = (row: Row) => [row.name, row.note];

describe('filterRows', () => {
  it('returns a copy when there is no term', () => {
    const result = filterRows(ROWS, '   ', pick);
    expect(result).toEqual(ROWS);
    expect(result).not.toBe(ROWS);
  });
  it('matches ignoring case', () => expect(filterRows(ROWS, 'ALFA', pick)).toEqual([ROWS[0]]));
  it('tolerates null values', () => expect(filterRows(ROWS, 'prim', pick)).toEqual([ROWS[0]]));
  it('returns no rows when nothing matches', () => expect(filterRows(ROWS, 'zzz', pick)).toEqual([]));
  it('trims the term', () => expect(filterRows(ROWS, ' beta ', pick)).toEqual([ROWS[1]]));
});
