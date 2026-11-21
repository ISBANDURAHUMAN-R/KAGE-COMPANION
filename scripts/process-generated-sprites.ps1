Add-Type -AssemblyName System.Drawing

$kageSrc = "C:\Users\dell\.gemini\antigravity\brain\404c3ea4-90b7-47cd-bf9c-3455c46446f6\kage_shadow_pet_1795002461420.jpg"
$chanSrcWhite = "C:\Users\dell\.gemini\antigravity\brain\404c3ea4-90b7-47cd-bf9c-3455c46446f6\kage_chan_chibi_1795002477875.jpg"
$chanSrcBlack = "C:\Users\dell\.gemini\antigravity\brain\404c3ea4-90b7-47cd-bf9c-3455c46446f6\kage_chan_chibi_black_bg_1795002511215.jpg"

$kageDest = "D:\WORKSPACE\ANTIGRAVITY\KAGE COMPANION\src\renderer\characters\kage\assets\kage-main.png"
$chanDest = "D:\WORKSPACE\ANTIGRAVITY\KAGE COMPANION\src\renderer\characters\kage-chan\assets\kage-chan-main.png"

# Process KAGE (Black background cutout with crimson aura preservation)
function Process-BlackBg([string]$inputPath, [string]$outputPath, [int]$blackThreshold = 18) {
    $src = [System.Drawing.Bitmap]::FromFile($inputPath)
    $w = $src.Width
    $h = $src.Height
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    $minX = $w; $maxX = 0; $minY = $h; $maxY = 0

    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $c = $src.GetPixel($x, $y)
            $lum = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))

            if ($lum -lt $blackThreshold -and $c.R -lt ($blackThreshold + 8)) {
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($lum -lt ($blackThreshold + 18) -and $c.G -lt 24 -and $c.B -lt 26) {
                $alpha = [int]((($lum - $blackThreshold) / 18.0) * 255)
                $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
                if ($alpha -gt 40) {
                    if ($x -lt $minX) { $minX = $x }
                    if ($x -gt $maxX) { $maxX = $x }
                    if ($y -lt $minY) { $minY = $y }
                    if ($y -gt $maxY) { $maxY = $y }
                }
            } else {
                $bmp.SetPixel($x, $y, $c)
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    $src.Dispose()

    # Crop to bounding box with 10px margin
    $minX = [Math]::Max(0, $minX - 10)
    $minY = [Math]::Max(0, $minY - 10)
    $cropW = [Math]::Min($w - $minX, ($maxX - $minX) + 20)
    $cropH = [Math]::Min($h - $minY, ($maxY - $minY) + 20)

    $cropped = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($cropped)
    $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)), (New-Object System.Drawing.Rectangle($minX, $minY, $cropW, $cropH)), [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Dispose()

    $cropped.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Host "Processed & Cropped BlackBg -> $outputPath ($cropW x $cropH)"
}

# Process KAGE-CHAN (White background cutout with smooth edge anti-aliasing)
function Process-WhiteBg([string]$inputPath, [string]$outputPath, [int]$whiteCutoff = 245) {
    $src = [System.Drawing.Bitmap]::FromFile($inputPath)
    $w = $src.Width
    $h = $src.Height
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    $minX = $w; $maxX = 0; $minY = $h; $maxY = 0

    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $c = $src.GetPixel($x, $y)
            $minVal = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))

            if ($minVal -ge $whiteCutoff) {
                # Pure white background -> transparent
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($minVal -gt ($whiteCutoff - 25)) {
                # Feather edge
                $alpha = [int](((255 - $minVal) / 25.0) * 255)
                $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
                if ($alpha -gt 40) {
                    if ($x -lt $minX) { $minX = $x }
                    if ($x -gt $maxX) { $maxX = $x }
                    if ($y -lt $minY) { $minY = $y }
                    if ($y -gt $maxY) { $maxY = $y }
                }
            } else {
                $bmp.SetPixel($x, $y, $c)
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    $src.Dispose()

    $minX = [Math]::Max(0, $minX - 10)
    $minY = [Math]::Max(0, $minY - 10)
    $cropW = [Math]::Min($w - $minX, ($maxX - $minX) + 20)
    $cropH = [Math]::Min($h - $minY, ($maxY - $minY) + 20)

    $cropped = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($cropped)
    $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)), (New-Object System.Drawing.Rectangle($minX, $minY, $cropW, $cropH)), [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Dispose()

    $cropped.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Host "Processed & Cropped WhiteBg -> $outputPath ($cropW x $cropH)"
}

Write-Host "Converting KAGE (Shadow Pet)..."
Process-BlackBg $kageSrc $kageDest 20

Write-Host "Converting KAGE-CHAN (Chibi Girl)..."
Process-WhiteBg $chanSrcWhite $chanDest 240
