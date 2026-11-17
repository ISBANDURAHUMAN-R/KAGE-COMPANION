Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\dell\.gemini\antigravity\brain\404c3ea4-90b7-47cd-bf9c-3455c46446f6\.user_uploaded\media_1794947374857_a00c477b.jpg"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

# Sample column X = 770 (center of middle column of expressions)
Write-Host "Scanning vertical brightness in column X = 770 (Blushing / Surprised)..."
for ($y = 0; $y -lt $img.Height; $y += 10) {
    $c = $img.GetPixel(770, $y)
    $b = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
    if ($b -gt 40) {
        Write-Host "Y=$y brightness=$b (R=$($c.R), G=$($c.G), B=$($c.B))"
    }
}

$img.Dispose()
