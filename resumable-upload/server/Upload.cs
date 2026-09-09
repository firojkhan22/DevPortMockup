using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;

namespace ResumableUpload;

public sealed record UploadOptions
{
    public long ChunkSizeBytes { get; init; } = 10 * 1024 * 1024;
    public long MaxRequestBodyBytes { get; init; } = 30 * 1024 * 1024;
    public string AllowedOrigin { get; init; } = "http://localhost:5173";
    public string TempFolder { get; init; } = "uploads/temp";
    public string FinalFolder { get; init; } = "uploads/final";
    public string[] BlockedExtensions { get; init; } = { ".exe", ".bat", ".sh", ".vbs", ".js", ".cmd", ".com", ".msi", ".ps1", ".dll", ".scr" };
    public string[] BlockedMimeTypes { get; init; } = { "application/x-msdownload", "application/x-msdos-program", "application/x-bat", "application/x-sh", "text/javascript", "application/javascript", "application/x-httpd-php" };
}

public static class Upload
{
    public static readonly ConcurrentDictionary<string, SemaphoreSlim> Locks = new();

    public static SemaphoreSlim Gate(string token) => Locks.GetOrAdd(token, _ => new SemaphoreSlim(1, 1));

    public static string SafeName(string? name)
    {
        name = (name ?? string.Empty).Replace('\\', '/').Replace("\0", string.Empty);
        var i = name.LastIndexOf('/');
        return (i >= 0 ? name[(i + 1)..] : name).Trim();
    }

    public static string Token(string? hash) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(hash ?? string.Empty))).ToLowerInvariant();

    public static bool IsInside(string root, string path)
    {
        var r = Path.GetFullPath(root).TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar;
        return Path.GetFullPath(path).StartsWith(r, StringComparison.OrdinalIgnoreCase);
    }

    public static bool Blocked(string name, string? mime, IReadOnlySet<string> exts, IReadOnlySet<string> mimes)
    {
        var ext = Path.GetExtension(name).ToLowerInvariant();
        if (string.IsNullOrEmpty(ext) || exts.Contains(ext)) return true;
        return !string.IsNullOrEmpty(mime) && mimes.Contains(mime!.ToLowerInvariant());
    }
}
