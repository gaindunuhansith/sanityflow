param(
    [string]$target = "http://localhost:3000",
    [int]$duration = 60,
    [int]$arrivalRate = 10
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$source = Join-Path $scriptDir 'basic-test.yml'
$tmp = Join-Path $scriptDir 'tmp-basic-test.yml'

(Get-Content $source -Raw) -replace 'TARGET_PLACEHOLDER', $target -replace 'DURATION_PLACEHOLDER', $duration.ToString() -replace 'RATE_PLACEHOLDER', $arrivalRate.ToString() | Set-Content $tmp -Encoding UTF8

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$report = Join-Path $scriptDir "results\report-$timestamp.json"

Write-Host "Running Artillery against $target for $duration seconds at $arrivalRate rps..."

artillery run $tmp -o $report

if (Test-Path $tmp) { Remove-Item $tmp }

Write-Host "Report written to $report"
