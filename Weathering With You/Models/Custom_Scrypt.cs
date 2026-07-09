using System;
using Scrypt;

namespace Weathering_with_You_.Models
{
    // Wraps the Scrypt.NET ScryptEncoder (already referenced in the project) so passwords are
    // hashed with a real, salted, one-way KDF instead of being reversibly Base64-encoded.
    public static class Custom_Scrypt
    {
        private static readonly ScryptEncoder Encoder = new ScryptEncoder();

        // Hashes a plaintext password for storage. The returned string embeds the salt and
        // cost parameters, so it can be verified later without storing anything else.
        public static string HashPassword(string password)
        {
            return Encoder.Encode(password);
        }

        // Verifies a plaintext password attempt against a previously-hashed value.
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            return Encoder.Compare(password, hashedPassword);
        }
    }
}