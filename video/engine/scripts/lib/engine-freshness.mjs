// Whether this checkout's importer is behind origin/main. A script branch is cut from main when the script is
// written and is merged with it only now and then, so by the time the narrator records, the engine it carries can
// lack fixes main already has (2026-10-23: V40–V42 were imported with a copy from before «keep the last take»
// and kept an earlier take of a paragraph in six places). Importing from a checkout that lacks them is allowed;
// it just must not be a surprise.
import { spawnSync } from 'node:child_process';

/** What holds the importer and the voice check. */
export const ENGINE_PATHS = ['video/engine/scripts'];

const lines = (text) => String(text ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

/** `git log --format="%h %s"` output as [{sha, subject}]. */
export function parseCommits(stdout) {
  return lines(stdout).map((l) => {
    const at = l.indexOf(' ');
    return at < 0 ? { sha: l, subject: '' } : { sha: l.slice(0, at), subject: l.slice(at + 1) };
  });
}

/**
 * The commits of `base` that touch `paths` and are not in HEAD, when the files they changed really differ from
 * `base` in the working tree (a checkout that copied the engine over, `git checkout origin/main -- video/engine`,
 * is not behind). null when git or `base` is not there: nothing to say.
 * @returns {{base: string, commits: {sha: string, subject: string}[], files: string[]} | null}
 */
export function engineBehind({ cwd = process.cwd(), base = 'origin/main', paths = ENGINE_PATHS, run = spawnSync } = {}) {
  const git = (args) => {
    const res = run('git', args, { cwd, encoding: 'utf8', windowsHide: true });
    return res && res.status === 0 ? String(res.stdout ?? '') : null;
  };
  if (git(['rev-parse', '--verify', '--quiet', `${base}^{commit}`]) === null) return null;
  const commits = parseCommits(git(['log', '--format=%h %s', `HEAD..${base}`, '--', ...paths]));
  if (!commits.length) return { base, commits: [], files: [] };
  const changed = [...new Set(lines(git(['log', '--name-only', '--format=', `HEAD..${base}`, '--', ...paths])))];
  const differ = git(['diff', '--name-only', base, '--', ...changed]);
  const files = differ === null ? changed : lines(differ);
  return { base, commits: files.length ? commits : [], files };
}

/** The console warning for an engineBehind result: [] when the checkout is up to date or the answer is unknown. */
export function behindWarning(info, { show = 3 } = {}) {
  if (!info || !info.commits.length) return [];
  const n = info.commits.length;
  const recent = info.commits.slice(0, show).map((c) => `    ${c.sha} ${c.subject}`);
  return [
    `  aviso: this checkout's video/engine/scripts is behind ${info.base}: ${n} commit${n === 1 ? '' : 's'} not in it, ${info.files.length} file${info.files.length === 1 ? '' : 's'} differ. The importer may lack fixes already made (a recording imported with an old one has kept earlier takes of a paragraph).`,
    ...recent,
    ...(n > show ? [`    … and ${n - show} more`] : []),
    `    Merge ${info.base} into this branch, or run the import from a checkout whose video/engine matches it (video/engine/README.md, «Voz: grabación propia»). Counted against the local ${info.base}: git fetch first.`,
  ];
}

/** Prints the warning, if any. Never throws: a missing git must not stop an import. */
export function warnIfEngineBehind(log = console, options = {}) {
  try {
    for (const line of behindWarning(engineBehind(options))) log.warn(line);
  } catch {
    // no git, no repository: nothing to compare
  }
}
