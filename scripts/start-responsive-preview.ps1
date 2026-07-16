$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$previewUrl = "http://localhost:3000/responsive-preview"
$homeUrl = "http://localhost:3000/"

function Test-ResponsivePreview {
  try {
    $response = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 4
    return $response.StatusCode -eq 200 -and $response.Content -match "Responsive Preview Wall"
  } catch {
    return $false
  }
}

if (Test-ResponsivePreview) {
  Write-Host "Responsive Preview Wall is already running at $previewUrl"
  exit 0
}

$listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  $isLuminix = $false
  try {
    $homeResponse = Invoke-WebRequest -Uri $homeUrl -UseBasicParsing -TimeoutSec 4
    $isLuminix = $homeResponse.Content -match "Luminix"
  } catch {
    $isLuminix = $false
  }

  if (-not $isLuminix) {
    throw "Port 3000 is occupied by another application. It was not stopped."
  }

  Stop-Process -Id $listener.OwningProcess -Force
  Start-Sleep -Milliseconds 700
}

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$nodeCandidates = @(
  if ($nodeCommand) { $nodeCommand.Source }
  "C:\Users\Kevin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
)
$nodePath = $nodeCandidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1

if (-not $nodePath) {
  throw "Node.js was not found. Install Node.js 22 or run this tool from Codex."
}

$runner = Join-Path $PSScriptRoot "run-responsive-preview.cmd"
$taskName = "LuminixResponsivePreview"
$taskArguments = '/d /s /c ""' + $runner + '" "' + $nodePath + '""'
$taskAction = New-ScheduledTaskAction -Execute $env:ComSpec -Argument $taskArguments -WorkingDirectory $projectRoot
$taskTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddYears(10)
$taskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit ([TimeSpan]::Zero)

Stop-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
Register-ScheduledTask -TaskName $taskName -Action $taskAction -Trigger $taskTrigger -Settings $taskSettings -Description "Local Luminix responsive preview development server" -Force | Out-Null
Start-ScheduledTask -TaskName $taskName

$deadline = (Get-Date).AddSeconds(35)
do {
  Start-Sleep -Milliseconds 500
  if (Test-ResponsivePreview) {
    Write-Host "Responsive Preview Wall is ready at $previewUrl"
    Write-Host "Windows task: $taskName"
    exit 0
  }
} while ((Get-Date) -lt $deadline)

$logPath = Join-Path $projectRoot ".logs\responsive-preview.log"
$taskInfo = Get-ScheduledTaskInfo -TaskName $taskName -ErrorAction SilentlyContinue
throw "The development server did not start. Task result: $($taskInfo.LastTaskResult). Review $logPath"
