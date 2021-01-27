using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Payroll.Data.Models
{
    public class TimestampWithJobsiteDto
    {
        private string _totalTimeWorked;

        public int TimestampId { get; set; }
        public string Jobsite { get; set; }
        public string Moniker { get; set; }

        [JsonPropertyName("CurrentlyClockedIn")]
        public bool ClockedIn { get; set; }
        public DateTime ClockedInStamp { get; set; }
        public DateTime LunchStamp { get; set; }
        public DateTime ClockedOutStamp { get; set; }
        public string TotalTimeWorked { 
            get 
            {
                TimeSpan timeWorked;
                timeWorked = ClockedOutStamp - ClockedInStamp;
                //if (this.LunchStamp == System.DateTime.MinValue)
                //{
                //    timeWorked = ClockedOutStamp - ClockedInStamp;
                //} else
                //{
                //    timeWorked = (ClockedOutStamp.AddMinutes(-30) - ClockedInStamp);
                //}
                _totalTimeWorked = $"{timeWorked.Hours} hours and {timeWorked.Minutes} minutes";
                return _totalTimeWorked;
            } 
        }
    }
}
