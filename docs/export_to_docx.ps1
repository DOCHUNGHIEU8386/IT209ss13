# PowerShell Script để chuyển đổi REPORT_BAO_CAO_SESSION_13.html thành BAO_CAO_MINI_PROJECT_SESSION_13.docx
# Cách chạy: Chuột phải vào file -> Chọn "Run with PowerShell" hoặc gõ trong terminal: .\export_to_docx.ps1

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$HtmlPath = Join-Path $ScriptDir "REPORT_BAO_CAO_SESSION_13.html"
$DocxPath = Join-Path $ScriptDir "BAO_CAO_MINI_PROJECT_SESSION_13.docx"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ĐANG XUẤT BÁO CÁO SESSION 13 SANG FILE WORD (.DOCX)     " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Thử dùng Word COM Object (nếu máy có cài Microsoft Office Word)
try {
    Write-Host "[1/2] Đang kiểm tra Microsoft Word COM Object..." -ForegroundColor Gray
    $Word = New-Object -ComObject Word.Application
    $Word.Visible = $false
    $Doc = $Word.Documents.Open($HtmlPath)
    # wdFormatXMLDocument = 16 (.docx)
    $Doc.SaveAs2($DocxPath, 16)
    $Doc.Close()
    $Word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($Word) | Out-Null
    Write-Host "[THÀNH CÔNG] Đã tạo file Word: $DocxPath" -ForegroundColor Green
    exit 0
} catch {
    Write-Host "[THÔNG BÁO] Không dùng được Word COM, chuyển sang chạy script Python..." -ForegroundColor Yellow
}

# 2. Thử dùng Python nếu có
try {
    $PyScript = Join-Path $ScriptDir "export_to_docx.py"
    python $PyScript
    if (Test-Path $DocxPath) {
        Write-Host "[THÀNH CÔNG] Đã tạo file Word qua Python: $DocxPath" -ForegroundColor Green
        exit 0
    }
} catch {
    Write-Host "[LƯU Ý] Bạn có thể mở trực tiếp file 'REPORT_BAO_CAO_SESSION_13.html' bằng Microsoft Word và chọn File -> Save As -> Word Document (.docx)!" -ForegroundColor Cyan
}
