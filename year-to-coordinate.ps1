param(
  [int] $year
)
$history_start = 3000000
if ($year -lt -$history_start) {
  Write-Error "This is for Human history."
  exit 1
}
$LB_YEARS = 100000
$SF_YEARS = 10000
$SR_YEARS = 1000
$CN_YEARS = 100
$VM_YEARS = 10
$BK_YEARS = 1
$CH_YEARS = 0.1
$SN_YEARS = 0.01
$SC_YEARS = 0.001

$compare = $year + $history_start
Write-Host "Historic Year: $compare"

$library = 1
if ($compare -gt $LB_YEARS) {
  $library = [int]($compare / $LB_YEARS)
  $compare -= ($library-1) * $LB_YEARS
}
$shelf = 1
if ($compare -gt $SF_YEARS) {
  $shelf = [int]($compare / $SF_YEARS)
  $compare -= ($shelf-1) * $SF_YEARS
}
$series = 1
if ($compare -gt $SR_YEARS) {
  $series = [int]($compare / $SR_YEARS)
  $compare -= ($series-1) * $SR_YEARS
}
$collection = 1
if ($compare -gt $CN_YEARS) {
  $collection = [int]($compare / $CN_YEARS)
  $compare -= ($collection-1) * $CN_YEARS
}
$volume = 1
if ($compare -gt $VM_YEARS) {
  $volume = [int]($compare / $VM_YEARS)
  $compare -= ($volume-1) * $VM_YEARS
}
$book = 1
if ($compare -gt $BK_YEARS) {
  $book = [int]($compare / $BK_YEARS)
  $compare -= ($book-1) * $BK_YEARS
}
$chapter = 1
if ($compare -gt $CH_YEARS) {
  $chapter = [int]($compare / $CH_YEARS)
  $compare -= ($chapter-1) * $CH_YEARS
}
$section = 1
if ($compare -gt $SN_YEARS) {
  $section = [int]($compare / $SN_YEARS)
  $compare -= ($section-1) * $SN_YEARS
}
$scroll = 1
if ($compare -gt $SC_YEARS) {
  $scroll = [int]($compare / $SC_YEARS)
  $compare -= $scroll * $SC_YEARS
}
if ($compare -gt $SC_YEARS -or $compare -lt -$SC_YEARS) {
  Write-Host "Error: $compare years remaining."
}

Write-Output "Library: $library"
Write-Output "Shelf: $shelf"
Write-Output "Series: $series"
Write-Output "Collection: $collection"
Write-Output "Volume: $volume"
Write-Output "Book: $book"
Write-Output "Chapter: $chapter"
Write-Output "Section: $section"
Write-Output "Scroll: $scroll"
Write-Output ""
Write-Output "Coordinate: $library.$shelf.$series/$collection.$volume.$book/$chapter.$section.$scroll"