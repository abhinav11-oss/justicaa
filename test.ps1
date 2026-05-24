try {
    $response = Invoke-RestMethod -Uri 'https://dtkoulzbrvzuobddmizk.supabase.co/functions/v1/document-summarizer' -Method Post -Headers @{'Content-Type'='application/json'} -Body '{"text":"test"}'
    Write-Output $response
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $errorBody = $reader.ReadToEnd()
    Write-Output "Error Body: $errorBody"
}
