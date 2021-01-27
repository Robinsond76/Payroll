using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Payroll.Data.Models
{
    public class TimestampNewDto
    {
        [Required]
        public string Username { get; set; }
        [Required] 
        public string Moniker { get; set; }

        [Required]
        public DateTime ClockedInStamp { get; set; }

        public DateTime LunchStamp { get; set; }
        [Required]
        public DateTime ClockedOutStamp { get; set; }
    }
}
