param(
  [string]$SourceVideo = "..\\agensi\\demo\\assets\\china-source-intelligence-demo.mp4",
  [string]$OutputVideo = "assets\\evidence-lens-build-week-demo.mp4"
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$source = [IO.Path]::GetFullPath((Join-Path $root $SourceVideo))
$output = Join-Path $root $OutputVideo
$audio = Join-Path $root 'assets\\evidence-lens-build-week-narration.wav'
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $output) | Out-Null

$narration = @'
Evidence Lens is a small developer tool for the hard first minutes of China market research. Instead of producing an unsupported English summary, it creates Mandarin search queries, primary source targets, translation cautions, and a verification sequence. The live API exposes a tiny x402 payment challenge, so an agent can inspect the exact contract before any payment. It also returns a bounded rare earth export controls evidence bundle with source links and explicit caveats. I used Codex and GPT-5 point 6 to design the payment aware Express service, the deterministic query plan, its tests, the OpenAPI contract, and this interactive landing page. The project is public, locally runnable, and deliberately shows what is supported, what is uncertain, and what still needs corroboration.
'@

Add-Type -AssemblyName System.Speech
$speaker = [System.Speech.Synthesis.SpeechSynthesizer]::new()
$speaker.Rate = -1
$speaker.SetOutputToWaveFile($audio)
$speaker.Speak($narration)
$speaker.Dispose()

& ffmpeg -y -i $source -i $audio -filter_complex "[0:v]tpad=stop_mode=clone:stop_duration=40[v]" -map "[v]" -map 1:a -c:v libx264 -preset medium -crf 19 -c:a aac -b:a 160k -shortest -movflags +faststart $output
if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed with exit code $LASTEXITCODE" }
