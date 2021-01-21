using Payroll.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace Payroll.Data.Models
{
    public class JobsiteDto
    {
        [Required(ErrorMessage = "A name for the jobsite is required.")]
        [MaxLength(50)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please provide a Moniker for the jobsite, ie: I4000.")]
        [MaxLength(6)]
        public string Moniker { get; set; }

        [Required]
        public LocationDto Location { get; set; }
    }
}
