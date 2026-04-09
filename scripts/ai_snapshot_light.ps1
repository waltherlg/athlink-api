param(
  [string]$OutFile = "",
  [switch]$Auto,
  [switch]$Quick
)

$ErrorActionPreference = "Stop"
$repoRoot = (Get-Location).Path

function SafeGit([string[]]$args) {
  try {
    return & git @args 2>$null
  } catch {
    return $null
  }
}

$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$status = SafeGit @("status","-sb")
$diffStat = SafeGit @("diff","--stat")
$nameOnly = SafeGit @("diff","--name-only")
$log = SafeGit @("log","-5","--oneline")

$lines = @()
$lines += "# AI Snapshot (light)"
$lines += "Timestamp: $now"
$lines += "Repo: $repoRoot"
$lines += ""
$lines += "## git status -sb"
$lines += ($status -join "`n")
$lines += ""
$lines += "## git diff --stat"
if ($diffStat) { $lines += ($diffStat -join "`n") } else { $lines += "(no diff)" }
$lines += ""
$lines += "## git diff --name-only"
if ($nameOnly) { $lines += ($nameOnly -join "`n") } else { $lines += "(no diff)" }
$lines += ""
$lines += "## git log -5 --oneline"
$lines += ($log -join "`n")

$content = $lines -join "`n"

if (($Auto -or $Quick) -and $OutFile -eq "") {
  $OutFile = "AI_CONTEXT.md"
}

if ($OutFile -ne "") {
  $resolved = Resolve-Path -Path $OutFile -ErrorAction SilentlyContinue
  if ($null -eq $resolved) {
    $resolved = Join-Path $repoRoot $OutFile
  } else {
    $resolved = $resolved.Path
  }
  $content | Set-Content -Path $resolved -Encoding UTF8
  Write-Output "Wrote snapshot to $resolved"
} else {
  Write-Output $content
}
