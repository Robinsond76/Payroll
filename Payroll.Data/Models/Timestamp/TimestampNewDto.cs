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
        public DateTimeOffset ClockedInStamp { get; set; }

        public DateTimeOffset LunchStamp { get; set; }
        [Required]
        public DateTimeOffset ClockedOutStamp { get; set; }
    }
}
