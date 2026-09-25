import { mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { loadScript, repoRoot, scriptPath, writeDerivedAssets } from './audio-assets.mjs';

await loadScript();
const voiceDir = join(repoRoot, 'public/videos/edr/voice');
await mkdir(voiceDir, { recursive: true });

const synthesis = String.raw`
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$script = Get-Content -LiteralPath $env:EDR_SCRIPT_PATH -Raw -Encoding UTF8 | ConvertFrom-Json
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $speaker.SelectVoice('Microsoft Laura')
  $speaker.Rate = 2
  foreach ($segment in $script.segments) {
    $path = Join-Path $env:EDR_VOICE_DIR ($segment.id + '.wav')
    $speaker.SetOutputToWaveFile($path)
    try { $speaker.Speak([string]$segment.text) }
    finally { $speaker.SetOutputToNull() }
  }
}
finally { $speaker.Dispose() }
`;
const result = spawnSync('pwsh', [
  '-NoProfile', '-NonInteractive', '-Sta', '-EncodedCommand',
  Buffer.from(synthesis, 'utf16le').toString('base64'),
], {
  cwd: repoRoot,
  env: { ...process.env, EDR_SCRIPT_PATH: scriptPath, EDR_VOICE_DIR: voiceDir },
  encoding: 'utf8',
  maxBuffer: 1024 * 1024,
});
if (result.status !== 0) {
  throw new Error(`Microsoft Laura synthesis failed:\n${result.stderr || result.stdout}`);
}

await writeDerivedAssets({
  audioDir: voiceDir,
  publicAudioPrefix: 'videos/edr/voice',
  sourceLabel: 'Microsoft Laura (es-ES)',
});
