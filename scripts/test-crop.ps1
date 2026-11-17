Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\dell\.gemini\antigravity\brain\404c3ea4-90b7-47cd-bf9c-3455c46446f6\.user_uploaded\media_1794947374857_a00c477b.jpg"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Image successfully loaded: Width=$($img.Width), Height=$($img.Height)"
$img.Dispose()
