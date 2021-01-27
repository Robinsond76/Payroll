using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Payroll.Data.Models
{
    public class TimestampEditDto
    {
        [Required]
        public DateTime ClockedInStamp { get; set; }

        public DateTime LunchStamp { get; set; }
        [Required]
        public DateTime ClockedOutStamp { get; set; }
    }
}
