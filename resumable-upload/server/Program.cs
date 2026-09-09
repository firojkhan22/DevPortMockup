using Microsoft.AspNetCore.Http.Features;
using ResumableUpload;

var builder = WebApplication.CreateBuilder(args);

var opt = builder.Configuration.GetSection("Upload").Get<UploadOptions>() ?? new UploadOptions();

builder.WebHost.ConfigureKestrel(k => k.Limits.MaxRequestBodySize = opt.MaxRequestBodyBytes);
builder.Services.Configure<FormOptions>(f =>
{
    f.MultipartBodyLengthLimit = opt.MaxRequestBodyBytes;
    f.BufferBodyLengthLimit = opt.MaxRequestBodyBytes;
});
builder.Services.AddCors(c => c.AddPolicy("web", p => p
    .WithOrigins(opt.AllowedOrigin.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
    .WithMethods("GET", "POST")
    .AllowAnyHeader()));

var app = builder.Build();
app.UseCors("web");

var tempDir = Path.GetFullPath(opt.TempFolder);
var finalDir = Path.GetFullPath(opt.FinalFolder);
Directory.CreateDirectory(tempDir);
Directory.CreateDirectory(finalDir);
var blockedExt = opt.BlockedExtensions.Select(e => e.ToLowerInvariant()).ToHashSet();
var blockedMime = opt.BlockedMimeTypes.Select(m => m.ToLowerInvariant()).ToHashSet();

app.MapGet("/config", () => Results.Ok(new { chunkSize = opt.ChunkSizeBytes, maxRequestBody = opt.MaxRequestBodyBytes }));

app.MapGet("/status", (string hash) =>
{
    if (string.IsNullOrWhiteSpace(hash)) return Results.BadRequest(new { error = "missing hash" });
    var part = Path.Combine(tempDir, Upload.Token(hash) + ".part");
    var offset = File.Exists(part) ? new FileInfo(part).Length : 0;
    return Results.Ok(new { offset });
});

app.MapPost("/chunk", async (HttpRequest req) =>
{
    if (!req.HasFormContentType) return Results.BadRequest(new { error = "expected multipart/form-data" });
    var form = await req.ReadFormAsync();

    var hash = form["hash"].ToString();
    var safe = Upload.SafeName(form["fileName"].ToString());
    var file = form.Files["chunk"];
    if (string.IsNullOrWhiteSpace(hash)) return Results.BadRequest(new { error = "missing hash" });
    if (string.IsNullOrEmpty(safe)) return Results.BadRequest(new { error = "missing fileName" });
    if (file is null || file.Length == 0) return Results.BadRequest(new { error = "missing chunk" });
    if (file.Length > opt.ChunkSizeBytes) return Results.BadRequest(new { error = "chunk exceeds configured size" });
    if (!long.TryParse(form["offset"], out var offset) || offset < 0) return Results.BadRequest(new { error = "bad offset" });
    if (!long.TryParse(form["totalSize"], out var totalSize) || totalSize <= 0) return Results.BadRequest(new { error = "bad totalSize" });
    if (Upload.Blocked(safe, file.ContentType, blockedExt, blockedMime))
        return Results.Json(new { error = "file type not allowed" }, statusCode: StatusCodes.Status415UnsupportedMediaType);

    var token = Upload.Token(hash);
    var part = Path.Combine(tempDir, token + ".part");
    if (!Upload.IsInside(tempDir, part)) return Results.BadRequest(new { error = "path rejected" });

    var gate = Upload.Gate(token);
    await gate.WaitAsync();
    try
    {
        var current = File.Exists(part) ? new FileInfo(part).Length : 0;
        if (offset != current)
            return Results.Json(new { error = "offset mismatch", offset = current }, statusCode: StatusCodes.Status409Conflict);
        if (current + file.Length > totalSize)
            return Results.BadRequest(new { error = "chunk exceeds totalSize" });

        await using (var fs = new FileStream(part, FileMode.Append, FileAccess.Write, FileShare.None, 1 << 20, useAsync: true))
        await using (var src = file.OpenReadStream())
            await src.CopyToAsync(fs);

        var written = new FileInfo(part).Length;
        if (written < totalSize) return Results.Ok(new { offset = written, done = false });

        var finalName = $"{Guid.NewGuid():N}{Path.GetExtension(safe)}";
        var finalPath = Path.Combine(finalDir, finalName);
        if (!Upload.IsInside(finalDir, finalPath)) return Results.BadRequest(new { error = "path rejected" });
        File.Move(part, finalPath);
        Upload.Locks.TryRemove(token, out _);
        return Results.Ok(new { offset = written, done = true, file = finalName });
    }
    finally
    {
        gate.Release();
    }
});

app.Run();
