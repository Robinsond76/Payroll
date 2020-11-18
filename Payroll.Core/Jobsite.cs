using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Payroll.Core
{
    public class Jobsite
    {
        [Key]
        public int JobsiteId { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        [Required]
        [MaxLength(6)]
        public string Moniker { get; set; }
        public Location Location { get; set; }
    }
}
