$exePath = "D:\WORKSPACE\ANTIGRAVITY\KAGE COMPANION\dist\win-unpacked\KAGE COMPANION.exe"
$workDir = "D:\WORKSPACE\ANTIGRAVITY\KAGE COMPANION\dist\win-unpacked"

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $exePath
$psi.WorkingDirectory = $workDir
$psi.UseShellExecute = $false
$psi.EnvironmentVariables.Remove("ELECTRON_RUN_AS_NODE")

$proc = [System.Diagnostics.Process]::Start($psi)
if ($proc) {
    Write-Host "KAGE COMPANION launched successfully with PID: $($proc.Id)"
} else {
    Write-Host "KAGE COMPANION process launched."
}
