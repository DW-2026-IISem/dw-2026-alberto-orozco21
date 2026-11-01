import { fromDateTimeInput, toDateInput, toDateTimeInput, toNumberOrNull, toTimeInput } from './form-values';

describe('form-values', () => {
  it('normalizes decimal strings and nulls', () => {
    expect(toNumberOrNull('12.50')).toBe(12.5);
    expect(toNumberOrNull(7)).toBe(7);
    expect(toNumberOrNull(null)).toBeNull();
    expect(toNumberOrNull('')).toBeNull();
  });
  it('normalizes dates and times for native inputs', () => {
    expect(toDateInput('2026-10-31T00:00:00.000Z')).toBe('2026-10-31');
    expect(toDateInput(null)).toBe('');
    expect(toTimeInput('08:30:00')).toBe('08:30');
  });
  it('round-trips a date-time through the local input', () => {
    const iso = '2026-10-31T15:30:00.000Z';
    expect(fromDateTimeInput(toDateTimeInput(iso))).toBe(iso);
    expect(fromDateTimeInput('')).toBeNull();
  });
});
