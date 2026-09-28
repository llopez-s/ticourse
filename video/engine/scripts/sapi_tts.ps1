# Speaks the text in -TextFile (UTF-8) with a Windows SAPI voice into a WAV file. Used by tts-adversary.mjs.
param(
  [Parameter(Mandatory = $true)][string]$Voice,
  [int]$Rate = 0,
  [Parameter(Mandatory = $true)][string]$TextFile,
  [Parameter(Mandatory = $true)][string]$Out
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$installed = @($s.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name })
if ($installed -notcontains $Voice) {
  [Console]::Error.WriteLine("voice not installed: $Voice (installed: $($installed -join ', ')) - if $Voice is a OneCore voice pack, run this script with PowerShell 7 (pwsh), not Windows PowerShell 5.1: its System.Speech only enumerates classic voices")
  exit 3
}
$s.SelectVoice($Voice)
$s.Rate = $Rate
$s.SetOutputToWaveFile($Out)
$s.Speak([IO.File]::ReadAllText($TextFile, [Text.Encoding]::UTF8))
$s.Dispose()
