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
        public DateTimeOffset ClockedInStamp { get; set; }
        public DateTimeOffset LunchStamp { get; set; }
        public DateTimeOffset ClockedOutStamp { get; set; }
    }
}
