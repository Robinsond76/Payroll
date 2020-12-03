using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Payroll.Data.Models
{
    public class TimestampWithUserDto
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }

        [JsonPropertyName("CurrentlyClockedIn")]
        public bool ClockedIn { get; set; }
        public DateTime ClockedInStamp { get; set; }
        public DateTime LunchStamp { get; set; }
        public DateTime ClockedOutStamp { get; set; }
    }
}
