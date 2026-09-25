// Structural check of a Timeline object against src/timeline/types.ts.
// Keys must match exactly (no missing, no extra) and every frame is an integer.

const SHAPES = {
  Timeline: ['mode', 'sourceHash', 'fps', 'width', 'height', 'durationInFrames', 'voice', 'scenes', 'segments', 'captions', 'cues', 'exam', 'think'],
  SceneTiming: ['id', 'chapter', 'chapterTitle', 'title', 'from', 'durationInFrames'],
  TimedSegment: ['id', 'scene', 'text', 'from', 'audioFrames', 'durationInFrames', 'audio', 'words'],
  TimedWord: ['text', 'from', 'to'],
  CaptionPage: ['from', 'to', 'lines'],
  CuePoint: ['scene', 'id', 'frame'],
  ExamCue: ['scene', 'from', 'durationInFrames', 'objective', 'text'],
  ThinkPrompt: ['scene', 'from', 'durationInFrames', 'q'],
};

/**
 * @param {object} t timeline
 * @param {{sceneIds?: string[], maxChapters?: number}} [opts] allowed scene ids (the storyboard's; any id
 *   when omitted) and the chapter ceiling of the video's profile (default 5)
 * @returns {string[]} errors (empty when valid)
 */
export function validateTimeline(t, opts = {}) {
  const sceneIds = opts.sceneIds ? new Set(opts.sceneIds) : null;
  const maxChapters = opts.maxChapters ?? 5;
  const errors = [];
  const keys = (obj, shape, where) => {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      errors.push(`${where}: expected an object`);
      return false;
    }
    const want = SHAPES[shape];
    const have = Object.keys(obj);
    const missing = want.filter((k) => !have.includes(k));
    const extra = have.filter((k) => !want.includes(k));
    if (missing.length) errors.push(`${where}: missing ${missing.join(', ')}`);
    if (extra.length) errors.push(`${where}: unexpected ${extra.join(', ')}`);
    return !missing.length;
  };
  const int = (v, where, min = 0) => {
    if (!Number.isInteger(v) || v < min) errors.push(`${where}: expected an integer >= ${min}, got ${JSON.stringify(v)}`);
  };
  const str = (v, where, nonEmpty = true) => {
    if (typeof v !== 'string' || (nonEmpty && !v)) errors.push(`${where}: expected a${nonEmpty ? ' non-empty' : ''} string`);
  };
  const word = (w, where) => {
    if (!keys(w, 'TimedWord', where)) return;
    str(w.text, `${where}.text`);
    int(w.from, `${where}.from`);
    int(w.to, `${where}.to`);
    if (w.to <= w.from) errors.push(`${where}: to (${w.to}) must be > from (${w.from})`);
  };

  if (!keys(t, 'Timeline', 'timeline')) return errors;
  if (t.mode !== 'audio' && t.mode !== 'estimate') errors.push(`timeline.mode: must be "audio" or "estimate"`);
  str(t.sourceHash, 'timeline.sourceHash');
  int(t.fps, 'timeline.fps', 1);
  int(t.width, 'timeline.width', 1);
  int(t.height, 'timeline.height', 1);
  int(t.durationInFrames, 'timeline.durationInFrames', 1);
  str(t.voice, 'timeline.voice');
  for (const k of ['scenes', 'segments', 'captions', 'cues', 'exam', 'think']) {
    if (!Array.isArray(t[k])) errors.push(`timeline.${k}: expected an array`);
  }
  if (errors.length) return errors;

  const total = t.durationInFrames;
  let prevEnd = 0;
  t.scenes.forEach((s, k) => {
    const where = `scenes[${k}]`;
    if (!keys(s, 'SceneTiming', where)) return;
    if (typeof s.id !== 'string' || (sceneIds && !sceneIds.has(s.id))) errors.push(`${where}.id: unknown scene ${JSON.stringify(s.id)}`);
    if (!Number.isInteger(s.chapter) || s.chapter < 1 || s.chapter > maxChapters) errors.push(`${where}.chapter: must be 1..${maxChapters}`);
    str(s.chapterTitle, `${where}.chapterTitle`);
    str(s.title, `${where}.title`);
    int(s.from, `${where}.from`);
    int(s.durationInFrames, `${where}.durationInFrames`, 1);
    if (s.from !== prevEnd) errors.push(`${where}: starts at ${s.from}, previous scene ends at ${prevEnd}`);
    prevEnd = s.from + s.durationInFrames;
  });
  if (prevEnd !== total) errors.push(`scenes end at ${prevEnd} but durationInFrames is ${total}`);
  const sceneOf = new Map(t.scenes.map((s) => [s.id, s]));

  let prevSegEnd = 0;
  t.segments.forEach((seg, k) => {
    const where = `segments[${k}] ${seg?.id ?? ''}`;
    if (!keys(seg, 'TimedSegment', where)) return;
    str(seg.id, `${where}.id`);
    if (!sceneOf.has(seg.scene)) errors.push(`${where}.scene: not in scenes`);
    str(seg.text, `${where}.text`);
    int(seg.from, `${where}.from`);
    int(seg.audioFrames, `${where}.audioFrames`, 1);
    int(seg.durationInFrames, `${where}.durationInFrames`, 1);
    if (seg.durationInFrames < seg.audioFrames) errors.push(`${where}: durationInFrames < audioFrames`);
    if (seg.audio !== null && (typeof seg.audio !== 'string' || !/^voice\/[\w-]+\.mp3$/.test(seg.audio))) errors.push(`${where}.audio: expected null or "voice/<id>.mp3"`);
    if (t.mode === 'audio' && seg.audio === null) errors.push(`${where}.audio: null in audio mode`);
    if (t.mode === 'estimate' && seg.audio !== null) errors.push(`${where}.audio: must be null in estimate mode`);
    if (seg.from < prevSegEnd) errors.push(`${where}: overlaps the previous segment`);
    prevSegEnd = seg.from + seg.durationInFrames;
    const sc = sceneOf.get(seg.scene);
    if (sc && (seg.from < sc.from || prevSegEnd > sc.from + sc.durationInFrames)) errors.push(`${where}: outside its scene`);
    if (!Array.isArray(seg.words) || !seg.words.length) errors.push(`${where}.words: expected a non-empty array`);
    else {
      let prevFrom = -1;
      seg.words.forEach((w, q) => {
        word(w, `${where}.words[${q}]`);
        if (w.from < prevFrom) errors.push(`${where}.words[${q}]: starts before the previous word`);
        prevFrom = w.from;
        if (w.from < seg.from || w.from > seg.from + seg.durationInFrames) errors.push(`${where}.words[${q}]: outside its segment`);
      });
      if (seg.words.map((w) => w.text).join(' ') !== seg.text) errors.push(`${where}: words do not spell the segment text`);
    }
  });

  let prevPageTo = 0;
  t.captions.forEach((page, k) => {
    const where = `captions[${k}]`;
    if (!keys(page, 'CaptionPage', where)) return;
    int(page.from, `${where}.from`);
    int(page.to, `${where}.to`);
    if (page.to <= page.from) errors.push(`${where}: to must be > from`);
    if (page.from < prevPageTo) errors.push(`${where}: overlaps the previous page`);
    if (page.to > total) errors.push(`${where}: ends after the video`);
    prevPageTo = page.to;
    if (!Array.isArray(page.lines) || page.lines.length < 1 || page.lines.length > 2) errors.push(`${where}.lines: expected 1 or 2 lines`);
    else page.lines.forEach((line, q) => (Array.isArray(line) && line.length ? line.forEach((w, r) => word(w, `${where}.lines[${q}][${r}]`)) : errors.push(`${where}.lines[${q}]: empty line`)));
  });

  t.cues.forEach((c, k) => {
    const where = `cues[${k}]`;
    if (!keys(c, 'CuePoint', where)) return;
    if (!sceneOf.has(c.scene)) errors.push(`${where}.scene: not in scenes`);
    str(c.id, `${where}.id`);
    int(c.frame, `${where}.frame`);
    const sc = sceneOf.get(c.scene);
    if (sc && (c.frame < sc.from || c.frame >= sc.from + sc.durationInFrames)) errors.push(`${where} ${c.id}: frame ${c.frame} outside its scene`);
  });
  const ids = t.cues.map((c) => `${c.scene}/${c.id}`);
  if (new Set(ids).size !== ids.length) errors.push('cues: duplicate scene/id pair');

  t.exam.forEach((e, k) => {
    const where = `exam[${k}]`;
    if (!keys(e, 'ExamCue', where)) return;
    if (!sceneOf.has(e.scene)) errors.push(`${where}.scene: not in scenes`);
    int(e.from, `${where}.from`);
    int(e.durationInFrames, `${where}.durationInFrames`, 1);
    str(e.objective, `${where}.objective`);
    str(e.text, `${where}.text`);
  });
  t.think.forEach((p, k) => {
    const where = `think[${k}]`;
    if (!keys(p, 'ThinkPrompt', where)) return;
    if (!sceneOf.has(p.scene)) errors.push(`${where}.scene: not in scenes`);
    int(p.from, `${where}.from`);
    int(p.durationInFrames, `${where}.durationInFrames`, 1);
    str(p.q, `${where}.q`);
  });
  return errors;
}
