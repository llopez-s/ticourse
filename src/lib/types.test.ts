import { describe, expect, it } from 'vitest';
import type { Domain, TrackId } from './types';

describe('types', () => {
  it('accepts both tracks and the Security+ domains', () => {
    const tracks: TrackId[] = ['gcti', 'secplus'];
    const d: Domain = 'General Security Concepts';
    expect(tracks).toHaveLength(2);
    expect(d).toBe('General Security Concepts');
  });
});
