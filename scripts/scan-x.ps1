Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\dell\.gemini\antigravity\brain\404c3ea4-90b7-47cd-bf9c-3455c46446f6\.user_uploaded\media_1794947374857_a00c477b.jpg"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

Write-Host "Scanning horizontal brightness at Y=140 (Row 1)..."
for ($x = 500; $x -lt $img.Width; $x += 15) {
    $c = $img.GetPixel($x, 140)
    $b = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
    if ($b -gt 40) {
        Write-Host "X=$x brightness=$b"
    }
}

Write-Host "`nScanning horizontal brightness at Y=340 (Row 2)..."
for ($x = 500; $x -lt $img.Width; $x += 15) {
    $c = $img.GetPixel($x, 340)
    $b = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
    if ($b -gt 40) {
        Write-Host "X=$x brightness=$b"
    }
}

Write-Host "`nScanning horizontal brightness at Y=560 (Bottom Actions)..."
for ($x = 0; $x -lt 700; $x += 15) {
    $c = $img.GetPixel($x, 560)
    $b = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
    if ($b -gt 40) {
        Write-Host "X=$x brightness=$b"
    }
}

$img.Dispose()
