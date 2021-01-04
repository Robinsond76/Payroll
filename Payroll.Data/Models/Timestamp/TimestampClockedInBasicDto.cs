using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Payroll.Data.Models
{
    public class TimestampClockedInBasicDto
    {
        public string Jobsite { get; set; }
        public string Moniker { get; set; }
        [JsonPropertyName("clockedIn")]
        public DateTime ClockedInStamp { get; set; }
    }
}
